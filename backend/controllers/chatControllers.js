const asyncHandler = require("express-async-handler");
const Chat = require('../Models/chatModel')
const User = require('../Models/userModel')

const accessChat = asyncHandler( async (req, res) => {
    const {userId} = req.body;

    if(!userId) {
        console.log("UserId param did not send with request!");
        return res.sendStatus(400);
    }
    
    var isChat = await Chat.find({
        isGroupChat: false, 
        $and:[
            { users: {$elemMatch: {$eq: req.user._id}}},
            { users: {$elemMatch: {$eq: userId}}}
        ],
    })
        .populate("users", " -password")
        .populate("latestMessage")

        

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        })

        if(isChat.length > 0) {
            res.send(isChat[0]);
        }else{
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            }

            try {
                const createdChat = await Chat.create(chatData);

                const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", " -password")

                res.status(200).send(fullChat);

            } catch (error) {
                res.status(401);
                throw new Error(error.message);
            }
        }
})

const fetchChats = asyncHandler( async (req, res) => {
    try {
        Chat.find({ users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then( async (result) => {
            result = await User.populate(result, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    
    
})

const createGroupChat = asyncHandler(async (req, res) => {
    if(!req.body.name || !req.body.users ) {
        return res.status(400).send("Please fill all the fields!!");
    }

    var users = JSON.parse(req.body.users); // nhung nguoi muon cho vao nhom
    if(users.length < 2) {
        return res.status(400).send("Need to add more than 2 people to create a group chat!");
    }

    users.push(req.user); // them nguoi dang yeu cau tao nhom
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })
        const fullGroupChat = await Chat.findOne( {_id: groupChat._id} )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

            res.status(200).json(fullGroupChat);

    } catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
})

const renameGroup = asyncHandler( async (req, res) => {
    const {chatId, chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName
        },
        {new : true},
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!updatedChat) {
        res.status(404)
        throw new Error("Chat not found");
    }else{
        res.json(updatedChat);
    }
}) 

const removeFromGroup = asyncHandler( async (req, res) => {
    const { chatId , userId } = req.body;

    const remove = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: {users: userId}},
        {new: true},
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!remove) {
        res.status(404)
        throw new Error("Chat not found");
    }else{
        res.json(remove);
    }
})

const addToGroup = asyncHandler( async (req, res) => {
    const { chatId , userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        { $push: {users: userId} },
        {new: true},
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!added) {
        res.status(404)
        throw new Error("Chat not found");
    }else{
        res.json(added);
    }
})

const delGroup = asyncHandler( async (req, res) => {
    const { chatId } = req.body;
    
    const delGroup = await Chat.findByIdAndDelete(chatId);

    if(!delGroup) {
        res.status(400);
        throw new Error("Error occured");
    }else{
        res.json(delGroup);
    }
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup, delGroup };