"use client";

import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Box, Sphere } from '@react-three/drei';
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
  const houseSize = 9;
  const houseHeight = 6;

  // Floor
  for (let x = 0; x < houseSize; x++) {
    for (let z = 0; z < houseSize; z++) {
      house.push(<Cube key={`floor-${x}-${z}`} position={[centerX + x, 0, centerZ + z]} color="#8B4513" />);
    }
  }

  // Walls
  for (let y = 1; y < houseHeight; y++) {
    for (let x = 0; x < houseSize; x++) {
      if (y !== 2 || (x !== 4 && x !== 5)) { // Leave space for door
        house.push(<Cube key={`wall-front-${x}-${y}`} position={[centerX + x, y, centerZ]} color="#D2B48C" />);
      }
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
  house.push(<Cube key="door-bottom" position={[centerX + 4, 1, centerZ]} color="#8B4513" />);
  house.push(<Cube key="door-top" position={[centerX + 4, 2, centerZ]} color="#8B4513" />);
  house.push(<Cube key="door-bottom-2" position={[centerX + 5, 1, centerZ]} color="#8B4513" />);
  house.push(<Cube key="door-top-2" position={[centerX + 5, 2, centerZ]} color="#8B4513" />);

  // Windows
  const windowPositions = [
    [2, 2, 0], [6, 2, 0], // Front windows
    [2, 2, houseSize - 1], [6, 2, houseSize - 1], // Back windows
    [0, 2, 2], [0, 2, 6], // Left windows
    [houseSize - 1, 2, 2], [houseSize - 1, 2, 6] // Right windows
  ];

  windowPositions.forEach(([x, y, z], index) => {
    house.push(<Cube key={`window-${index}`} position={[centerX + x, y, centerZ + z]} color="#87CEEB" />);
  });

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

function SkyBox() {
  const { scene } = useThree();
  const sunMoonRef = useMemo(() => React.createRef<THREE.Mesh>(), []);
  const directionalLightRef = useMemo(() => React.createRef<THREE.DirectionalLight>(), []);
  const cloudsRef = useMemo(() => React.createRef<THREE.Mesh>(), []);

  const cloudsMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      void main() {
        vec2 st = vUv * 10.0 + time * 0.05;
        float n = smoothstep(0.4, 0.6, noise(st));
        gl_FragColor = vec4(1.0, 1.0, 1.0, n * 0.3);
      }
    `,
    transparent: true,
  }), []);

  const timeRef = useRef(0);
  const skyColorRef = useRef(new THREE.Color());

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const dayDuration = 30;
    const cycleProgress = (time % dayDuration) / dayDuration;

    if (Math.abs(time - timeRef.current) > 0.1) {
      timeRef.current = time;
      updateSkyColor(cycleProgress);
      updateLighting(cycleProgress);
    }

    updateSunMoonPosition(cycleProgress);
    updateClouds(time);
  });

  const updateSkyColor = (cycleProgress: number) => {
    if (cycleProgress < 0.25) { // Dawn
      skyColorRef.current.setRGB(
        0.53 + cycleProgress * 1.88,
        0.81 + cycleProgress * 0.76,
        0.92 + cycleProgress * 0.32
      );
    } else if (cycleProgress < 0.75) { // Day
      skyColorRef.current.setRGB(0.68, 0.85, 0.9);
    } else { // Dusk to Night
      skyColorRef.current.setRGB(
        Math.max(0.05, 0.68 - (cycleProgress - 0.75) * 2.52),
        Math.max(0.05, 0.85 - (cycleProgress - 0.75) * 3.2),
        Math.max(0.1, 0.9 - (cycleProgress - 0.75) * 3.2)
      );
    }
    scene.background = skyColorRef.current;
  };

  const updateLighting = (cycleProgress: number) => {
    if (directionalLightRef.current) {
      const intensity = cycleProgress < 0.25 ? cycleProgress * 4 :
                        cycleProgress < 0.75 ? 1 :
                        Math.max(0.05, 1 - (cycleProgress - 0.75) * 4);
      directionalLightRef.current.intensity = intensity;
    }
  };

  const updateSunMoonPosition = (cycleProgress: number) => {
    if (sunMoonRef.current && directionalLightRef.current) {
      const angle = cycleProgress * Math.PI * 2;
      const x = Math.cos(angle) * 100;
      const y = Math.sin(angle) * 100;
      sunMoonRef.current.position.set(x, y, 0);
      directionalLightRef.current.position.set(x, y, 0);

      if (sunMoonRef.current.material instanceof THREE.MeshBasicMaterial) {
        sunMoonRef.current.material.color.setHex(cycleProgress < 0.5 ? 0xffff00 : 0xffffff);
      }
    }
  };

  const updateClouds = (time: number) => {
    if (cloudsRef.current) {
      cloudsMaterial.uniforms.time.value = time;
    }
  };

  return (
    <>
      <Sphere ref={sunMoonRef} args={[5, 32, 32]} position={[0, 100, 0]}>
        <meshBasicMaterial />
      </Sphere>
      <directionalLight ref={directionalLightRef} intensity={1} />
      <Sphere ref={cloudsRef} args={[99, 64, 64]} rotation={[0, 0, Math.PI / 2]}>
        <primitive object={cloudsMaterial} attach="material" />
      </Sphere>
    </>
  );
}

function FlatWorld() {
  const blocks = useMemo(() => {
    const generatedBlocks: JSX.Element[] = [];
    for (let x = 0; x < WORLD_SIZE; x++) {
      for (let z = 0; z < WORLD_SIZE; z++) {
        generatedBlocks.push(<Cube key={`terrain-${x}-${z}`} position={[x - WORLD_SIZE/2, -0.5, z - WORLD_SIZE/2]} isGrass={true} />);
      }
    }
    return generatedBlocks;
  }, []);

  const house = useMemo(() => generateHouse(0, 0), []);

  const monkeys = useMemo(() => {
    const monkeyPositions = [
      [-20, 1, -20],
      [20, 1, 20],
      [-20, 1, 20],
      [20, 1, -20],
    ];
    return monkeyPositions.map((pos, index) => (
      <DancingMonkey key={`monkey-${index}`} startPosition={pos as [number, number, number]} patrolRadius={10} />
    ));
  }, []);

  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const timeRef = useRef(0);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 1;
    if (Math.abs(time - timeRef.current) > 0.1) {
      timeRef.current = time;
      const dayDuration = 30;
      const cycleProgress = (time % dayDuration) / dayDuration;

      // Adjust ambient light intensity
      if (ambientLightRef.current) {
        const baseIntensity = 0.2;
        const variableIntensity = 0.3;
        ambientLightRef.current.intensity = baseIntensity + Math.sin(cycleProgress * Math.PI * 2) * variableIntensity;
      }

      // Adjust point light intensity and color
      if (pointLightRef.current) {
        pointLightRef.current.intensity = 0.5 + Math.sin(cycleProgress * Math.PI * 2) * 0.5;
        pointLightRef.current.color.setHSL(0.1, 1, 0.5 + Math.sin(cycleProgress * Math.PI * 2) * 0.5);
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.5} />
      <pointLight ref={pointLightRef} position={[0, 50, 0]} intensity={0.8} />
      {blocks}
      {house}
      {monkeys}
    </>
  );
}

interface TouchPosition {
  x: number;
  y: number;
}

function Documentation() {
  return (
    <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Documentation</h2>
      <p>Here you can add your game's documentation...</p>
      {/* Add more documentation content here */}
    </div>
  );
}

function CommitHistory() {
  return (
    <div className="bg-white p-4 rounded-lg max-w-2xl max-h-[80vh] overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Commit History</h2>
      <ul>
        <li>Commit 1: Initial setup</li>
        <li>Commit 2: Added basic world generation</li>
        <li>Commit 3: Implemented player movement</li>
        {/* Add more commit history items here */}
      </ul>
    </div>
  );
}

function Menu({ onClose }) {
  const [showDocs, setShowDocs] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <div className="flex flex-col space-y-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setShowDocs(true)}
          >
            Documentation
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setShowHistory(true)}
          >
            Commit History
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">
            About
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close Menu
          </button>
        </div>
      </div>
      {showDocs && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <Documentation />
          <button
            className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => setShowDocs(false)}
          >
            Close
          </button>
        </div>
      )}
      {showHistory && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <CommitHistory />
          <button
            className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => setShowHistory(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function Controls({ onMove, onSprint, onJump, isMobile }) {
  const { camera } = useThree();
  const moveDirection = useRef({ x: 0, z: 0 });
  const isSprinting = useRef(false);
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isMobile) {
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
          case 'KeyW': moveDirection.current.z = -1; break;
          case 'KeyS': moveDirection.current.z = 1; break;
          case 'KeyA': moveDirection.current.x = -1; break;
          case 'KeyD': moveDirection.current.x = 1; break;
          case 'ShiftLeft': isSprinting.current = true; break;
          case 'Space': onJump(); break;
        }
        onMove(moveDirection.current.x, moveDirection.current.z);
        onSprint(isSprinting.current);
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        switch (e.code) {
          case 'KeyW':
          case 'KeyS': moveDirection.current.z = 0; break;
          case 'KeyA':
          case 'KeyD': moveDirection.current.x = 0; break;
          case 'ShiftLeft': isSprinting.current = false; break;
        }
        onMove(moveDirection.current.x, moveDirection.current.z);
        onSprint(isSprinting.current);
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [onMove, onSprint, onJump, isMobile]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const maxRadius = 50;
    const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxRadius);
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance / maxRadius;
    const y = Math.sin(angle) * distance / maxRadius;
    setJoystickPosition({ x, y });
    onMove(x, -y);
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setJoystickPosition({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <>
      {!isMobile && <PointerLockControls />}
      {isMobile && (
        <div className="absolute bottom-4 left-4">
          <div
            className="w-32 h-32 bg-gray-400 bg-opacity-50 rounded-full relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="w-16 h-16 bg-gray-600 rounded-full absolute"
              style={{
                left: `calc(50% + ${joystickPosition.x * 32}px)`,
                top: `calc(50% + ${joystickPosition.y * 32}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

function FirstPersonCamera({ moveDirection, isSprinting, isJumping }) {
  const { camera } = useThree();

  useFrame(() => {
    const direction = new THREE.Vector3(
      moveDirection.x,
      0,
      moveDirection.z
    ).applyEuler(camera.rotation);

    const speed = MOVE_SPEED * (isSprinting ? SPRINT_MULTIPLIER : 1);
    camera.position.add(direction.multiplyScalar(speed));

    if (isJumping) {
      camera.position.y += 0.1;
    }
  });

  return null;
}

export default function MinecraftClone() {
  const [moveDirection, setMoveDirection] = useState({ x: 0, z: 0 });
  const [isSprinting, setIsSprinting] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMove = (x, z) => {
    setMoveDirection({ x, z });
  };

  const handleSprint = (sprinting) => {
    setIsSprinting(sprinting);
  };

  const handleJump = () => {
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 300);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <SkyBox />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <FlatWorld />
        <FirstPersonCamera moveDirection={moveDirection} isSprinting={isSprinting} isJumping={isJumping} />
        <Controls onMove={handleMove} onSprint={handleSprint} onJump={handleJump} isMobile={isMobile} />
      </Canvas>
      <div
        className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full cursor-pointer"
        onClick={toggleMenu}
      >
        ☰
      </div>
      {menuOpen && <Menu onClose={toggleMenu} />}
    </div>
  );
}
