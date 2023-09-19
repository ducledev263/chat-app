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


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, chats, setChats } = ChatState();
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
        p="5px 10px 5px 10px"
        borderWidth={5}>
        <Tooltip label="Search Users" hasArrow placement='bottom-end'>
          <Button variant={'ghost'} onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass" />
            <Text 
              display={{base: "none", md: "flex"}}
              px={4}>
                Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"3xl"} fontFamily={'sans-serif'}>WassApp</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon 
                fontSize={"3xl"}
                m={1}/>
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
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
