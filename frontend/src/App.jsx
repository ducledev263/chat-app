import { Button, ButtonGroup } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'

function App() {
  return (
    <div className="flex min-h-screen bg-[url('https://cdn.muni.cz/media/3086281/socialni_site-media.jpg?mode=crop&center=0.5')] 
    bg-center bg-no-repeat bg-cover">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
