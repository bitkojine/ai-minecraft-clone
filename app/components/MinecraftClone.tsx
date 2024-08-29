import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Cube(props: any) {
  const mesh = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  useFrame((state, delta) => (mesh.current.rotation.x += delta))

  return (
    <Box
      args={[1, 1, 1]}
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </Box>
  )
}

export default function MinecraftClone() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Cube position={[-1.2, 0, 0]} />
        <Cube position={[1.2, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
