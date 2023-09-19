import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      h={"13.5vh"}
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
      >
        <Avatar
        mr={2}
        size="md"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text fontSize="18px">{user.name}</Text>
        <Text fontSize="15px">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  )
}

export default UserListItem
