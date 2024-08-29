import dynamic from 'next/dynamic'

const CommitHistory = dynamic(() => import('./components/CommitHistory').then((mod) => mod.CommitHistory), {
  ssr: false
})

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
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
        <GameLogo />
        <h1 className="text-2xl font-semibold mb-4">Monke Craft</h1>
        <p className="mb-4 text-sm italic">
          An AI-generated Minecraft-inspired game experience
        </p>
        <CommitHistory />
        <h2 className="text-xl font-semibold mb-2 mt-4">AI-Generated Game</h2>
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
          <li>Touch and drag: Look around</li>
          <li>Virtual joystick: Move</li>
          <li>Sprint button: Move faster</li>
          <li>Jump button: Jump</li>
        </ul>
      </div>
      <div className="flex-grow">
        <MinecraftClone />
      </div>
    </div>
  )
}
