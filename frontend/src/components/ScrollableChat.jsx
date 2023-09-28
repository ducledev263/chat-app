import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/chatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    return (
        <ScrollableFeed className='w-full'>
            { messages && messages.map((m,i) => (
                <div className='flex w-full' key={m._id}>
                    { (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) 
                        ? (<Tooltip    
                            label={m.sender.name} 
                            placement="bottom-start" 
                            hasArrow>
                                <Avatar
                                    mt="5px"
                                    mr={1}
                                    size="sm"
                                    cursor="pointer"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                />
                        </Tooltip>
                    ) : (<span></span>)}
                        <span
                        style={{
                            backgroundColor: `${
                            m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                            }`,
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                            borderRadius: "15px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                        }}
                        >{m.content.split(" ")[0] === "image"
                            ? (<Image 
                                src={m.content.split(" ")[1]}
                                />)
                            : ( m.content.split(" ")[0] === "string"
                                ? m.content.split(" ").slice(1).join(" ")
                                : (<div>{m.content}</div>))}</span>    
                </div>
            )
            
            )}
        </ScrollableFeed>
    )
}

export default ScrollableChat
