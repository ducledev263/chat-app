import { ViewIcon } from '@chakra-ui/icons';
import { useDisclosure, 
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    useToast,
    Box,
    Input,
    FormControl,
    Spinner, } from '@chakra-ui/react';
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const { selectedChat, setSelectedChat, user } = ChatState();
    const toast = useToast();

    const handleRename = async () => {
        if(!groupChatName){
            toast({
                title: "Error Occured!",
                description: "Please enter a new group name",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    },
                };

            const {data} = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });

            setRenameLoading(false);
        }

        setGroupChatName("");
    }

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

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            console.log(data);
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

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User is already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
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

            const {data} = await axios.put("/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
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

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
                });
                return;
            }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                };
                const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
                );

                user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
                setFetchAgain(!fetchAgain);
                fetchMessages();
                setLoading(false);
            } catch (error) {
                toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
                });
                setLoading(false);
            }
        setGroupChatName("");
    };

    return (
        <>
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}/>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader display={'flex'} justifyContent={'center'} fontSize={35}>{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box display='flex' flexWrap='wrap' h="100%">
                    {selectedChat.users.map(u => 
                        <UserBadgeItem 
                        key = {u._id}
                        user = {u}
                        handleFunction = {() => handleRemove(u)}
                        />
                        )}
                </Box>
                    <FormControl display="flex">
                        <Input
                            placeholder="Enter new Group Name"
                            mb={3}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                </FormControl>
                <FormControl>
                    <Input
                        placeholder="Add User to group"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading ? (
                    <Spinner />
                ) : (
                    searchResult?.slice(0,3).map(returnedUser => (
                        <UserListItem 
                            key={returnedUser._id}
                            user={returnedUser}
                            handleFunction={() => handleAddUser(returnedUser)}
                        />
                    ))
                )}
            </ModalBody>
            <ModalFooter>
                <Button onClick={() => handleRemove(user)} colorScheme="red">
                    Leave Group
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default UpdateGroupChatModal
