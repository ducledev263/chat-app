import React from 'react'
import { ChatState } from '../Context/chatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState();

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
                                        <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
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
                            Messages here
                    </Box>
                </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} >
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )}
        </>
    )}

export default SingleChat
