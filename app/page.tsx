import dynamic from 'next/dynamic'

const MinecraftClone = dynamic(() => import('app/components/MinecraftClone'), { ssr: false })

const GameLogo = () => (
  <pre className="text-green-500 font-mono text-xs leading-none mb-4">
    {`
 __  __  ____  _   _  ____  _  __  _____   ____  ____      _    _____ _____
|  \\/  |/ ___|| \\ | |/ ___|| |/ / | ____| |  _ \\|  _ \\    / \\  |  ___|_   _|
| |\\/| | |    |  \\| | |  _ | ' /  |  _|   | |_) | |_) |  / _ \\ | |_    | |
| |  | | |___ | |\\  | |_| || . \\  | |___  |  _ <|  _ <  / ___ \\|  _|   | |
|_|  |_|\\____||_| \\_|\\____|_|\\_\\ |_____| |_| \\_\\_| \\_\\/_/   \\_\\_|     |_|
    `}
  </pre>
)

export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-800">
        <GameLogo />
        <h1 className="text-2xl font-semibold mb-4">Monke Craft</h1>
        <p className="mb-4">
          Welcome to Monke Craft! Explore a procedurally generated world, move around freely, and encounter dancing monkeys patrolling the landscape.
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
          <li>First-person camera controls with sprinting capability</li>
          <li>Dancing monkeys patrolling the map corners</li>
          <li>Day-night cycle (coming soon)</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">About the Monkeys</h2>
        <p className="mb-4">
          Keep an eye out for our friendly dancing monkeys! These curious creatures patrol the corners of the map, adding life and movement to the world. Each monkey follows a unique patrol path, swinging its arms and bobbing up and down as it moves.
        </p>
      </div>
      <div className="w-3/4">
        <MinecraftClone />
      </div>
    </div>
  )
}
