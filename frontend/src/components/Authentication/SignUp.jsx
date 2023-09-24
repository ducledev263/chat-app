import { FormControl, FormLabel, Input, VStack, InputGroup, InputRightElement, Button, useToast, Text } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [pic, setPic] = useState("");
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate();

    function handleClick() {
        setShow(!show);
        }

    const handleSubmit = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
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
        if( password !== confirmpassword) {
            toast({
                title: "Passwords do not match!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const { data } = await axios.post("/api/user", { name, email, password, pic}, config);
            toast({
                title: "Registration Successfully!",
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
        }
    };

    const uploadImage = (e) => {
        setLoading(true);

        if (e === undefined) {
        toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return;
        }

        if (e.type !== "image/jpeg" && e.type !== "image/png") {
        toast({
            title: "Please Select a JPEG or PNG Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        setLoading(false);
        return;
        }

        if (e.type === "image/jpeg" || e.type === "image/png") {
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
                setPic(data.url.toString())
                setLoading(false)
                toast({
                    title: "Image uploaded successfully!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                })
            })
        }
};

    return (
        <VStack spacing={4}>
            <FormControl id="name" isRequired>
                <FormLabel>
                    Name
                </FormLabel>
                <Input 
                    placeholder='Enter your name...'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
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
            <FormControl id="confirmpassword" isRequired>
                <FormLabel>
                    Confirm Password
                </FormLabel>
                <InputGroup>
                    <Input
                    type={show? "text" : 'password'}
                    placeholder='Enter your password again...'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic" isRequired>
                <FormLabel>
                    Upload your profile picture
                </FormLabel>
                <Input 
                    type='file'
                    p={1.5}
                    accept='image/png, image/gif, image/jpeg'
                    onChange={(e) => uploadImage(e.target.files[0])}
                />
                <Text as="i">*Maximum size: 10mb</Text>
            </FormControl>
            <Button 
                colorScheme='blue' 
                width="100%"
                m={5}
                onClick={handleSubmit}
                isLoading={loading}>
                Sign Up
            </Button>
        </VStack>
    )
}

export default SignUp
