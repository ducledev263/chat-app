import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        
        if(!query){
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const { data } = await axios.get(`https://chat-app-backend-zzgd.onrender.com/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to find users",
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top",
            });
        }
    }

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)) {
            toast({
                title: "Error Occured!",
                description: "User has already been added",
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter( keepUser => keepUser._id !== delUser._id)
        )
    }

    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers) {
            toast({
                title: "Error Occured!",
                description: "Please fill all the fields",
                status: "error",
                duration: 2500,
                isClosable: true,
                position: "top",
            });
            return;
        };

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`https://chat-app-backend-zzgd.onrender.com/api/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(user => user._id))
            },
            config);

            setLoading(false);
            setChats([data, ...chats]);
            setSelectedUsers([])
            onClose();
            toast({
                title: "Group chat created successfully",
                status: "success",
                duration: 2500,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to create group chat",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>
        
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent 
                    display={'flex'} 
                    flexDirection={'column'} 
                    justifyContent={'center'} 
                    alignItems={'center'} 
                    >
                <ModalHeader
                    fontSize="35px"
                    fontFamily="sans-serif"
                    display="flex"
                    justifyContent="center"
                    >Create Group Chat
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody display={'flex'} flexDir={"column"} alignItems={"center"} w={'100%'}>
                    <FormControl>
                        <FormLabel>Group name</FormLabel>
                        <Input 
                            placeholder='Enter group name here...' 
                            mb={3} 
                            onChange={(e => setGroupChatName(e.target.value))}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Search for users</FormLabel>
                        <Input 
                            placeholder='Enter user name here...' 
                            mb={1} 
                            onChange={(e => handleSearch(e.target.value))}
                        />
                    </FormControl>
                    <Box display={'flex'} flexDir={'row'} flexWrap={'wrap'}>
                        {selectedUsers.map(u => (
                            <UserBadgeItem
                                key = {u._id}
                                user = {u}
                                handleFunction = {() => handleDelete(u)}
                            />
                            ))}
                    </Box>
                    { loading ? (
                        <Spinner />
                    ) : (
                        searchResult?.slice(0,3).map(user => (
                            <UserListItem 
                                key={user._id}
                                user={user}
                                handleFunction={() => handleGroup(user)}
                            />
                        ))
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' onClick={handleSubmit}>
                        Create Chat
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal
