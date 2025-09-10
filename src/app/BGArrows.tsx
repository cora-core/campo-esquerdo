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
  const arrowsRef = useRef<THREE.Object3D[]>([]);

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

    const arrows: THREE.Object3D[] = [];
    arrowsRef.current = arrows;

    const WAVE_SIZE = 60;
    const MAX_ARROWS = 35;
    let activeArrows = 5; // track active arrows

    

   function createAssetSprite(assetIndex: number, fadeIn = true) {
  const assetPaths = [
    '/assets/2.png',
    '/assets/3.png',
    '/assets/4.png',
    '/assets/5.png',
  ];
  const texture = new THREE.TextureLoader().load(assetPaths[assetIndex]);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: fadeIn ? 0 : 1 });
  const sprite = new THREE.Sprite(material);

  const x = utils.random(-width / 80, width / 80); 
  const y = utils.random(-height / 80, height / 80);
  const z = utils.random(-50, -40); 

  sprite.position.set(x, y, z);
  sprite.scale.set(15.2, 15.2, 13.2); // Adjust scale as needed

  // fade-in
  if (fadeIn) {
    createTimeline({ defaults: { duration: 3600, ease: 'easeOutQuad' } }) 
      .add(sprite.material, { opacity: 1 }, 0) // fade in 0
      .init();
  }

  // floating motion
  const duration = utils.random(7200, 15600); // 
  createTimeline({ defaults: { loop: true, duration, ease: 'linear' } })
    .add(sprite.position, {
      z: 30,
      x: x + utils.random(-3, 3),
      y: y + utils.random(-3, 3),
    }, 0)
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
      setTimeout(spawnWave, 100); 
    }

    spawnWave();

    function render() {
      engine.update();

    arrows.forEach((sprite, index) => {
  if (sprite.position.z > 20) {
    scene.remove(sprite);
    const assetIndex = Math.floor(Math.random() * 4);
    arrows[index] = createAssetSprite(assetIndex, false);
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
