"use client";

import React, { useEffect, useRef } from 'react';
import { engine, createTimeline, utils } from 'animejs';
import * as THREE from 'three';

engine.useDefaultMainLoop = false;

const AnimatedArrows = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const $container = containerRef.current;
    if (!$container) return;

    const { width, height } = $container.getBoundingClientRect();

    // Three.js setup
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    $container.appendChild(renderer.domElement);
    camera.position.z = 5;

    // Arrow geometry
    function createArrowGeometry() {
      const arrowShape = new THREE.Shape();
      arrowShape.moveTo(-0.8, -0.05);
      arrowShape.lineTo(-0.8, 0.05);
      arrowShape.lineTo(0.6, 0.05);
      arrowShape.lineTo(0.6, 0.15);
      arrowShape.lineTo(1.0, 0);
      arrowShape.lineTo(0.6, -0.15);
      arrowShape.lineTo(0.6, -0.05);
      arrowShape.lineTo(-0.8, -0.05);
      
      const extrudeSettings = {
        steps: 1,
        depth: 0.2,
        bevelEnabled: false
      };
      
      return new THREE.ExtrudeGeometry(arrowShape, extrudeSettings);
    }

    // Solid white material
    const baseMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: false
    });

    const arrows = [];
    const WAVE_SIZE = 20; 
    const MAX_ARROWS = 100;
    let activeArrows = 0;

    function createArrow(fadeIn = true) {
      const arrow = new THREE.Mesh(createArrowGeometry(), baseMaterial.clone());
      
      // Spawn position
      const x = utils.random(-width/80, width/80);
      const y = utils.random(-height/80, height/80);
      const z = utils.random(-50, -40);
      
      arrow.position.set(x, y, z);
      arrow.scale.set(0.6, 0.6, 0.6);

      // Random 3D direction
      const randomRotation = new THREE.Quaternion();
      randomRotation.setFromAxisAngle(
        new THREE.Vector3(
          utils.random(-1, 1),
          utils.random(-1, 1),
          utils.random(-1, 1)
        ).normalize(),
        Math.PI * 2 * Math.random()
      );
      arrow.setRotationFromQuaternion(randomRotation);

      // Fade in effect
      if (fadeIn) {
        arrow.material = baseMaterial.clone();
        arrow.material.transparent = true;
        arrow.material.opacity = 0;
        
        createTimeline({
          defaults: { duration: 800, easing: 'easeOutQuad' }
        })
        .add(arrow.material, { opacity: 1 }, 0)
        .init();
      }
      
      // Slower movement (increased duration)
      const duration = utils.random(15000, 20000); // 15-20 seconds
      createTimeline({
        defaults: { loop: true, duration, easing: 'linear' },
      })
        .add(arrow.position, { 
          z: 30,
          x: x + utils.random(-3, 3),
          y: y + utils.random(-3, 3)
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
      
      // Shorter wave interval
      setTimeout(spawnWave, 1000); // Waves every set ms
    }

    // Start wave spawning
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
      $container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10" 
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedArrows;
