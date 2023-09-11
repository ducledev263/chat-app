import { Button, ButtonGroup } from '@chakra-ui/react'
import { Route } from 'react-router-dom/cjs/react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'

function App() {
  return (
    <>
      <Route exact path="/" component={HomePage} />
      <Route path="/chats" component={ChatPage} />
    </>
  )
}

export default App
