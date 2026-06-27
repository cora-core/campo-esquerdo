"use client";

import React, { useEffect, useRef } from "react";
import { engine, createTimeline, utils } from "animejs";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

engine.useDefaultMainLoop = false;

const AnimatedArrows = ({ slow }: { slow: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { bgColor, arrowColor } = useTheme();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const arrowsRef = useRef<THREE.Object3D[]>([]);

  const slowRef = useRef<boolean>(false);
  useEffect(() => {
    slowRef.current = slow;
  }, [slow]);

  useEffect(() => {
    const $container = containerRef.current;
    if (!$container) return;

    const { width, height } = $container.getBoundingClientRect();

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    $container.appendChild(renderer.domElement);
    camera.position.z = 5;

    const arrows: THREE.Object3D[] = [];
    arrowsRef.current = arrows;

    const WAVE_SIZE = 60;
    const MAX_ARROWS = 35;
    let activeArrows = 5; // track active arrows

    // 🔹 cache textures once
    const textureLoader = new THREE.TextureLoader();
    const textures = [
      textureLoader.load("/assets/2.png"),
      textureLoader.load("/assets/3.png"),
      textureLoader.load("/assets/4.png"),
      textureLoader.load("/assets/5.png"),
    ];

    function createAssetSprite(assetIndex: number, fadeIn = true) {
      const material = new THREE.SpriteMaterial({
        map: textures[assetIndex], // 🔹 use cached texture
        transparent: true,
        opacity: fadeIn ? 0 : 1,
      });
      const sprite = new THREE.Sprite(material);

      const x = utils.random(-width / 120, width / 80); // asymmetric: more range to the right
      const y = utils.random(-height / 120, height / 120);
      const z = utils.random(-50, -40);

      sprite.position.set(x, y, z);
      sprite.scale.set(12.2, 12.2, 12.2); // Adjust scale as needed

      // fade-in
      if (fadeIn) {
        createTimeline({ defaults: { duration: 3600, ease: "easeOutQuad" } })
          .add(sprite.material, { opacity: 1 }, 0) // fade in 0
          .init();
      }

      // floating motion
      const duration = utils.random(7200, 15600);
      createTimeline({ defaults: { loop: true, duration, ease: "linear" } })
        .add(
          sprite.position,
          {
            z: 30,
            x: x + utils.random(-3, 3),
            y: y + utils.random(-3, 3),
          },
          0,
        )
        .init();

      scene.add(sprite);
      activeArrows++;
      return sprite;
    }

    function spawnWave() {
      if (activeArrows < MAX_ARROWS) {
        const spawnCount = Math.min(WAVE_SIZE, MAX_ARROWS - activeArrows);
        for (let i = 0; i < spawnCount; i++) {
          const assetIndex = Math.floor(Math.random() * 4); // 0-3 for assets 2-5
          arrows.push(createAssetSprite(assetIndex));
        }
      }
      setTimeout(spawnWave, 150);
    }

    spawnWave();

    let mouseX = 0.5;
    let mouseY = 0.5;
    let mouseTargetX = 0.5;
    let mouseTargetY = 0.5;

    // more number = more smooth
    const moveMoveSmoothness = 500;

    // more number = more strong
    const mouseMoveStrength = 3;

    const mouseMoveListener = (ev: MouseEvent) => {
      if (!slowRef.current) {
        mouseTargetX = ev.clientX / window.innerWidth;
        mouseTargetY = ev.clientY / window.innerHeight;
      }
    };

    window.addEventListener("mousemove", mouseMoveListener);

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function render() {
      engine.update();
      engine.speed = lerp(engine.speed, slowRef.current ? 0.15 : 1, 0.04);

      arrows.forEach((sprite, index) => {
        if (sprite.position.z > 20) {
          scene.remove(sprite);
          const assetIndex = Math.floor(Math.random() * 4);
          arrows[index] = createAssetSprite(assetIndex, false);
          activeArrows--;
        }
      });

      if (!slowRef.current) {
        mouseX = lerp(mouseX, mouseTargetX, 1 / moveMoveSmoothness);
        mouseY = lerp(mouseY, mouseTargetY, 1 / moveMoveSmoothness);
      }

      camera.position.x = (mouseX - 0.5) * -mouseMoveStrength
      camera.position.y = (mouseY - 0.5) * mouseMoveStrength

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(render);

    const handleResize = () => {
      const { width, height } = $container.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("mousemove", mouseMoveListener);
      window.removeEventListener("resize", handleResize);
      if ($container.contains(renderer.domElement)) {
        $container.removeChild(renderer.domElement);
      }
      arrows.forEach((arrow) => {
        if (sceneRef.current && arrow.parent === sceneRef.current) {
          sceneRef.current.remove(arrow);
        }
      });
    };
  }, [arrowColor]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${bgColor}`}
      style={{ pointerEvents: "none" }}
    />
  );
};

export default AnimatedArrows;
