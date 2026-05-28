import { useState } from 'react'
import Scanner from './features/scanner/Scanner'
import ChallengePage from './features/challenge/ChallengePage'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import HowToPlay from './pages/HowToPlay'
import AboutMe from './pages/AboutMe'

function App() {
  const [page, setPage] = useState('home')
  const [result, setResult] = useState(null)

  const handleDone = (data) => {
    setResult(data)
    setPage('result')
  }

  const handleJumpscare = async (imageUrl) => {
    // ไปหน้า result ทันที พร้อม placeholder
    setResult({ scanImageUrl: imageUrl ?? null })
    setPage('result')

    if (!imageUrl) return

    try {
      const base64 = imageUrl.split(',')[1]
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
      const blob = new Blob([bytes], { type: 'image/jpeg' })

      const formRes = await fetch('http://localhost:8002/analyze/', {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      })
      const data = await formRes.json()
      // อัปเดต result เพิ่มเติมหลัง API ตอบ
      setResult(prev => ({ ...prev, ...data, scanImageUrl: imageUrl }))
    } catch (err) {
      console.error('analyze error', err)
    }
  }

  return (
    <main className="app-shell">
      {page === 'home' && (
        <HomePage
          onPlay={() => setPage('howtoplay')}
          onAbout={() => setPage('about')}
        />
      )}
      {page === 'howtoplay' && (
        <HowToPlay
          onBegin={() => setPage('challenge')}
          onBack={() => setPage('home')}
        />
      )}
      {page === 'challenge' && (
        <ChallengePage
          onDone={handleDone}
          onJumpscare={handleJumpscare}
          onBack={() => setPage('home')}
        />
      )}
      {page === 'scanner' && (
        <Scanner onDone={handleDone} onBack={() => setPage('howtoplay')} />
      )}
      {page === 'result' && (
        <ResultPage
          result={result}
          onScanAgain={() => setPage('challenge')}
          onBackHome={() => setPage('home')}
        />
      )}
      {page === 'about' && (
        <AboutMe onBack={() => setPage('home')} />
      )}
    </main>
  )
}

export default App