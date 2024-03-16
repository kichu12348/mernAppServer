const Message = require('../models/message');

async function getMessages(req,res){
    const {roomID} = req.body;
   
    const data = await Message.find({roomID});
    res.json({
        ok: true,
        message: 'messages found',
        data,
    })
}

async function sendMessage(req,res){
    const {
        from,
        encryptedMessage,
        encryptedKeyA,
        encryptedKeyB,
        roomID,
        iv
    } = req.body;
    await Message.create({
        from,
        message: encryptedMessage,
        roomID,
        encryptedKeyA,
        encryptedKeyB,
        iv
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