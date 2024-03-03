const message = require('../models/message');

async function getMessages(req,res){
    const {roomID} = req.body;
    const data = await message.find({roomID});
    res.json({
        ok: true,
        message: 'messages found',
        data,
    })
}

async function sendMessage(req,res){
    const {from,message,roomID} = req.body;
    await message.create({
        from,
        message,
        roomID,
    })
    
    res.json({
        ok: true,
        message: 'message sent',
    })
}

module.exports = {
    getMessages,
    sendMessage,
}