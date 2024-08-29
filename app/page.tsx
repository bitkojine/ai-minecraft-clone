import dynamic from 'next/dynamic'

const MinecraftClone = dynamic(() => import('app/components/MinecraftClone'), { ssr: false })

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-800">
        <h1 className="text-2xl font-semibold mb-4">Minecraft-like Game</h1>
        <p className="mb-4">
          Welcome to our Minecraft-inspired game! Explore a procedurally generated world, move around freely, and discover a house in the center of the map.
        </p>
        <h2 className="text-xl font-semibold mb-2">Controls</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>W, A, S, D: Move forward, left, backward, and right</li>
          <li>Mouse: Look around</li>
          <li>Left Shift: Sprint (move faster)</li>
          <li>Click on the game area to capture mouse and enable look controls</li>
          <li>Press ESC to release mouse control</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Features</h2>
        <ul className="list-disc pl-5 mb-4">
          <li>Procedurally generated grass terrain</li>
          <li>Custom-built house in the center of the map</li>
          <li>First-person camera controls</li>
          <li>Sprinting capability</li>
        </ul>
      </div>
      <div className="w-3/4">
        <MinecraftClone />
      </div>
    </div>
  )
}
