import { ViewIcon } from '@chakra-ui/icons'
import {Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ( {user, children} ) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
        {children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
        )}

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <ModalHeader 
            fontSize={40}
            fontFamily={'sans-serif'}
            display={'flex'}
            justifyContent={'center'}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'} justifyContent={'center'} flexDirection={"column"} alignItems={'center'}>
            <Image
                boxSize='200px'
                objectFit='cover'
                src={user.pic}
                alt='profile-pic'
                borderRadius={'full'}
            />
            <Text 
                fontSize= {{base: "28px", md: "32px"}}
                fontFamily={'sans-serif'}
            >
                Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export default ProfileModal
