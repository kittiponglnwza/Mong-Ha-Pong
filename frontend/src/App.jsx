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

  // 📸 ฟังก์ชันรับ Array รูปแอบถ่าย 3 ใบจาก ChallengePage
  const handleJumpscare = async (imagesArray, reflexData = []) => {
    
    // ป้องกันกรณีส่งค่ามาวืดหรือไม่มีรูป
    if (!imagesArray || imagesArray.length === 0) {
      setResult({ scanImageUrl: null, jumpscarePhotos: [] })
      setPage('result')
      return
    }

    // 🔍 ตรวจสอบรูปแอบถ่าย โดยใส่เงื่อนไขป้องกันกรณีบางรูปเป็น null ไม่ให้แอปค้าง
    if (imagesArray && imagesArray.length >= 3) {
      console.log('--- ตรวจสอบรูปแอบถ่าย 3 ช็อต ---')
      console.log('ความยาวรูปที่ 1 (เริ่มเกม):', imagesArray[0] ? imagesArray[0].length : 'ไม่มีรูป')
      console.log('ความยาวรูปที่ 2 (ยิงช้า):', imagesArray[1] ? imagesArray[1].length : 'ไม่มีรูป')
      console.log('ความยาวรูปที่ 3 (ผีพุ่งชน):', imagesArray[2] ? imagesArray[2].length : 'ไม่มีรูป')
      console.log('รูป 1 กับ 2 ซ้ำกันไหม?:', imagesArray[0] && imagesArray[1] ? imagesArray[0] === imagesArray[1] : 'เช็คไม่ได้เนื่องจากรูปไม่ครบ')
    }

    // 💡 เลือกรูปจังหวะผีพุ่งชน (ช็อตที่ 3 -> index 2) เป็นรูปหลักส่งหลังบ้านมึง ถ้ายิงช้าแล้วไม่มีรูป ให้ถอยไปใช้รูปแรกแทน
    const primaryImg = imagesArray[2] || imagesArray[0]

    // เซ็ตลง State รอแรนเดอร์หน้า ResultPage ทันที (มีทั้งรูปหลัก และ Array รูปทั้งหมด)
    setResult({ 
      scanImageUrl: primaryImg, 
      jumpscarePhotos: imagesArray,
      reflexData,
    })
    setPage('result')

    try {
      if (!primaryImg) return

      // เอาเฉพาะรูปหลักมาแปลงเพื่อคุยกับ API หลังบ้านของมึงเหมือนเดิม
      const base64 = primaryImg.split(',')[1]
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: 'image/jpeg' })

      const formRes = await fetch('https://mong-ha-pong.onrender.com/analyze/', {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      })
      const data = await formRes.json()
      
      // อัปเดตข้อมูลจาก API เข้าไปเพิ่ม โดยที่ยังรักษา Array รูปแอบถ่าย 3 ใบเอาไว้
      setResult(prev => ({ 
        ...prev, 
        ...data, 
        scanImageUrl: primaryImg,
        jumpscarePhotos: imagesArray,
        reflexData,
      }))
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
        <AboutMe onBack={() => setPage('home')} onPlay={() => setPage('howtoplay')} />
      )}
    </main>
  )
}

export default App