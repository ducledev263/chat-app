import React, { useEffect } from 'react'
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import SignUp from '../components/Authentication/SignUp'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate();
  useEffect( () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if(user) {
          navigate("/chats");
      }
  }, [navigate])

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius='lg'
        borderWidth={1}>
        <Text fontSize="5xl" fontFamily="monospace" color="blue.500" textAlign="center">
          WassApp
        </Text>
      </Box>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        borderRadius='lg'
        borderWidth={1}>
          <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
              <Tab width={"50%"}>Log In</Tab>
              <Tab width={"50%"}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login/>
              </TabPanel>
              <TabPanel>
                <SignUp/>
              </TabPanel>
            </TabPanels>
          </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
