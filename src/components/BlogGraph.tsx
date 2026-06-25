'use client';

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Delaunay } from "d3-delaunay";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import type { BlogPost } from "@/lib/blog";
import { documentToPlainText } from "@/lib/blog";

interface BlogGraphProps {
  posts?: BlogPost[];
}


const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const stopwords = new Set<string>([
  "a", "o", "os", "as", "um", "uma", "uns", "umas",
  "de", "do", "da", "dos", "das", "em", "no", "na", "nos", "nas",
  "por", "pelo", "pela", "pelos", "pelas", "para", "pro", "pra",
  "com", "sem", "sob", "sobre", "entre", "até", "ao", "aos",
  "eu", "tu", "ele", "ela", "nós", "vós", "eles", "elas",
  "me", "te", "se", "lhe", "lhes", "mim", "comigo", "ti", "contigo", "consigo",
  "meu", "minha", "meus", "minhas", "teu", "tua", "teus", "tuas",
  "seu", "sua", "seus", "suas", "nosso", "nossa", "nossos", "nossas",
  "este", "esta", "estes", "estas", "esse", "essa", "esses", "essas",
  "aquele", "aquela", "aqueles", "aquelas", "isso", "isto", "aquilo",
  "que", "quem", "qual", "quais", "cujo", "cuja", "cujos", "cujas",
  "e", "ou", "mas", "porém", "contudo", "todavia", "entretanto",
  "pois", "porque", "como", "se", "logo", "portanto", "assim", "nem",
  "é", "era", "foi", "será", "são", "eram", "foram", "serão", "sou", "somos", "sendo", "sido",
  "está", "estava", "esteve", "estará", "estão", "estavam", "estiveram", "estarão", "estou", "estamos", "estando", "estado",
  "tem", "tinha", "teve", "terá", "têm", "tinham", "tiveram", "terão", "tenho", "temos", "tendo", "tido",
  "há", "houve", "houveram", "vai", "vão", "fui", "vamos",
  "não", "sim", "já", "mais", "menos", "muito", "pouco", "tão",
  "também", "só", "apenas", "ainda", "quando", "onde", "depois", "antes",
  "mesmo", "mesma", "mesmos", "mesmas", "qualquer", "cada", "tudo", "nada", "algo",
]);

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopwords.has(token));

const dot = (a: number[], b: number[]) =>
  a.reduce((sum, value, index) => sum + value * b[index], 0);

const square = (value: number) => value * value;

const mean = (array: number[]) =>
  array.reduce((sum, value) => sum + value, 0) / Math.max(array.length, 1);

const centerMatrix = (matrix: number[][]) => {
  const n = matrix.length;
  const rowMeans = matrix.map((row) => mean(row));
  const colMeans = Array.from({ length: n }, (_, j) =>
    mean(matrix.map((row) => row[j]))
  );
  const totalMean = mean(rowMeans);
  return matrix.map((row, i) =>
    row.map((value, j) => value - rowMeans[i] - colMeans[j] + totalMean)
  );
};

const normalizeVector = (vector: number[]) => {
  const length = Math.sqrt(dot(vector, vector));
  return length === 0 ? vector : vector.map((value) => value / length);
};

const polygonBounds = (polygon: Array<[number, number]>) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of polygon) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  return { width: maxX - minX, height: maxY - minY };
};

const polygonCentroid = (polygon: Array<[number, number]>) => {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const [x0, y0] = polygon[i];
    const [x1, y1] = polygon[(i + 1) % polygon.length];
    const a = x0 * y1 - x1 * y0;
    area += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }
  if (area === 0) {
    const sum = polygon.reduce(
      (acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }),
      { x: 0, y: 0 }
    );
    return { x: sum.x / polygon.length, y: sum.y / polygon.length };
  }
  area *= 0.5;
  return { x: cx / (6 * area), y: cy / (6 * area) };
};

const wrapLabel = (
  text: string,
  maxWidth: number,
  approxCharWidth = 7.5,
  maxLines = 2
) => {
  const maxChars = Math.max(Math.floor(maxWidth / approxCharWidth), 6);
  if (text.length <= maxChars) {
    return [text];
  }

  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    let candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) {
        lines.push(current);
        current = word;
        candidate = word;
      }
      while (candidate.length > maxChars) {
        lines.push(candidate.slice(0, maxChars));
        candidate = candidate.slice(maxChars);
      }
      current = candidate;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const head = lines.slice(0, maxLines - 1).join(" ");
  const tail = lines.slice(maxLines - 1).join(" ");
  return [head, tail];
};

const powerIteration = (
  matrix: number[][],
  iterations = 100
): { value: number; vector: number[] } => {
  const n = matrix.length;
  let vector = Array.from({ length: n }, () => 1 / Math.sqrt(n));
  let eigenvalue = 0;

  for (let i = 0; i < iterations; i += 1) {
    const nextVector = matrix.map((row) => dot(row, vector));
    const norm = Math.sqrt(dot(nextVector, nextVector));
    if (norm === 0) {
      break;
    }
    vector = nextVector.map((value) => value / norm);
    eigenvalue = dot(vector, matrix.map((row) => dot(row, vector)));
  }

  return { value: eigenvalue, vector };
};

type NodeState = {
  slug: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
};

export default function BlogGraph({ posts }: BlogGraphProps) {
  const { text, border } = useThemeClasses();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoverPointerRef = useRef<{ x: number; y: number; slug: string } | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [remotePosts, setRemotePosts] = useState<BlogPost[]>([]);
  const resolvedPosts = posts ?? remotePosts;
  const postCount = resolvedPosts.length;
  const wobble = React.useMemo(
    () => Math.min(0.02 + 0.004 * postCount, 0.14),
    [postCount]
  );

  useEffect(() => {
    if (posts) {
      setRemotePosts([]);
      return;
    }

    let isMounted = true;

    const loadPosts = async () => {
      try {
        const response = await fetch("/api/blog-posts");
        if (!response.ok) {
          throw new Error(`Failed to load blog posts: ${response.status}`);
        }

        const data = (await response.json()) as BlogPost[];

        if (isMounted) {
          setRemotePosts(data);
        }
      } catch {
        if (isMounted) {
          setRemotePosts([]);
        }
      }
    };

    void loadPosts();

    return () => {
      isMounted = false;
    };
  }, [posts]);

  const isMobile = size.width > 0 && size.width <= 768;
  const graphSize = {
    width: size.width,
    height: Math.max(size.height, isMobile ? 1400 : size.height),
  };

  const semanticPositions = useMemo(() => {
    if (graphSize.width === 0 || graphSize.height === 0) {
      return [];
    }

    if (resolvedPosts.length === 0) {
      return [];
    }

    const texts = resolvedPosts.map((post) => {
      const bodyText = post.body ? documentToPlainText(post.body) : "";
      const tagsText = Array.isArray(post.tags) ? post.tags.join(" ") : "";

      return [post.title, post.author, post.excerpt, bodyText, tagsText]
        .filter(Boolean)
        .join(" ");
    });

    const termCounts = texts.map((text) => {
      const counts = new Map<string, number>();
      for (const term of tokenize(text)) {
        counts.set(term, (counts.get(term) ?? 0) + 1);
      }
      return counts;
    });

    const docCount = termCounts.length;
    const documentFrequency = new Map<string, number>();
    for (const counts of termCounts) {
      for (const term of counts.keys()) {
        documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
      }
    }

    const vocabulary = Array.from(documentFrequency.keys());
    const tfidf = termCounts.map((counts) =>
      normalizeVector(
        vocabulary.map((term) => {
          const tf = counts.get(term) ?? 0;
          const idf = Math.log((docCount + 1) / ((documentFrequency.get(term) ?? 0) + 1)) + 1;
          return tf * idf;
        })
      )
    );

    const squaredDistances = tfidf.map((vectorA) =>
      tfidf.map((vectorB) => square(1 - dot(vectorA, vectorB)))
    );

    const centered = centerMatrix(squaredDistances);
    const B = centered.map((row) => row.map((value) => -0.5 * value));

    const primary = powerIteration(B, 120);
    const deflated = B.map((row, rowIndex) =>
      row.map((value, columnIndex) =>
        value - primary.value * primary.vector[rowIndex] * primary.vector[columnIndex]
      )
    );
    const secondary = powerIteration(deflated, 120);

    const xCoords = primary.vector.map((value) => value * Math.sqrt(Math.max(primary.value, 0)));
    const yCoords = secondary.vector.map((value) => value * Math.sqrt(Math.max(secondary.value, 0)));

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);
    const margin = isMobile ? 100 : 80;
    const usableWidth = Math.max(graphSize.width - margin * 2, 1);
    const heightShrinkFactor = isMobile ? Math.max(1.6, 1 + postCount * 0.1) : 2;
    const usableHeight = Math.max(graphSize.height - margin * heightShrinkFactor, 1);
    const rangeX = Math.max(maxX - minX, 0.1);
    const rangeY = Math.max(maxY - minY, 0.1);

    if (resolvedPosts.length === 1) {
      return [
        {
          slug: resolvedPosts[0].slug,
          x: graphSize.width / 2,
          y: graphSize.height / 2,
          targetX: graphSize.width / 2,
          targetY: graphSize.height / 2,
          vx: 0,
          vy: 0,
        },
      ];
    }

    if (resolvedPosts.length === 2) {
      return resolvedPosts.map((post, index) => ({
        slug: post.slug,
        x: graphSize.width * (index === 0 ? 0.3 : 0.7),
        y: graphSize.height / 2,
        targetX: graphSize.width * (index === 0 ? 0.3 : 0.7),
        targetY: graphSize.height / 2,
        vx: 0,
        vy: 0,
      }));
    }

    const positions = resolvedPosts.map((post, index) => ({
      slug: post.slug,
      x: margin + ((xCoords[index] - minX) / rangeX) * usableWidth,
      y: margin + ((yCoords[index] - minY) / rangeY) * usableHeight,
      targetX: margin + ((xCoords[index] - minX) / rangeX) * usableWidth,
      targetY: margin + ((yCoords[index] - minY) / rangeY) * usableHeight,
      vx: 0,
      vy: 0,
    }));

    const spacingFactor = Math.min(0.08 + postCount * 0.0015, 0.12);
    const minSpacing = Math.max(
      Math.min(graphSize.width, graphSize.height) * spacingFactor,
      isMobile ? 90 : 70,
      40 + postCount * 8
    );
    const pushFactor = Math.min(0.06 + postCount * 0.003, 0.12);
    for (let iteration = 0; iteration < 4; iteration += 1) {
      for (let i = 0; i < positions.length; i += 1) {
        for (let j = i + 1; j < positions.length; j += 1) {
          const a = positions[i];
          const b = positions[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const overlap = minSpacing - dist;
          if (overlap > 0) {
            const push = overlap * pushFactor;
            const ux = dx / dist;
            const uy = dy / dist;
            a.x -= ux * push;
            a.y -= uy * push;
            b.x += ux * push;
            b.y += uy * push;
          }
        }
      }
    }

    return positions;
  }, [graphSize.width, graphSize.height, isMobile, resolvedPosts]);

  useEffect(() => {
    if (semanticPositions.length === 0) {
      setNodes([]);
      return;
    }

    setNodes((prev) => {
      const existing = new Map(prev.map((node) => [node.slug, node]));
      return semanticPositions.map((position) => {
        const prevNode = existing.get(position.slug);
        if (!prevNode) {
          return position;
        }
        return {
          ...prevNode,
          targetX: position.targetX,
          targetY: position.targetY,
        };
      });
    });
  }, [semanticPositions]);

  const voronoi = useMemo(() => {
    if (graphSize.width === 0 || graphSize.height === 0 || nodes.length === 0) {
      return null;
    }

    const points = nodes.map((node) => [node.x, node.y] as [number, number]);
    const delaunay = Delaunay.from(points);
    return delaunay.voronoi([0, 0, graphSize.width, graphSize.height]);
  }, [nodes, graphSize.width, graphSize.height]);

  const cellPaths = useMemo(() => {
    if (!voronoi) {
      return [];
    }

    return nodes.map((node, index) => {
      const polygon = voronoi.cellPolygon(index);
      if (!polygon) {
        return {
          slug: node.slug,
          path: null,
          center: { x: node.x, y: node.y },
          bounds: { width: 0, height: 0 },
        };
      }

      return {
        slug: node.slug,
        path:
          polygon
            .map((point, pointIndex) =>
              `${pointIndex === 0 ? "M" : "L"} ${point[0]} ${point[1]}`
            )
            .join(" ") + " Z",
        center: polygonCentroid(polygon),
        bounds: polygonBounds(polygon),
      };
    });
  }, [nodes, voronoi]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const element = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (nodes.length === 0) {
      return;
    }

    let frameId: number;
    const animate = () => {
      setNodes((prev) => {
        const rect = containerRef.current?.getBoundingClientRect();
        return prev.map((node) => {
          const dx = node.targetX - node.x;
          const dy = node.targetY - node.y;
          let ax = dx * 0.04;
          let ay = dy * 0.04;

          ax += (Math.random() - 0.5) * wobble;
          ay += (Math.random() - 0.5) * wobble;

          const hoverPointer = hoverPointerRef.current;
          const hover =
            activeSlug === node.slug && hoverPointer?.slug === node.slug;
          if (hover && rect && hoverPointer) {
            const pointerX = hoverPointer.x - rect.left;
            const pointerY = hoverPointer.y - rect.top;
            const rx = node.x - pointerX;
            const ry = node.y - pointerY;
            const rDist = Math.sqrt(rx * rx + ry * ry) || 0.1;
            const strength = Math.max(0, 1 - Math.min(rDist / 180, 1));
            ax += (rx / rDist) * 0.35 * strength;
            ay += (ry / rDist) * 0.35 * strength;
          }

          const vx = clamp((node.vx + ax) * 0.88, -3, 3);
          const vy = clamp((node.vy + ay) * 0.88, -3, 3);
          const x = clamp(node.x + vx, 0, graphSize.width);
          const y = clamp(node.y + vy, 0, graphSize.height);

          return { ...node, x, y, vx, vy };
        });
      });

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [nodes.length, activeSlug, graphSize.width, graphSize.height, wobble]);

  return (
    <div className={`min-h-screen flex flex-col overflow-hidden ${text}`}>
    

      <div
        ref={containerRef}
        className="relative flex-1 overflow-y-auto overflow-x-hidden select-none"
      >
        <svg
          className="block"
          width="100%"
          height={graphSize.height}
          viewBox={`0 0 ${graphSize.width} ${graphSize.height}`}
        >
          {cellPaths.map(({ slug, path, center, bounds }) => {
            if (!path || !center) {
              return null;
            }
            const post = resolvedPosts.find((item) => item.slug === slug);
            if (!post) {
              return null;
            }

            const isActive = activeSlug === slug;
            const screenScale = clamp(
              Math.min(graphSize.width / 1440, graphSize.height / 900),
              0.7,
              1.05
            );
            const mobileFontFactor = isMobile ? 0.38 * postCount : 1;
            const authorScale = isMobile ? 0.8 : 1;
            const maxTextWidth = Math.max(Math.min(bounds.width - 18, graphSize.width * 0.55), 40);
            const widthThreshold = graphSize.width / 4;
            const widthScale = clamp(maxTextWidth / widthThreshold, 0.65, 2);
            const titleFontSize = Math.round(
              clamp(20 * screenScale * widthScale * mobileFontFactor, 8, 18)
            );
            const authorFontSize = Math.round(
              clamp(11 * screenScale * widthScale * authorScale, 9, 15)
            );
            const approxCharWidth = (isMobile ? 12.2 : 7.5) * (titleFontSize / 16);
            const titleLines = wrapLabel(
              post.title,
              maxTextWidth,
              approxCharWidth,
              isMobile ? 3 : 2
            );
            const authorLine = post.author?.trim() || post.sourceLabel?.trim() || "Campo Esquerdo";
            const authorDy = titleLines.length === 1 ? "1.4em" : "1.6em";

            return (
              <g
                key={slug}
                onPointerEnter={() => setActiveSlug(slug)}
                onPointerMove={(event) => {
                  hoverPointerRef.current = {
                    slug,
                    x: event.clientX,
                    y: event.clientY,
                  };
                }}
                onPointerLeave={() => {
                  setActiveSlug(null);
                  hoverPointerRef.current = null;
                }}
                onClick={() => router.push(`/blog/${slug}`)}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={path}
                  fill={isActive ? "#000000" : "#ffffff"}
                  stroke="#000000"
                  strokeWidth={1.5}
                />
                <text
                  x={center.x}
                  y={center.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isActive ? "#ffffff" : "#000000"}
                  style={{ fontFamily: "ui-monospace, monospace", pointerEvents: "none" }}
                >
                  {titleLines.map((line, index) => (
                    <tspan
                      key={line}
                      x={center.x}
                      dy={index === 0 ? (titleLines.length === 1 ? "0em" : "-0.6em") : "1.2em"}
                      fontSize={titleFontSize}
                      fontWeight="700"
                    >
                      {line}
                    </tspan>
                  ))}
                  <tspan x={center.x} dy={authorDy} fontSize={authorFontSize} fontWeight="400">
                    {authorLine}
                  </tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    
      
    </div>
    
  );
}
