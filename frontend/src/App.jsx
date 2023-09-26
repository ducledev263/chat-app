import { Button, ButtonGroup } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'

function App() {
  return (
    <div className="flex min-h-screen bg-[url('https://www.mpsonthego.com/uploads/processed/images/67d25da96675b13234c8615c209fd4a450f346f5.png')] 
    bg-center bg-no-repeat bg-cover">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
