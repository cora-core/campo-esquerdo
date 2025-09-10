"use client";

import React, { useEffect, useRef } from 'react';
import { engine, createTimeline, utils } from 'animejs';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

engine.useDefaultMainLoop = false;

const AnimatedArrows = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { bgColor, arrowColor } = useTheme();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const arrowsRef = useRef<THREE.Mesh[]>([]);

  // map theme → hex color
  const getArrowColorFromTheme = (color: string) => {
    const colorMap: Record<string, number> = {
      'text-[#ffffff]': 0xffffff,
      'text-[#2f3032]': 0x2f3032,
      'text-[#9fce98]': 0x9fce98,
      'text-[#eec2db]': 0xeec2db,
      'text-[#8a8e80]': 0x8a8e80,
      'text-[#a5a3a4]': 0xa5a3a4,
      'text-[#d8dcdf]': 0xd8dcdf,
      'border-[#ffffff]': 0xffffff,
      'border-[#2f3032]': 0x2f3032,
      'border-[#9fce98]': 0x9fce98,
      'border-[#eec2db]': 0xeec2db,
      'border-[#8a8e80]': 0x8a8e80,
      'border-[#a5a3a4]': 0xa5a3a4,
      'border-[#d8dcdf]': 0xd8dcdf,
    };
    return colorMap[color] || 0x9fce98;
  };

  // geometry generator
  function createArrowGeometry(doubleHeaded = false) {
    const shape = new THREE.Shape();

    if (doubleHeaded) {
      // Symmetrical arrow with heads at both ends
      shape.moveTo(-1.0, 0);
      shape.lineTo(-0.6, 0.15);
      shape.lineTo(-0.6, 0.05);
      shape.lineTo(0.6, 0.05);
      shape.lineTo(0.6, 0.15);
      shape.lineTo(1.0, 0);
      shape.lineTo(0.6, -0.15);
      shape.lineTo(0.6, -0.05);
      shape.lineTo(-0.6, -0.05);
      shape.lineTo(-0.6, -0.15);
      shape.lineTo(-1.0, 0);
    } else {
      // Original single-head arrow
      shape.moveTo(-0.8, -0.05);
      shape.lineTo(-0.8, 0.05);
      shape.lineTo(0.6, 0.05);
      shape.lineTo(0.6, 0.15);
      shape.lineTo(1.0, 0);
      shape.lineTo(0.6, -0.15);
      shape.lineTo(0.6, -0.05);
      shape.lineTo(-0.8, -0.05);
    }

    return new THREE.ExtrudeGeometry(shape, { steps: 1, depth: 0.2, bevelEnabled: false });
  }

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

    const arrows: THREE.Mesh[] = [];
    arrowsRef.current = arrows;

    const WAVE_SIZE = 20;
    const MAX_ARROWS = 100;
    let activeArrows = 0;

    function createArrow(fadeIn = true) {
      // Pink chance (20%)
      const isPink = Math.random() < 0.2;
      const color = isPink ? 0xeec2db : getArrowColorFromTheme(arrowColor);

      const material = new THREE.MeshBasicMaterial({ color, transparent: false });

      // 30% chance → double-headed arrow
      const doubleHeaded = Math.random() < 0.3;
      const arrow = new THREE.Mesh(createArrowGeometry(doubleHeaded), material);

      const x = utils.random(-width / 80, width / 80);
      const y = utils.random(-height / 80, height / 80);
      const z = utils.random(-50, -40);

      arrow.position.set(x, y, z);
      arrow.scale.set(0.6, 0.6, 0.6);

      // random rotation
      const randomRotation = new THREE.Quaternion();
      randomRotation.setFromAxisAngle(
        new THREE.Vector3(utils.random(-1, 1), utils.random(-1, 1), utils.random(-1, 1)).normalize(),
        Math.PI * 2 * Math.random()
      );
      arrow.setRotationFromQuaternion(randomRotation);

      // fade-in
      if (fadeIn) {
        arrow.material.transparent = true;
        arrow.material.opacity = 0;
        createTimeline({ defaults: { duration: 800, ease: 'easeOutQuad' } })
          .add(arrow.material, { opacity: 1 }, 0)
          .init();
      }

      // floating motion
      const duration = utils.random(15000, 20000);
      createTimeline({ defaults: { loop: true, duration, ease: 'linear' } })
        .add(arrow.position, {
          z: 30,
          x: x + utils.random(-3, 3),
          y: y + utils.random(-3, 3),
        }, 0)
        .init();

      scene.add(arrow);
      activeArrows++;
      return arrow;
    }

    function spawnWave() {
      if (activeArrows < MAX_ARROWS) {
        const spawnCount = Math.min(WAVE_SIZE, MAX_ARROWS - activeArrows);
        for (let i = 0; i < spawnCount; i++) {
          arrows.push(createArrow());
        }
      }
      setTimeout(spawnWave, 1000);
    }

    spawnWave();

    function render() {
      engine.update();

      arrows.forEach((arrow, index) => {
        if (arrow.position.z > 20) {
          scene.remove(arrow);
          arrows[index] = createArrow(false);
          activeArrows--;
        }
      });

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(render);

    const handleResize = () => {
      const { width, height } = $container.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', handleResize);
      if ($container.contains(renderer.domElement)) {
        $container.removeChild(renderer.domElement);
      }
      arrows.forEach(arrow => {
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
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedArrows;
