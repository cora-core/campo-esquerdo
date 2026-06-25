# BlogGraph.tsx — Line-by-Line Explanation

This file explains every line of `src/components/BlogGraph.tsx` so you can learn how it works exactly.

1. `'use client';` — In Next.js, this marks the file as a client component, so it can use browser-only APIs and React hooks like `useState`.
2. ``import React, { useEffect, useMemo, useRef, useState } from "react";`` — Imports React and four hooks used throughout the component.
3. ``import { useRouter } from "next/navigation";`` — Imports Next.js router for programmatic navigation inside the client component.
4. ``import { Delaunay } from "d3-delaunay";`` — Imports the Delaunay library used for generating Voronoi cells around points.
5. ``import { useThemeClasses } from "@/hooks/useThemeClasses";`` — Imports a custom hook to get theme-related class names.
6. ``import type { BlogPost } from "@/lib/blog";`` — Imports the TypeScript type definition for a blog post.
7. ``import { documentToPlainText } from "@/lib/blog";`` — Imports a utility to convert rich blog content into plain text.
8. ``interface BlogGraphProps {`` — Begins the component's props interface definition.
9. ``  posts?: BlogPost[];`` — Defines an optional `posts` prop that can be an array of `BlogPost` objects.
10. ``}`` — Closes the interface definition.

11. ``const clamp = (value: number, min: number, max: number) =>`` — Defines a helper function named `clamp`.
12. ``  Math.min(Math.max(value, min), max);`` — `clamp` ensures a value stays between `min` and `max`.

13. ``const stopwords = new Set<string>([`` — Creates a set of Portuguese stopwords to ignore when tokenizing text.
14-67. These lines list each stopword string in Portuguese. The set is used to remove common words like "a", "de", "que", "é" from text analysis.
68. ``]);`` — Closes the stopwords set.

69. ``const tokenize = (text: string) =>`` — Starts the `tokenize` function that converts text into meaningful terms.
70. ``  text`` — Begins processing the input text.
71. ``    .toLowerCase()`` — Converts text to lowercase for case-insensitive matching.
72. ``    .normalize("NFD")`` — Normalizes accented characters into decomposed form.
73. ``    .replace(/[0-6f]/g, "")`` — Removes accent marks from letters.
74. ``    .replace(/[^a-z0-9\s]/g, " ")`` — Replaces any non-alphanumeric or whitespace characters with spaces.
75. ``    .split(/\s+/)`` — Splits the cleaned text into tokens using whitespace.
76. ``    .filter((token) => token.length > 2 && !stopwords.has(token));`` — Removes short tokens and stopwords.

77. ``const dot = (a: number[], b: number[]) =>`` — Defines dot product for two vectors.
78. ``  a.reduce((sum, value, index) => sum + value * b[index], 0);`` — Computes the dot product by summing element-wise multiplication.

79. ``const square = (value: number) => value * value;`` — Defines a helper to square a number.

80. ``const mean = (array: number[]) =>`` — Starts the mean calculation function.
81. ``  array.reduce((sum, value) => sum + value, 0) / Math.max(array.length, 1);`` — Sums array values and divides by length, avoiding division by zero.

82. ``const centerMatrix = (matrix: number[][]) => {`` — Begins a function that centers a matrix for multidimensional scaling.
83. ``  const n = matrix.length;`` — Stores the number of rows.
84. ``  const rowMeans = matrix.map((row) => mean(row));`` — Computes the mean of each row.
85. ``  const colMeans = Array.from({ length: n }, (_, j) =>`` — Creates an array of column means.
86. ``    mean(matrix.map((row) => row[j]))`` — Computes the mean for column `j`.
87. ``  );`` — Closes the `Array.from` call.
88. ``  const totalMean = mean(rowMeans);`` — Computes the grand mean of the row means.
89. ``  return matrix.map((row, i) =>`` — Maps each row to a centered row.
90. ``    row.map((value, j) => value - rowMeans[i] - colMeans[j] + totalMean)`` — Applies double centering to each entry.
91. ``  );`` — Closes the row mapping.
92. ``};`` — Ends `centerMatrix`.

93. ``const normalizeVector = (vector: number[]) => {`` — Starts a function to normalize a vector.
94. ``  const length = Math.sqrt(dot(vector, vector));`` — Computes vector length using dot product.
95. ``  return length === 0 ? vector : vector.map((value) => value / length);`` — Returns the normalized vector or the original if length is zero.
96. ``};`` — Ends `normalizeVector`.

97. ``const polygonBounds = (polygon: Array<[number, number]>) => {`` — Begins a helper to measure polygon bounds.
98. ``  let minX = Infinity;`` — Initializes minimum X coordinate.
99. ``  let minY = Infinity;`` — Initializes minimum Y coordinate.
100. ``  let maxX = -Infinity;`` — Initializes maximum X coordinate.
101. ``  let maxY = -Infinity;`` — Initializes maximum Y coordinate.
102. ``  for (const [x, y] of polygon) {`` — Iterates over each point in the polygon.
103. ``    if (x < minX) minX = x;`` — Updates minimum X.
104. ``    if (y < minY) minY = y;`` — Updates minimum Y.
105. ``    if (x > maxX) maxX = x;`` — Updates maximum X.
106. ``    if (y > maxY) maxY = y;`` — Updates maximum Y.
107. ``  }`` — Ends loop.
108. ``  return { width: maxX - minX, height: maxY - minY };`` — Returns width and height of the bounding box.
109. ``};`` — Ends `polygonBounds`.

110. ``const polygonCentroid = (polygon: Array<[number, number]>) => {`` — Begins centroid calculation for a polygon.
111. ``  let area = 0;`` — Initializes signed area accumulator.
112. ``  let cx = 0;`` — Initializes centroid X accumulator.
113. ``  let cy = 0;`` — Initializes centroid Y accumulator.
114. ``  for (let i = 0; i < polygon.length; i += 1) {`` — Iterates through polygon vertices.
115. ``    const [x0, y0] = polygon[i];`` — Gets current point.
116. ``    const [x1, y1] = polygon[(i + 1) % polygon.length];`` — Gets next point, wrapping to the first at the end.
117. ``    const a = x0 * y1 - x1 * y0;`` — Computes cross product term.
118. ``    area += a;`` — Adds to the signed area.
119. ``    cx += (x0 + x1) * a;`` — Adds to X centroid accumulator.
120. ``    cy += (y0 + y1) * a;`` — Adds to Y centroid accumulator.
121. ``  }`` — Ends vertex loop.
122. ``  if (area === 0) {`` — Handles degenerate polygons with zero area.
123. ``    const sum = polygon.reduce(`` — Computes a simple average of vertices.
124. ``      (acc, [x, y]) => ({ x: acc.x + x, y: acc.y + y }),`` — Adds each point to the accumulator.
125. ``      { x: 0, y: 0 }`` — Starts the accumulator at zero.
126. ``    );`` — Closes the `reduce` call.
127. ``    return { x: sum.x / polygon.length, y: sum.y / polygon.length };`` — Returns the average point.
128. ``  }`` — Ends degenerate polygon check.
129. ``  area *= 0.5;`` — Converts signed area to actual area.
130. ``  return { x: cx / (6 * area), y: cy / (6 * area) };`` — Returns the polygon centroid.
131. ``};`` — Ends `polygonCentroid`.

132. ``const wrapLabel = (`` — Starts a function to split text into one or two lines.
133. ``  text: string,`` — The input text.
134. ``  maxWidth: number,`` — The maximum width available.
135. ``  approxCharWidth = 7.5,`` — Approximate width of characters in pixels.
136. ``  maxLines = 2`` — Maximum number of label lines.
137. ``) => {`` — Ends function signature.
138. ``  const maxChars = Math.max(Math.floor(maxWidth / approxCharWidth), 6);`` — Computes the maximum number of characters per line.
139. ``  if (text.length <= maxChars) {`` — If text is short enough for one line...
140. ``    return [text];`` — ...return it as a single line.
141. ``  }`` — Ends the check.
142. ``  const words = text.split(" ");`` — Split text into words.
143. ``  const lines: string[] = [];`` — Prepare an array for output lines.
144. ``  let current = "";`` — Tracks the current line being built.
145. ``  for (const word of words) {`` — Iterate over each word.
146. ``    let candidate = current ? `${current} ${word}` : word;`` — Build a candidate line.
147. ``    if (candidate.length > maxChars) {`` — If the candidate is too long...
148. ``      if (current) {`` — ...and there is an existing current line.
149. ``        lines.push(current);`` — Add the current line to output.
150. ``        current = word;`` — Start a new line with the current word.
151. ``        candidate = word;`` — Reset the candidate line.
152. ``      }`` — End the nested check.
153. ``      while (candidate.length > maxChars) {`` — If a single word is still too long...
154. ``        lines.push(candidate.slice(0, maxChars));`` — Break it into pieces.
155. ``        candidate = candidate.slice(maxChars);`` — Keep the remainder.
156. ``      }`` — End long-word loop.
157. ``      current = candidate;`` — Store the remaining text.
158. ``    } else {`` — If the candidate fits...
159. ``      current = candidate;`` — Keep building the line.
160. ``    }`` — Ends the length check.
161. ``  }`` — Ends the word loop.
162. ``  if (current) {`` — If there is leftover text.
163. ``    lines.push(current);`` — Add the final line.
164. ``  }`` — Ends leftover check.
165. ``  if (lines.length <= maxLines) {`` — If we have at most the allowed lines...
166. ``    return lines;`` — Return them.
167. ``  }`` — Else we need to compress.
168. ``  const head = lines.slice(0, maxLines - 1).join(" ");`` — Join the early lines into the first line.
169. ``  const tail = lines.slice(maxLines - 1).join(" ");`` — Join the remaining text into the last line.
170. ``  return [head, tail];`` — Return the compressed two-line result.
171. ``};`` — Ends `wrapLabel`.

172. ``const powerIteration = (`` — Starts the power iteration method to estimate eigenvalues.
173. ``  matrix: number[][],`` — Accepts a square matrix.
174. ``  iterations = 100`` — Maximum number of iterations.
175. ``): { value: number; vector: number[] } => {`` — Returns an eigenvalue and eigenvector.
176. ``  const n = matrix.length;`` — Determines vector length.
177. ``  let vector = Array.from({ length: n }, () => 1 / Math.sqrt(n));`` — Starts with a normalized uniform vector.
178. ``  let eigenvalue = 0;`` — Initializes the eigenvalue.
179. ``  for (let i = 0; i < iterations; i += 1) {`` — Iterates to converge the result.
180. ``    const nextVector = matrix.map((row) => dot(row, vector));`` — Multiply matrix by vector.
181. ``    const norm = Math.sqrt(dot(nextVector, nextVector));`` — Compute the length of the new vector.
182. ``    if (norm === 0) {`` — If the vector is zero...
183. ``      break;`` — Stop early.
184. ``    }`` — End the condition.
185. ``    vector = nextVector.map((value) => value / norm);`` — Normalize the vector.
186. ``    eigenvalue = dot(vector, matrix.map((row) => dot(row, vector)));`` — Estimate the eigenvalue.
187. ``  }`` — End the iteration loop.
188. ``  return { value: eigenvalue, vector };`` — Return the result.
189. ``};`` — Ends `powerIteration`.

190. ``type NodeState = {`` — Defines the shape of a node used in the graph.
191. ``  slug: string;`` — The blog post slug.
192. ``  x: number;`` — Current x coordinate.
193. ``  y: number;`` — Current y coordinate.
194. ``  vx: number;`` — Current x velocity.
195. ``  vy: number;`` — Current y velocity.
196. ``  targetX: number;`` — Desired x coordinate.
197. ``  targetY: number;`` — Desired y coordinate.
198. ``};`` — Closes the type.

199. ``export default function BlogGraph({ posts }: BlogGraphProps) {`` — Starts the default exported component.
200. ``  const { text, border } = useThemeClasses();`` — Uses theme classes for text and border styling.
201. ``  const router = useRouter();`` — Gets Next.js navigation router.
202. ``  const containerRef = useRef<HTMLDivElement | null>(null);`` — Stores a ref to the outer container.
203. ``  const hoverPointerRef = useRef<{ x: number; y: number; slug: string } | null>(null);`` — Stores pointer hover position for interaction.
204. ``  const [size, setSize] = useState({ width: 0, height: 0 });`` — Tracks container width and height.
205. ``  const [nodes, setNodes] = useState<NodeState[]>([]);`` — Tracks the graph nodes with position and velocity.
206. ``  const [activeSlug, setActiveSlug] = useState<string | null>(null);`` — Tracks which node is hovered.
207. ``  const [remotePosts, setRemotePosts] = useState<BlogPost[]>([]);`` — Stores posts loaded from the API when `posts` is not provided.
208. ``  const resolvedPosts = posts ?? remotePosts;`` — Uses passed-in posts or remote posts.
209. ``  const postCount = resolvedPosts.length;`` — Number of posts currently available.
210. ``  const wobble = React.useMemo(`` — Computes a wobble amount used in animation.
211. ``    () => Math.min(0.02 + 0.004 * postCount, 0.14),`` — Wobble grows with post count, capped at 0.14.
212. ``    [postCount]`` — Recomputes only when `postCount` changes.
213. ``  );`` — Closes `useMemo`.

214. ``  useEffect(() => {`` — Starts an effect for loading posts when none are passed.
215. ``    if (posts) {`` — If posts were passed in explicitly...
216. ``      setRemotePosts([]);`` — ...clear remote posts so they don't interfere.
217. ``      return;`` — Exit early from the effect.
218. ``    }`` — End the condition.
219. ``    let isMounted = true;`` — Tracks whether the component is still mounted.
220. ``    const loadPosts = async () => {`` — Defines an async function to load posts.
221. ``      try {`` — Begins the fetch error handling.
222. ``        const response = await fetch("/api/blog-posts");`` — Fetches blog posts from the API.
223. ``        if (!response.ok) {`` — If the response is not successful...
224. ``          throw new Error(`Failed to load blog posts: ${response.status}`);`` — ...throw an error.
225. ``        }`` — End the check.
226. ``        const data = (await response.json()) as BlogPost[];`` — Parse JSON into `BlogPost[]`.
227. ``        if (isMounted) {`` — If the component is still mounted...
228. ``          setRemotePosts(data);`` — ...store the loaded posts.
229. ``        }`` — End the mount check.
230. ``      } catch {`` — If there is a fetch or parse error...
231. ``        if (isMounted) {`` — ...and the component is still mounted...
232. ``          setRemotePosts([]);`` — ...clear the remote posts state.
233. ``        }`` — End the mount check.
234. ``      }`` — Ends the try/catch.
235. ``    };`` — Ends `loadPosts`.
236. ``    void loadPosts();`` — Calls the async loader without waiting for the returned promise.
237. ``    return () => {`` — Cleanup function for the effect.
238. ``      isMounted = false;`` — Marks the component as unmounted.
239. ``    };`` — Ends cleanup.
240. ``  }, [posts]);`` — Re-runs effect whenever `posts` prop changes.

241. ``  const isMobile = size.width > 0 && size.width <= 768;`` — Detects mobile layout based on width.
242. ``  const graphSize = {`` — Computes the graph rendering size.
243. ``    width: size.width,`` — Uses container width.
244. ``    height: Math.max(size.height, isMobile ? 1400 : size.height),`` — Forces a minimum height on mobile for scrolling and layout.
245. ``  };`` — Ends `graphSize`.

246. ``  const semanticPositions = useMemo(() => {`` — Starts memoized semantic positioning for posts.
247. ``    if (graphSize.width === 0 || graphSize.height === 0) {`` — If size is not known yet...
248. ``      return [];`` — ...return an empty array.
249. ``    }`` — End the check.
250. ``    if (resolvedPosts.length === 0) {`` — If there are no posts...
251. ``      return [];`` — ...return empty positions.
252. ``    }`` — End the check.
253. ``    const texts = resolvedPosts.map((post) => {`` — Build text content for each post.
254. ``      const bodyText = post.body ? documentToPlainText(post.body) : "";`` — Convert rich body content to plain text.
255. ``      const tagsText = Array.isArray(post.tags) ? post.tags.join(" ") : "";`` — Join tags into a single string.
256. ``      return [post.title, post.author, post.excerpt, bodyText, tagsText]`` — Combine title, author, excerpt, body, and tags.
257. ``        .filter(Boolean)`` — Remove empty values.
258. ``        .join(" ");`` — Join the remaining parts with spaces.
259. ``    });`` — End mapping to `texts`.
260. ``    const termCounts = texts.map((text) => {`` — Convert each text block into term frequency maps.
261. ``      const counts = new Map<string, number>();`` — Start a new frequency map.
262. ``      for (const term of tokenize(text)) {`` — Tokenize each text.
263. ``        counts.set(term, (counts.get(term) ?? 0) + 1);`` — Count occurrences of each token.
264. ``      }`` — End token loop.
265. ``      return counts;`` — Return the term frequency map.
266. ``    });`` — End `termCounts` mapping.
267. ``    const docCount = termCounts.length;`` — Total number of documents.
268. ``    const documentFrequency = new Map<string, number>();`` — Prepare document frequency map.
269. ``    for (const counts of termCounts) {`` — For each document's term frequencies...
270. ``      for (const term of counts.keys()) {`` — ...for each unique term...
271. ``        documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);`` — ...count how many documents contain it.
272. ``      }`` — End term loop.
273. ``    }`` — End document loop.
274. ``    const vocabulary = Array.from(documentFrequency.keys());`` — List every unique term across all posts.
275. ``    const tfidf = termCounts.map((counts) =>`` — Build TF-IDF vectors for each document.
276. ``      normalizeVector(`` — Normalize each vector after computing.
277. ``        vocabulary.map((term) => {`` — For each term in the vocabulary...
278. ``          const tf = counts.get(term) ?? 0;`` — Term frequency in this document.
279. ``          const idf = Math.log((docCount + 1) / ((documentFrequency.get(term) ?? 0) + 1)) + 1;`` — Inverse document frequency formula.
280. ``          return tf * idf;`` — Multiply TF by IDF.
281. ``        })`` — End vocabulary mapping.
282. ``      )`` — Close normalizeVector.
283. ``    );`` — End `tfidf` mapping.
284. ``    const squaredDistances = tfidf.map((vectorA) =>`` — Build a pairwise distance matrix.
285. ``      tfidf.map((vectorB) => square(1 - dot(vectorA, vectorB)))`` — Compute squared distance using cosine similarity.
286. ``    );`` — Close nested mapping.
287. ``    const centered = centerMatrix(squaredDistances);`` — Center the distance matrix for MDS.
288. ``    const B = centered.map((row) => row.map((value) => -0.5 * value));`` — Convert distances into an inner product matrix.
289. ``    const primary = powerIteration(B, 120);`` — Compute the first eigenpair.
290. ``    const deflated = B.map((row, rowIndex) =>`` — Build a deflated matrix without the first component.
291. ``      row.map((value, columnIndex) =>`` — For each cell in `B`...
292. ``        value - primary.value * primary.vector[rowIndex] * primary.vector[columnIndex]`` — Remove the first eigencomponent.
293. ``      )`` — End inner map.
294. ``    );`` — End `deflated` creation.
295. ``    const secondary = powerIteration(deflated, 120);`` — Compute the second eigenpair.
296. ``    const xCoords = primary.vector.map((value) => value * Math.sqrt(Math.max(primary.value, 0)));`` — Map the first eigenvector to X coordinates.
297. ``    const yCoords = secondary.vector.map((value) => value * Math.sqrt(Math.max(secondary.value, 0)));`` — Map the second eigenvector to Y coordinates.
298. ``    const minX = Math.min(...xCoords);`` — Minimum X among all points.
299. ``    const maxX = Math.max(...xCoords);`` — Maximum X among all points.
300. ``    const minY = Math.min(...yCoords);`` — Minimum Y among all points.
301. ``    const maxY = Math.max(...yCoords);`` — Maximum Y among all points.
302. ``    const margin = isMobile ? 100 : 80;`` — Choose margin based on mobile or desktop.
303. ``    const usableWidth = Math.max(graphSize.width - margin * 2, 1);`` — Compute the width available for placement.
304. ``    const heightShrinkFactor = isMobile ? Math.max(1.6, 1 + postCount * 0.1) : 2;`` — Choose a height scaling factor.
305. ``    const usableHeight = Math.max(graphSize.height - margin * heightShrinkFactor, 1);`` — Compute the height available.
306. ``    const rangeX = Math.max(maxX - minX, 0.1);`` — Avoid zero range for X.
307. ``    const rangeY = Math.max(maxY - minY, 0.1);`` — Avoid zero range for Y.
308. ``    if (resolvedPosts.length === 1) {`` — Special-case one post.
309. ``      return [`` — Return a single centered node.
310. ``        {`` — Node object.
311. ``          slug: resolvedPosts[0].slug,`` — Use the post slug.
312. ``          x: graphSize.width / 2,`` — Center X.
313. ``          y: graphSize.height / 2,`` — Center Y.
314. ``          targetX: graphSize.width / 2,`` — Target X is center.
315. ``          targetY: graphSize.height / 2,`` — Target Y is center.
316. ``          vx: 0,`` — No velocity.
317. ``          vy: 0,`` — No velocity.
318. ``        },`` — End node.
319. ``      ];`` — End returned array.
320. ``    }`` — End single post handling.
321. ``    if (resolvedPosts.length === 2) {`` — Special-case two posts.
322. ``      return resolvedPosts.map((post, index) => ({`` — Map each post to a fixed position.
323. ``        slug: post.slug,`` — Post slug.
324. ``        x: graphSize.width * (index === 0 ? 0.3 : 0.7),`` — Place one left and one right.
325. ``        y: graphSize.height / 2,`` — Center vertically.
326. ``        targetX: graphSize.width * (index === 0 ? 0.3 : 0.7),`` — Keep target equal to initial coordinate.
327. ``        targetY: graphSize.height / 2,`` — Keep target equal to initial coordinate.
328. ``        vx: 0,`` — No velocity.
329. ``        vy: 0,`` — No velocity.
330. ``      }));`` — Close mapping.
331. ``    }`` — End two-post handling.
332. ``    const positions = resolvedPosts.map((post, index) => ({`` — Map each post to a semantic position.
333. ``      slug: post.slug,`` — Store the post slug.
334. ``      x: margin + ((xCoords[index] - minX) / rangeX) * usableWidth,`` — Normalize X coordinate.
335. ``      y: margin + ((yCoords[index] - minY) / rangeY) * usableHeight,`` — Normalize Y coordinate.
336. ``      targetX: margin + ((xCoords[index] - minX) / rangeX) * usableWidth,`` — Set target X.
337. ``      targetY: margin + ((yCoords[index] - minY) / rangeY) * usableHeight,`` — Set target Y.
338. ``      vx: 0,`` — Start stationary.
339. ``      vy: 0,`` — Start stationary.
340. ``    }));`` — Close `positions` mapping.
341. ``    const spacingFactor = Math.min(0.08 + postCount * 0.0015, 0.12);`` — Choose a spacing factor based on post count.
342. ``    const minSpacing = Math.max(`` — Compute a minimum distance between nodes.
343. ``      Math.min(graphSize.width, graphSize.height) * spacingFactor,`` — Based on the smaller dimension.
344. ``      isMobile ? 90 : 70,`` — A minimum spacing threshold.
345. ``      40 + postCount * 8`` — Additional spacing as post count grows.
346. ``    );`` — Close `Math.max`.
347. ``    const pushFactor = Math.min(0.06 + postCount * 0.003, 0.12);`` — How strongly nodes repel each other.
348. ``    for (let iteration = 0; iteration < 4; iteration += 1) {`` — Repeat a few relaxation passes.
349. ``      for (let i = 0; i < positions.length; i += 1) {`` — Compare each node with others.
350. ``        for (let j = i + 1; j < positions.length; j += 1) {`` — Compare only later nodes to avoid duplicates.
351. ``          const a = positions[i];`` — Node `a`.
352. ``          const b = positions[j];`` — Node `b`.
353. ``          const dx = b.x - a.x;`` — X difference.
354. ``          const dy = b.y - a.y;`` — Y difference.
355. ``          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;`` — Distance between nodes, avoiding zero.
356. ``          const overlap = minSpacing - dist;`` — How much closer than desired they are.
357. ``          if (overlap > 0) {`` — If nodes are too close...
358. ``            const push = overlap * pushFactor;`` — Determine push amount.
359. ``            const ux = dx / dist;`` — Unit vector in X.
360. ``            const uy = dy / dist;`` — Unit vector in Y.
361. ``            a.x -= ux * push;`` — Push `a` away.
362. ``            a.y -= uy * push;`` — Push `a` away.
363. ``            b.x += ux * push;`` — Push `b` away.
364. ``            b.y += uy * push;`` — Push `b` away.
365. ``          }`` — End overlap check.
366. ``        }`` — End second node loop.
367. ``      }`` — End first node loop.
368. ``    }`` — End relaxation iterations.
369. ``    return positions;`` — Return the computed node positions.
370. ``  }, [graphSize.width, graphSize.height, isMobile, resolvedPosts]);`` — Recompute only when graph size, mobile mode, or posts change.

371. ``  useEffect(() => {`` — Starts an effect to update nodes from semantic positions.
372. ``    if (semanticPositions.length === 0) {`` — If there are no positions...
373. ``      setNodes([]);`` — ...clear the node state.
374. ``      return;`` — Exit early.
375. ``    }`` — End the check.
376. ``    setNodes((prev) => {`` — Update nodes while preserving existing state.
377. ``      const existing = new Map(prev.map((node) => [node.slug, node]));`` — Map previous nodes by slug.
378. ``      return semanticPositions.map((position) => {`` — Create updated nodes for each semantic position.
379. ``        const prevNode = existing.get(position.slug);`` — See if this node existed before.
380. ``        if (!prevNode) {`` — If not...
381. ``          return position;`` — ...use the new position directly.
382. ``        }`` — End the check.
383. ``        return {`` — Otherwise preserve velocity and current position.
384. ``          ...prevNode,`` — Keep previous node data.
385. ``          targetX: position.targetX,`` — Update target X.
386. ``          targetY: position.targetY,`` — Update target Y.
387. ``        };`` — End merged node.
388. ``      });`` — End mapping.
389. ``    });`` — End state update.
390. ``  }, [semanticPositions]);`` — Re-run when semantic positions change.

391. ``  const voronoi = useMemo(() => {`` — Builds the Voronoi diagram for current node positions.
392. ``    if (graphSize.width === 0 || graphSize.height === 0 || nodes.length === 0) {`` — If size or nodes are unavailable...
393. ``      return null;`` — ...return null.
394. ``    }`` — End the condition.
395. ``    const points = nodes.map((node) => [node.x, node.y] as [number, number]);`` — Convert node positions to point arrays.
396. ``    const delaunay = Delaunay.from(points);`` — Compute Delaunay triangulation.
397. ``    return delaunay.voronoi([0, 0, graphSize.width, graphSize.height]);`` — Build Voronoi cells within the graph bounds.
398. ``  }, [nodes, graphSize.width, graphSize.height]);`` — Recompute when nodes or size change.

399. ``  const cellPaths = useMemo(() => {`` — Computes SVG path data for each Voronoi cell.
400. ``    if (!voronoi) {`` — If Voronoi is not ready...
401. ``      return [];`` — ...return an empty array.
402. ``    }`` — End the check.
403. ``    return nodes.map((node, index) => {`` — Map each node to a rendered cell.
404. ``      const polygon = voronoi.cellPolygon(index);`` — Get the polygon for this cell.
405. ``      if (!polygon) {`` — If no polygon exists...
406. ``        return {`` — ...return defaults.
407. ``          slug: node.slug,`` — Node slug.
408. ``          path: null,`` — No path to draw.
409. ``          center: { x: node.x, y: node.y },`` — Use the node position.
410. ``          bounds: { width: 0, height: 0 },`` — No bounding box.
411. ``        };`` — End defaults.
412. ``      }`` — End the missing polygon check.
413. ``      return {`` — Otherwise build path details.
414. ``        slug: node.slug,`` — Node slug.
415. ``        path:`` — Build the SVG path string.
416. ``          polygon`` — Start with the polygon points.
417. ``            .map((point, pointIndex) =>`` — Turn each point into a path command.
418. ``              `${pointIndex === 0 ? "M" : "L"} ${point[0]} ${point[1]}``` — Use `M` for move and `L` for line.
419. ``            )`` — End the mapping.
420. ``            .join(" ") + " Z",`` — Join commands and close the shape.
421. ``        center: polygonCentroid(polygon),`` — Compute the polygon's centroid.
422. ``        bounds: polygonBounds(polygon),`` — Compute the polygon's bounding box.
423. ``      };`` — End the result.
424. ``    });`` — End nodes mapping.
425. ``  }, [nodes, voronoi]);`` — Recompute when nodes or Voronoi change.

426. ``  useEffect(() => {`` — Adds a resize observer to track container size.
427. ``    if (!containerRef.current) {`` — If the ref is not attached yet...
428. ``      return;`` — ...do nothing.
429. ``    }`` — End the check.
430. ``    const element = containerRef.current;`` — Store the DOM element.
431. ``    const observer = new ResizeObserver((entries) => {`` — Create the resize observer.
432. ``      for (const entry of entries) {`` — Process each entry.
433. ``        const { width, height } = entry.contentRect;`` — Extract dimensions.
434. ``        setSize({ width, height });`` — Update state with the new size.
435. ``      }`` — End entries loop.
436. ``    });`` — End observer callback.
437. ``    observer.observe(element);`` — Start observing the container.
438. ``    return () => observer.disconnect();`` — Clean up on unmount.
439. ``  }, []);`` — Run once when the component mounts.

440. ``  useEffect(() => {`` — Creates the animation loop for node movement.
441. ``    if (nodes.length === 0) {`` — If there are no nodes...
442. ``      return;`` — ...do nothing.
443. ``    }`` — End the condition.
444. ``    let frameId: number;`` — Will store the requestAnimationFrame ID.
445. ``    const animate = () => {`` — Defines the animation callback.
446. ``      setNodes((prev) => {`` — Updates node state based on previous state.
447. ``        const rect = containerRef.current?.getBoundingClientRect();`` — Get container position for hover math.
448. ``        return prev.map((node) => {`` — Compute the next state for each node.
449. ``          const dx = node.targetX - node.x;`` — Horizontal distance to target.
450. ``          const dy = node.targetY - node.y;`` — Vertical distance to target.
451. ``          let ax = dx * 0.04;`` — Attraction force toward target x.
452. ``          let ay = dy * 0.04;`` — Attraction force toward target y.
453. ``          ax += (Math.random() - 0.5) * wobble;`` — Add random wobble in x.
454. ``          ay += (Math.random() - 0.5) * wobble;`` — Add random wobble in y.
455. ``          const hoverPointer = hoverPointerRef.current;`` — Read current hover pointer data.
456. ``          const hover =`` — Determine whether this node is currently hovered.
457. ``            activeSlug === node.slug && hoverPointer?.slug === node.slug;`` — True if the hovered slug matches.
458. ``          if (hover && rect && hoverPointer) {`` — If hovered and we have coordinates...
459. ``            const pointerX = hoverPointer.x - rect.left;`` — Convert pointer X to container-relative.
460. ``            const pointerY = hoverPointer.y - rect.top;`` — Convert pointer Y to container-relative.
461. ``            const rx = node.x - pointerX;`` — X distance from node to pointer.
462. ``            const ry = node.y - pointerY;`` — Y distance from node to pointer.
463. ``            const rDist = Math.sqrt(rx * rx + ry * ry) || 0.1;`` — Distance from node to pointer.
464. ``            const strength = Math.max(0, 1 - Math.min(rDist / 180, 1));`` — Strength of hover repulsion.
465. ``            ax += (rx / rDist) * 0.35 * strength;`` — Push node away from pointer in x.
466. ``            ay += (ry / rDist) * 0.35 * strength;`` — Push node away from pointer in y.
467. ``          }`` — End hover effect.
468. ``          const vx = clamp((node.vx + ax) * 0.88, -3, 3);`` — Update and clamp velocity x.
469. ``          const vy = clamp((node.vy + ay) * 0.88, -3, 3);`` — Update and clamp velocity y.
470. ``          const x = clamp(node.x + vx, 0, graphSize.width);`` — Move node and keep it inside bounds.
471. ``          const y = clamp(node.y + vy, 0, graphSize.height);`` — Move node and keep it inside bounds.
472. ``          return { ...node, x, y, vx, vy };`` — Return the updated node.
473. ``        });`` — End mapping over nodes.
474. ``      });`` — End state update.
475. ``      frameId = window.requestAnimationFrame(animate);`` — Schedule the next frame.
476. ``    };`` — End animate callback.
477. ``    frameId = window.requestAnimationFrame(animate);`` — Start the animation loop.
478. ``    return () => window.cancelAnimationFrame(frameId);`` — Cancel animation on cleanup.
479. ``  }, [nodes.length, activeSlug, graphSize.width, graphSize.height, wobble]);`` — Re-run if dependencies change.

480. ``  return (`` — Starts JSX return.
481. ``    <div className={`min-h-screen flex flex-col overflow-hidden ${text}`}>`` — Outer container with theme classes.
482. ``      <div className={` ${border} bg-white hidden md:block`}>`` — Header wrapper visible on medium+ screens.
483. ``        <div className={`items-center border-l min-h-[5vh] tracking-[0.2em] max-h-[5vh] pl-2 text-lg flex bg-white ${text} ${border}`}>`` — Header row styling.
484. ``          BLOG `` — Header text.
485. ``          <span>`` — Inline span for icon.
486. ``            <img src="/logo.png" alt="icon" className="ml-2 h-[1.5em] w-auto" />`` — Logo image.
487. ``          </span>`` — Close span.
488. ``        </div>`` — Close header row.
489. ``      </div>`` — Close header wrapper.

490. ``      <div`` — Starts the container for the SVG graph.
491. ``        ref={containerRef}`` — Attach the resize observer ref.
492. ``        className="relative flex-1 overflow-y-auto overflow-x-hidden select-none"`` — Container styling.
493. ``      >`` — Close opening div tag.
494. ``        <svg`` — Starts SVG element.
495. ``          className="block"`` — Make SVG display block.
496. ``          width="100%"`` — Full width of container.
497. ``          height={graphSize.height}`` — Height based on graph size.
498. ``          viewBox={`0 0 ${graphSize.width} ${graphSize.height}`}`` — SVG coordinate system.
499. ``        >`` — Close opening svg tag.
500. ``          {cellPaths.map(({ slug, path, center, bounds }) => {`` — Render each Voronoi cell.
501. ``            if (!path || !center) {`` — If the cell has no shape...
502. ``              return null;`` — ...skip rendering.
503. ``            }`` — End the check.
504. ``            const post = resolvedPosts.find((item) => item.slug === slug);`` — Find the corresponding post for this cell.
505. ``            if (!post) {`` — If no matching post exists...
506. ``              return null;`` — ...skip rendering.
507. ``            }`` — End post check.
508. ``            const isActive = activeSlug === slug;`` — Determine whether this cell is hovered.
509. ``            const screenScale = clamp(`` — Compute a scale factor based on screen size.
510. ``              Math.min(graphSize.width / 1440, graphSize.height / 900),`` — Based on width and height.
511. ``              0.7,`` — Minimum allowed scale.
512. ``              1.05`` — Maximum allowed scale.
513. ``            );`` — End clamp.
514. ``            const mobileFontFactor = isMobile ? 0.38 * postCount : 1;`` — Reduce font size on mobile when many posts exist.
515. ``            const authorScale = isMobile ? 0.8 : 1;`` — Slightly reduce author text size on mobile.
516. ``            const maxTextWidth = Math.max(Math.min(bounds.width - 18, graphSize.width * 0.55), 40);`` — Compute how wide the text can be.
517. ``            const widthThreshold = graphSize.width / 4;`` — Width threshold used to scale text.
518. ``            const widthScale = clamp(maxTextWidth / widthThreshold, 0.65, 2);`` — Scale text based on available width.
519. ``            const titleFontSize = Math.round(`` — Compute title font size.
520. ``              clamp(20 * screenScale * widthScale * mobileFontFactor, 8, 18)`` — Clamp title font size.
521. ``            );`` — End size calculation.
522. ``            const authorFontSize = Math.round(`` — Compute author font size.
523. ``              clamp(11 * screenScale * widthScale * authorScale, 9, 15)`` — Clamp author font size.
524. ``            );`` — End size calculation.
525. ``            const approxCharWidth = (isMobile ? 12.2 : 7.5) * (titleFontSize / 16);`` — Approximate character width for wrapping.
526. ``            const titleLines = wrapLabel(`` — Wrap the blog title into a few lines.
527. ``              post.title,`` — Title text.
528. ``              maxTextWidth,`` — Maximum width for the label.
529. ``              approxCharWidth,`` — Character width estimate.
530. ``              isMobile ? 3 : 2`` — Allow one extra line on mobile.
531. ``            );`` — End `wrapLabel`.
532. ``            const authorLine = post.author?.trim() || post.sourceLabel?.trim() || "Campo Esquerdo";`` — Choose author text or fallback label.
533. ``            const authorDy = titleLines.length === 1 ? "1.4em" : "1.6em";`` — Position author text based on number of title lines.
534. ``            return (`` — Begin rendering this cell group.
535. ``              <g`` — Use an SVG group for the cell and its text.
536. ``                key={slug}`` — Unique key for React.
537. ``                onPointerEnter={() => setActiveSlug(slug)}`` — Set active slug on hover enter.
538. ``                onPointerMove={(event) => {`` — Track pointer movement.
539. ``                  hoverPointerRef.current = {`` — Store current hover coordinates.
540. ``                    slug,`` — The slug of the hovered node.
541. ``                    x: event.clientX,`` — Cursor X position.
542. ``                    y: event.clientY,`` — Cursor Y position.
543. ``                  };`` — Close hover data.
544. ``                }}`` — End pointer move handler.
545. ``                onPointerLeave={() => {`` — When pointer leaves the cell...
546. ``                  setActiveSlug(null);`` — ...clear active slug.
547. ``                  hoverPointerRef.current = null;`` — ...clear hover data.
548. ``                }}`` — End pointer leave handler.
549. ``                onClick={() => router.push(`/blog/${slug}`)}`` — Navigate to the blog post on click.
550. ``                style={{ cursor: "pointer" }}`` — Make the cursor a pointer.
551. ``              >`` — Close the opening `<g>` tag.
552. ``                <path`` — Render the Voronoi cell shape.
553. ``                  d={path}`` — SVG path commands.
554. ``                  fill={isActive ? "#000000" : "#ffffff"}`` — Fill black when active, white otherwise.
555. ``                  stroke="#000000"`` — Use black stroke.
556. ``                  strokeWidth={1.5}`` — Stroke width.
557. ``                />`` — Close the path.
558. ``                <text`` — Render the label text.
559. ``                  x={center.x}`` — Center text horizontally.
560. ``                  y={center.y}`` — Center text vertically.
561. ``                  textAnchor="middle"`` — Center text horizontally.
562. ``                  dominantBaseline="middle"`` — Center text vertically.
563. ``                  fill={isActive ? "#ffffff" : "#000000"}`` — Invert text color when active.
564. ``                  style={{ fontFamily: "ui-monospace, monospace", pointerEvents: "none" }}`` — Use monospace font and disable pointer events on text.
565. ``                >`` — Close the opening `<text>` tag.
566. ``                  {titleLines.map((line, index) => (`` — Create one `<tspan>` per title line.
567. ``                    <tspan`` — Start a tspan.
568. ``                      key={line}`` — Use the line text as key.
569. ``                      x={center.x}`` — Center each line.
570. ``                      dy={index === 0 ? (titleLines.length === 1 ? "0em" : "-0.6em") : "1.2em"}`` — Position lines above/below each other.
571. ``                      fontSize={titleFontSize}`` — Set computed title font size.
572. ``                      fontWeight="700"`` — Bold title.
573. ``                    >`` — Close tspan opening.
574. ``                      {line}`` — Render the line text.
575. ``                    </tspan>`` — Close tspan.
576. ``                  ))}`` — End title lines mapping.
577. ``                  <tspan x={center.x} dy={authorDy} fontSize={authorFontSize} fontWeight="400">`` — Render author text below the title.
578. ``                    {authorLine}`` — The author or fallback text.
579. ``                  </tspan>`` — Close author tspan.
580. ``                </text>`` — Close text.
581. ``              </g>`` — Close group.
582. ``            );`` — End rendering of this cell.
583. ``          })}`` — End mapping over `cellPaths`.
584. ``        </svg>`` — Close SVG.
585. ``      </div>`` — Close container div.
586. ``    </div>`` — Close outer component div.
587. ``  );`` — End JSX return.
588. ``}`` — Close component function.
