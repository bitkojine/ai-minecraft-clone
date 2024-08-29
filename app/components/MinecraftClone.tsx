"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { PointerLockControls, Box } from '@react-three/drei';
import * as THREE from 'three';

const WORLD_SIZE = 100;
const MOVE_SPEED = 0.1;
const SPRINT_MULTIPLIER = 2;

function generateGrassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) return null;

  // Base green color
  context.fillStyle = '#4caf50';
  context.fillRect(0, 0, 256, 256);

  // Add some variation
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const hue = 100 + Math.random() * 60; // Range from yellowish to greenish
    const lightness = 20 + Math.random() * 30; // Vary the lightness
    context.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
    context.fillRect(x, y, 2, 2);
  }

  return canvas;
}

function Cube({ position, color = '#4caf50', isGrass = false }: { position: [number, number, number]; color?: string; isGrass?: boolean }) {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: isGrass ? `
        uniform vec3 color;
        varying vec2 vUv;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 st = floor(vUv * 8.0);
          vec3 baseColor = color;
          
          float r = random(st);
          if (r > 0.7) {
            baseColor *= 0.8;
          } else if (r > 0.4) {
            baseColor *= 1.2;
          }
          
          gl_FragColor = vec4(baseColor, 1.0);
        }
      ` : `
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, [color, isGrass]);

  return (
    <Box position={position} args={[1, 1, 1]}>
      <primitive object={shaderMaterial} attach="material" />
    </Box>
  );
}

function generateHouse(centerX: number, centerZ: number) {
  const house: JSX.Element[] = [];
  const houseSize = 5;
  const houseHeight = 4;

  // Floor
  for (let x = 0; x < houseSize; x++) {
    for (let z = 0; z < houseSize; z++) {
      house.push(<Cube key={`floor-${x}-${z}`} position={[centerX + x, 0, centerZ + z]} color="#8B4513" />);
    }
  }

  // Walls
  for (let y = 1; y < houseHeight; y++) {
    for (let x = 0; x < houseSize; x++) {
      house.push(<Cube key={`wall-front-${x}-${y}`} position={[centerX + x, y, centerZ]} color="#D2B48C" />);
      house.push(<Cube key={`wall-back-${x}-${y}`} position={[centerX + x, y, centerZ + houseSize - 1]} color="#D2B48C" />);
    }
    for (let z = 1; z < houseSize - 1; z++) {
      house.push(<Cube key={`wall-left-${z}-${y}`} position={[centerX, y, centerZ + z]} color="#D2B48C" />);
      house.push(<Cube key={`wall-right-${z}-${y}`} position={[centerX + houseSize - 1, y, centerZ + z]} color="#D2B48C" />);
    }
  }

  // Roof
  for (let x = 0; x < houseSize; x++) {
    for (let z = 0; z < houseSize; z++) {
      house.push(<Cube key={`roof-${x}-${z}`} position={[centerX + x, houseHeight, centerZ + z]} color="#8B0000" />);
    }
  }

  // Door
  house.push(<Cube key="door" position={[centerX + Math.floor(houseSize / 2), 1, centerZ]} color="#8B4513" />);

  return house;
}

function DancingMonkey({ startPosition, patrolRadius = 5 }: { startPosition: [number, number, number]; patrolRadius?: number }) {
  const monkeyRef = useRef<THREE.Group>(null);
  const timeOffset = useRef(Math.random() * Math.PI * 2); // Random start position in the patrol

  useFrame(({ clock }) => {
    if (monkeyRef.current) {
      const t = clock.getElapsedTime() + timeOffset.current;
      const patrolSpeed = 0.5; // Adjust this to change patrol speed
      
      // Calculate patrol position
      const patrolX = Math.sin(t * patrolSpeed) * patrolRadius;
      const patrolZ = Math.cos(t * patrolSpeed) * patrolRadius;
      
      monkeyRef.current.position.x = startPosition[0] + patrolX;
      monkeyRef.current.position.y = startPosition[1] + Math.sin(t * 5) * 0.2; // Small vertical bounce
      monkeyRef.current.position.z = startPosition[2] + patrolZ;

      // Face the direction of movement
      monkeyRef.current.rotation.y = Math.atan2(patrolX, patrolZ);

      // Animate arms and legs
      const leftArm = monkeyRef.current.getObjectByName('leftArm');
      const rightArm = monkeyRef.current.getObjectByName('rightArm');
      if (leftArm && rightArm) {
        leftArm.rotation.x = Math.sin(t * 10) * 0.5;
        rightArm.rotation.x = Math.sin(t * 10 + Math.PI) * 0.5;
      }

      const leftLeg = monkeyRef.current.getObjectByName('leftLeg');
      const rightLeg = monkeyRef.current.getObjectByName('rightLeg');
      if (leftLeg && rightLeg) {
        leftLeg.rotation.x = Math.sin(t * 10) * 0.3;
        rightLeg.rotation.x = Math.sin(t * 10 + Math.PI) * 0.3;
      }
    }
  });

  return (
    <group ref={monkeyRef} position={startPosition}>
      {/* Body */}
      <Box args={[0.8, 1, 0.5]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Head */}
      <Box args={[0.6, 0.6, 0.6]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Left Arm */}
      <Box args={[0.2, 0.7, 0.2]} position={[-0.5, 0.5, 0]} name="leftArm">
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Right Arm */}
      <Box args={[0.2, 0.7, 0.2]} position={[0.5, 0.5, 0]} name="rightArm">
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Left Leg */}
      <Box args={[0.2, 0.7, 0.2]} position={[-0.3, -0.35, 0]} name="leftLeg">
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Right Leg */}
      <Box args={[0.2, 0.7, 0.2]} position={[0.3, -0.35, 0]} name="rightLeg">
        <meshStandardMaterial color="#8B4513" />
      </Box>
      {/* Eyes */}
      <Box args={[0.1, 0.1, 0.1]} position={[-0.15, 1.4, 0.3]}>
        <meshStandardMaterial color="white" />
      </Box>
      <Box args={[0.1, 0.1, 0.1]} position={[0.15, 1.4, 0.3]}>
        <meshStandardMaterial color="white" />
      </Box>
      {/* Mouth */}
      <Box args={[0.3, 0.05, 0.1]} position={[0, 1.2, 0.3]}>
        <meshStandardMaterial color="black" />
      </Box>
    </group>
  );
}

function FlatWorld() {
  const blocks: JSX.Element[] = [];

  // Generate flat terrain with grass texture
  for (let x = 0; x < WORLD_SIZE; x++) {
    for (let z = 0; z < WORLD_SIZE; z++) {
      blocks.push(<Cube key={`terrain-${x}-${z}`} position={[x - WORLD_SIZE/2, -0.5, z - WORLD_SIZE/2]} isGrass={true} />);
    }
  }

  // Add house in the middle of the map
  const houseCenter = [0, 0];
  const house = generateHouse(houseCenter[0], houseCenter[1]);
  blocks.push(...house);

  // Add patrolling monkeys
  const monkeyPositions = [
    [-20, 1, -20],
    [20, 1, 20],
    [-20, 1, 20],
    [20, 1, -20],
  ];

  const monkeys = monkeyPositions.map((pos, index) => (
    <DancingMonkey key={`monkey-${index}`} startPosition={pos as [number, number, number]} patrolRadius={10} />
  ));

  return (
    <>
      {blocks}
      {monkeys}
    </>
  );
}

function FirstPersonCamera() {
  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const isSprinting = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': moveForward.current = true; break;
        case 'KeyS': moveBackward.current = true; break;
        case 'KeyA': moveLeft.current = true; break;
        case 'KeyD': moveRight.current = true; break;
        case 'ShiftLeft': isSprinting.current = true; break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': moveForward.current = false; break;
        case 'KeyS': moveBackward.current = false; break;
        case 'KeyA': moveLeft.current = false; break;
        case 'KeyD': moveRight.current = false; break;
        case 'ShiftLeft': isSprinting.current = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(moveBackward.current) - Number(moveForward.current));
    const sideVector = new THREE.Vector3(Number(moveLeft.current) - Number(moveRight.current), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVE_SPEED * (isSprinting.current ? SPRINT_MULTIPLIER : 1))
      .applyEuler(camera.rotation);

    camera.position.add(direction);
  });

  return null;
}

export default function MinecraftClone() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 50, 50], fov: 75 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <FlatWorld />
        <FirstPersonCamera />
        <PointerLockControls />
      </Canvas>
    </div>
  );
}
