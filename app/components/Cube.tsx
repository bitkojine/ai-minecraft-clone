import React from 'react'
import { BoxGeometry, MeshStandardMaterial } from 'three'

export function Cube({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  )
}
