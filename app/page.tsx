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
        <p className="mb-4 text-sm italic">
          An AI-generated Minecraft-inspired game experience
        </p>
        <h2 className="text-xl font-semibold mb-2">AI-Generated Game</h2>
        <p className="mb-4">
          Monke Craft is a unique project that showcases the potential of AI in game development. Key AI-generated features include:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Procedurally generated terrain</li>
          <li>Dynamic day-night cycle with custom shaders</li>
          <li>Animated monkey characters with patrol AI</li>
          <li>Optimized game logic and rendering</li>
        </ul>
        <p className="mb-4">
          While AI assisted in the creation of this game, human developers provided guidance, refinement, and integration of the AI-generated components.
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
          <li>Procedurally generated grass terrain with custom shaders</li>
          <li>Custom-built house in the center of the map</li>
          <li>First-person camera controls with sprinting capability</li>
          <li>Dancing monkeys patrolling the map corners</li>
          <li>Dynamic day-night cycle with changing sky colors and moving clouds</li>
          <li>Optimized performance using React hooks and Three.js best practices</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Day-Night Cycle</h2>
        <p className="mb-4">
          Experience our dynamic day-night cycle! The sky changes color, the sun and moon traverse the sky, and lighting adjusts to create an immersive environment. Features include:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Smooth transitions between day, night, dawn, and dusk</li>
          <li>Moving clouds with custom shaders</li>
          <li>Dynamic lighting that affects the entire world</li>
          <li>A complete cycle duration of 30 seconds</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2">Monkeys</h2>
        <p className="mb-4">
          Watch our friendly dancing monkeys patrol the map corners! Each monkey:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Follows a unique patrol path</li>
          <li>Animates with swinging arms and bobbing movements</li>
          <li>Adds life and character to the world</li>
        </ul>
        <pre className="text-xs leading-none mb-4 font-mono">
          {`
   ,--,--'-,
  ( (  _  ) )
   \\ 'o o' /
  .-'  "  '-.
 /   _   _   \\
|  (( \\^/ ))  |
 \\   \`\"\"\`   /
  '._)   (_.'
     \\___/
          `}
        </pre>
        <h2 className="text-xl font-semibold mb-2">Performance Optimizations</h2>
        <p className="mb-4">
          Monke Craft is optimized for smooth performance, even with complex features:
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li>Use of React's useMemo and useCallback hooks to prevent unnecessary re-renders</li>
          <li>Efficient use of Three.js materials and shaders for grass and sky effects</li>
          <li>Optimized update cycles for day-night transitions and monkey animations</li>
        </ul>
      </div>
      <div className="w-3/4">
        <MinecraftClone />
      </div>
    </div>
  )
}
