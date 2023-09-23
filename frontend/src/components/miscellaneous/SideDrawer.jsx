import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar } from '@chakra-ui/avatar'
import { ChatState } from '../../Context/chatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import Notification, {Effect} from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const navigate = useNavigate();
  const btnRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`, 
        }
      }

      const {data} = await axios.post("/api/chat", { userId }, config);
      console.log(data)
      console.log(chats)

      if(!chats.find( chat => chat._id === data._id)) setChats([data, ...chats]);
      console.log(chats);

      setSelectedChat(data);
      setLoading(false);
      onClose();

    } catch (error) {
      toast({
        title: "Error getting chat info",
        description: error.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
    });
    }
  }

  function logOutHandler () {
    setSelectedChat("");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if(!search) {
      toast({
        title: "Please type the name or email into the box!",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
    });
    }
    
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }

      const {data} = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error!!",
        description: "Failed to load Search results",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom-left",
    });
    }
  };

  return (
    <>
      <Box 
        display={'flex'}
        justifyContent={'space-between'}
        alignContent={'center'}
        bg={'white'}
        w={"100%"}
        p="5px 40px 5px 40px"
        borderWidth={5}>
        <Tooltip label="Search Users" hasArrow placement='bottom-end'>
          <Button variant={'ghost'} onClick={onOpen} bg={'gray.200'} mr={3}>
            <i className="fa-solid fa-magnifying-glass" />
            <Text 
              display={{base: "none", md: "flex"}}
              px={4}>
                Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"3xl"} fontFamily={'sans-serif'}><span>WassApp</span></Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count = {notification.length}
                effect = {Effect.Scale}
                className= "m-x-5"/>
              <BellIcon 
                fontSize={"3xl"}
                my={1}
                mx={1}/>
            </MenuButton>
            <MenuList display={"flex"} alignItems={'center'} justifyContent={'center'} flexDir={'column'}>
              <Text
                cursor={'pointer'}
                textAlign={'right'}
                alignSelf={"flex-end"}
                pr={0.5}
                mr={10}
                color={'green.500'}
                display={'flex'}
                flexDir={'row'}
                onClick={(() => setNotification([]))}>
                <img 
                  src={"https://static.tildacdn.com/tild6365-6330-4932-a338-373065383034/check_.png"}
                  width={20}
                  />
                Mark as read
              </Text>
              { notification.length === 0 && <Box><Text>No new notification </Text></Box> }
              { notification.map( noti => (
                      <MenuItem 
                        key={noti._id}
                        onClick={(() => {
                          setSelectedChat(noti.chat);
                          setNotification(notification.filter(n => n !== noti))
                        })}>
                        {noti.chat.isGroupChat 
                          ? `New notification from ${noti.chat.chatName}`
                          : `New notification from ${getSender(user, noti.chat.users)}`}
                      </MenuItem>
              ))
              }
            </MenuList>
          </Menu>
          <Menu >
            <MenuButton ml={3} p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic}/>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logOutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={'flex'} flexDirection={'row'}>
              <Input 
                placeholder='Type name or email...' 
                mr={2}
                value={search}
                onChange={ e => setSearch(e.target.value)}/>
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            { loading ? (
              <ChatLoading />
            ) : (
              searchResult.map(user => (
                <UserListItem 
                  key= {user._id}
                  user= {user}
                  handleFunction= {() => accessChat(user._id)}
                />
              ))
            )}
            { loadingChat && <Spinner ml={'auto'} display={'flex'}/> }
          </DrawerBody>
          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer
