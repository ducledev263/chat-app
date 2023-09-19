import { Badge, CloseButton } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    const randomColor = ["red", "orange", "green", "blue", "purple", "pink", "gray"]
    return (
        <Badge
            px={2}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme={randomColor[Math.floor(Math.random() * 7)]}
            cursor="pointer"
            onClick={handleFunction}
            display={"flex"}
            flexDir={'row'}
            alignItems={'center'}
        >
            {user.name}
            <CloseButton pl={1}/>
        </Badge>
    )
}

export default UserBadgeItem
