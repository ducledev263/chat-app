import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from "@chakra-ui/react"
import {BrowserRouter as Router} from "react-router-dom"
import './index.css'
import ChatProvider from './Context/chatProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <ChakraProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ChakraProvider>
    </Router>
)
