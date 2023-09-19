import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../Context/chatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChat from '../components/miscellaneous/MyChat';
import ChatBox from '../components/miscellaneous/ChatBox';

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false)
    return (
        <div className='w-full'>
            { user && <SideDrawer />}
            <Box
                display={'flex'} 
                justifyContent='space-between'
                w="100%"
                h="91.5vh"
                p={10}
            >
                { user && <MyChat fetchAgain={fetchAgain} />}
                { user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            </Box>
        </div>
    )
}

export default ChatPage
