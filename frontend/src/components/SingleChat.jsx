import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, FormControl, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Text, Textarea, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'



const END_POINT = "http://localhost:5000"
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("")
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [socketConnected, setSocketConnected] = useState(false)
    const toast = useToast();

    
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }};


    const fetchMessages = async () => {
        if(!selectedChat) 
            {return;}

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    },
                };

            setLoading(true);

            const {data} = await axios.get(`api/message/${selectedChat._id}`, config);

            // console.log(data)
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the messages",
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top",
            });
        }
    }

    useEffect(() => {
        socket = io(END_POINT);
        socket.emit("setup", user);
        socket.on("connected", () => {setSocketConnected(true)});
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    })

    useEffect(() => {
        fetchMessages();
        // selectedChatCompare = selectedChat;
    }, [selectedChat]);

    // console.log(notification, "-------------------------")

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
        if(!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
            if(!notification.includes(newMessageReceived)){
                setNotification([newMessageReceived, ...notification])
            }
        } else {
            setMessages([...messages, newMessageReceived]);
            setFetchAgain(!fetchAgain);
        }
        });
    })

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage) {
            try {
                
                socket.emit("stop typing", selectedChat._id);
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                        },
                    };
                
                    setNewMessage("");

                    const { data } = await axios.post("/api/message",
                        {
                            content: newMessage,
                            chatId: selectedChat._id,
                            },
                            config
                        );
                    // console.log(data)
                    socket.emit('new message', data)
                    setMessages([...messages, data])
                    
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Messages",
                    status: "error",
                    duration: 2500,
                    isClosable: true,
                    position: "top",
                });
            }
        }
    }


    const typingHandler = (e) => {
        setNewMessage(e);

        if(!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
            }
            let lastTypingTime = new Date().getTime();
            var timerLength = 3000;
            setTimeout(() => {
                var timeNow = new Date().getTime();
                var timeDiff = timeNow - lastTypingTime;
                if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
                }
            }, timerLength);
    }

    return (
        <>
            { selectedChat 
                ? ( <>
                        <Box
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="sans-serif"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {!selectedChat.isGroupChat 
                                ? <Box display={'flex'} flexDir={'row'} gap={10} w={"100%"} justifyContent={'space-between'}>
                                    { getSender(user, selectedChat.users) }
                                    <ProfileModal user={getSenderFull( user, selectedChat.users)}/>  
                                </Box>
                                : (
                                    <Box display={'flex'} flexDir={'row'} gap={10} w={"100%"} justifyContent={'space-between'}>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal 
                                            fetchAgain={fetchAgain} 
                                            setFetchAgain={setFetchAgain}
                                            fetchMessages={fetchMessages}/>
                                    </Box>
                                )
                            }
                        </Box>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden">
                                { loading 
                                    ? <Spinner 
                                        size="xl"
                                        w={20}
                                        h={20}
                                        alignSelf="center"
                                        margin="auto"/>
                                    : (<div className='flex flex-column overflow-y-hidden h-full'>
                                        <ScrollableChat messages={messages} id='scrollable-chat'/>
                                    </div>)}
                                    {isTyping ? <div>
                                            <Lottie 
                                                options={defaultOptions}
                                                height={"20px"}
                                                width={'70px'}
                                                
                                                />
                                        </div> : (<div></div>)}
                        </Box>
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                <Input 
                                variant='outline'
                                bg="blue.100"
                                placeholder='Enter a message...'
                                onChange={(e) => typingHandler(e.target.value)}
                                value={newMessage}
                                
                                />
                                
                            
                            
                        </FormControl>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} >
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )}
        </>
    )
}

export default SingleChat
