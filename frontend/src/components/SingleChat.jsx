import React, { useEffect, useRef, useState } from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, FormControl, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Text, Textarea, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, AttachmentIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'
import Lottie from 'lottie-react'
import animation from '../animations/typing.json'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const END_POINT = "https://chat-app-backend-zzgd.onrender.com/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const fileRef = useRef();
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("")
    const { user, selectedChat, setSelectedChat, notification, setNotification, imageReceive, setImageReceive } = ChatState();
    const [socketConnected, setSocketConnected] = useState(false)
    const toast = useToast();
    const [showPicker, setShowPicker] = useState(false);
    const [file, setFile] = useState([]);
    const [imageSend, setImageSend] = useState();

    const onEmojiSelect = (emojiObject) => {
        setNewMessage(prevInput => prevInput + emojiObject.native)
    };

    document.onclick = (e) => {
        console.log(e.target.tagName)
        if(e.target.tagName === "DIV" 
        || e.target.tagName === "INPUT" 
        || e.target.tagName === "SPAN" 
        || e.target.tagName === "BUTTON") 
            {setShowPicker(false)}};

    const selectFile = () => {
        fileRef.current.click();
    }

    const fetchMessages = async () => {
        if(!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    },
                };

            setLoading(true);

            const {data} = await axios.get(`https://chat-app-backend-zzgd.onrender.com/api/message/${selectedChat._id}`, config);
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
    },[])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
            if(!notification.includes(newMessageReceived)){
                setNotification([newMessageReceived, ...notification])
                setFetchAgain(!fetchAgain);
            }
        } else {
            setMessages([...messages, newMessageReceived]);
        }
        });
    })

    const uploadImage = (e) => {
        if (e.type === "image/jpeg" || e.type === "image/png" || e.type === "image/gif") {
            const data = new FormData();
            data.append("file", e);
            data.append("upload_preset", "chat-app");
            fetch(import.meta.env.VITE_CLOUDINARY_URI, {
                method: "post",
                body: data
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setImageReceive(data.url.toString())
                setLoading(false)
                toast({
                    title: "Image uploaded successfully!",
                    status: "success",
                    duration: 2500,
                    isClosable: true,
                    position: "top",
                })
            })
        }
    }

    const sendMessage = async (e) => {
        if(e.key === "Enter" && newMessage && imageSend) {
            toast({
                title: "Error Occured!",
                description: "Please only send text message or image message",
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top",
            });
            return;
        }
        if(e.key === "Enter" && newMessage && !imageSend) {
            try {
                socket.emit("stop typing", selectedChat._id);
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                        },
                    };
                
                    setNewMessage("");
                    const { data } = await axios.post("https://chat-app-backend-zzgd.onrender.com/api/message",
                        {
                            content: 'string ' + newMessage,
                            chatId: selectedChat._id,
                            },
                            config
                        );

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
                return;
            }
        }

        if(e.key === "Enter" && !newMessage && imageReceive) {
            try {
                socket.emit("stop typing", selectedChat._id);
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                        },
                    };
                
                    setNewMessage("");
                    const { data } = await axios.post("https://chat-app-backend-zzgd.onrender.com/api/message",
                        {
                            content: 'image ' + imageReceive,
                            chatId: selectedChat._id,
                        },
                            config
                        );

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
                return;
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
                                    {/*{isTyping ? <div>
                                            <Lottie 
                                                loop= {true}
                                                animationData= {animation}
                                                
                                                />
                                    </div> : (<div></div>)}*/}
                                    { imageSend 
                                        ? (<div className='flex flex-row-reverse bg-[#BEE3F8] mt-2'>
                                        <span className='flex justify-center items-center h-full ml-3'>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                                                <path 
                                                    onClick={() => {
                                                        setFile([]);
                                                        setImageSend("");
                                                    }}
                                                    cursor={"pointer"}
                                                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 
                                                    0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 
                                                    45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 
                                                    0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
                                            </svg>
                                        </span>
                                        
                                        <Text>{imageSend}</Text></div>)
                                        : (<div></div>)}
                        </Box>
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            <InputGroup>
                                <Input 
                                variant='outline'
                                bg="blue.100"
                                placeholder="Enter new message..."
                                onChange={(e) => typingHandler(e.target.value)}
                                value={newMessage}
                                
                                />
                                <InputRightElement display={"flex"} justifyContent={'space-evenly'} width={20}>
                                    <div>
                                        <img
                                        className='cursor-pointer'
                                        src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                                        onClick={() => setShowPicker(!showPicker)}
                                        />
                                    </div>
                                    <div className='absolute bottom-10 right-4'>
                                    {showPicker && <Picker
                                        data={data} 
                                        onEmojiSelect={(e) => onEmojiSelect(e)} 
                                        emojiSize={20}
                                        previewPosition={'none'}
                                        maxFrequentRows={1}
                                        emojiButtonRadius={"6px"}
                                        perLine={8}
                                        />}
                                    </div>
                                    <AttachmentIcon cursor={'pointer'} onClick={selectFile} />
                                    <input 
                                        type='file' 
                                        accept="image/png, image/gif, image/jpeg" 
                                        ref={fileRef}
                                        style={{display: "none"}}
                                        onChange={e => {
                                            console.log(e.target.files[0]);
                                            // setFile(e.target.files[0])
                                            setImageSend(e.target.files[0].name);
                                            uploadImage(e.target.files[0]);
                                        }}/>
                                </InputRightElement>
                            </InputGroup>
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
