import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import Atmosphere from './components/Atmosphere'
import LightCursor from './components/LightCursor'
import { themeById } from './data/themes'
import type { State } from './data/types'
import { loadState, markSeen, resetAll, saveEntry } from './lib/store'
import Desk from './scenes/Desk'
import Entry from './scenes/Entry'
import Finale from './scenes/Finale'
import Intro from './scenes/Intro'

type Scene =
  | { kind: 'intro' }
  | { kind: 'desk' }
  | { kind: 'entry'; themeId: string }
  | { kind: 'finale' }

export default function App() {
  const [scene, setScene] = useState<Scene>({ kind: 'intro' })
  const [state, setState] = useState<State>(() => loadState())

  const goDesk = useCallback(() => setScene({ kind: 'desk' }), [])
  const goFinale = useCallback(() => setScene({ kind: 'finale' }), [])

  const openTheme = useCallback((id: string) => {
    setState(markSeen(id))
    setScene({ kind: 'entry', themeId: id })
  }, [])

  const handleSave = useCallback(
    (themeId: string, text: string, mood: string | null, quoteId: string) => {
      setState(saveEntry({ themeId, text, mood, quoteId, createdAt: Date.now() }))
    },
    [],
  )

  const handleReset = useCallback(() => {
    setState(resetAll())
    setScene({ kind: 'desk' })
  }, [])

  const activeTheme = scene.kind === 'entry' ? themeById(scene.themeId) : undefined
  // 题材 id 失效时回落到桌面，宁可回到桌边也不要给一张白屏
  const showDesk = scene.kind === 'desk' || (scene.kind === 'entry' && activeTheme === undefined)

  return (
    <div className="app">
      <Atmosphere />
      <LightCursor />
      <AnimatePresence mode="wait">
        {scene.kind === 'intro' && <Intro key="intro" onEnter={goDesk} />}
        {showDesk && (
          <Desk key="desk" state={state} onOpen={openTheme} onFinale={goFinale} />
        )}
        {scene.kind === 'entry' && activeTheme !== undefined && (
          <Entry
            key={`entry-${activeTheme.id}`}
            theme={activeTheme}
            onBack={goDesk}
            onSave={(text, mood, quoteId) => handleSave(activeTheme.id, text, mood, quoteId)}
          />
        )}
        {scene.kind === 'finale' && (
          <Finale key="finale" state={state} onBack={goDesk} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  )
}