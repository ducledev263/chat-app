import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/chatProvider'
import { Avatar, Box, Button, Image, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../../config/ChatLogics';
import ChatLoading from '../ChatLoading';
import GroupChatModal from './GroupChatModal';
import axios from 'axios';

const MyChat = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      console.log(chats);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return ( 
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "33%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="sans-serif"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            size={'sm'}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll"
          sx={
            { 
            '::-webkit-scrollbar':{
                    display:'none'
                }
            }
          }>
            {chats.map((chat) => (
              <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                
                  {!chat.isGroupChat
                    ? <Image
                        src= { chat.users[0]?._id === loggedUser?._id ? chat.users[1].pic : chat.users[0].pic }
                        boxSize='65px'
                        objectFit='cover'
                        alt='profile-pic'
                        borderRadius={'full'}
                        mx={10}/>
                    : <Image
                        src= { "https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/1ff1a8119017069.6094a60452513.png" }
                        boxSize='65px'
                        objectFit='cover'
                        alt='profile-pic'
                        borderRadius={'full'}
                        mx={10}/>}
                
                <Text fontSize={"lg"}>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {/*{chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                    )}*/}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )};
export default MyChat
