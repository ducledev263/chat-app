import { FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate();

    function handleClick() {
        setShow(!show);
    }

    const handleSubmit = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: "Please fill all the fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setLoading(false)
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const { data } = await axios.post(`https://chat-app-backend-zzgd.onrender.com/api/user/login`, { email, password }, config);
            toast({
                title: "Login Successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));

            setLoading(false);
            navigate("/chats");
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
    };

    return (
        <VStack spacing={4}>
            <FormControl id="email" isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input 
                    placeholder='Enter your email...'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup>
                    <Input
                    type={show? "text" : 'password'}
                    placeholder='Enter your password...'
                    onChange={(e) => setPassword(e.target.value)}
                />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button 
                colorScheme='blue' 
                width="100%"
                m={5}
                onClick={handleSubmit}
                isLoading={loading}>
                Login
            </Button>
        </VStack>
    )
}

export default Login
