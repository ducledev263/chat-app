import { Button, ButtonGroup } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'

function App() {
  return (
    <div className="flex min-h-screen bg-[url('https://connecteddeviceslab.org/wp-content/uploads/2016/08/MLseries-1-1440x1080.png')] 
    bg-center bg-no-repeat bg-cover">
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
