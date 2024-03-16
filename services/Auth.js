const jwt = require('jsonwebtoken');
const User = require('../models/user');

const key = "wuygfuywguygf8ywg7273y81"

const createToken = (id) => {
    const token = jwt.sign(id,key)
    return token;
}

const verifyToken = (token) => {
    const id = jwt.verify(token,key);
    return id;
}

const auth = async (req,res,next) => {
    const {token} = req.body;
    if(!token){
        return res.json({
            ok: false,
            message: 'token not found',
        })
    }
    const id = verifyToken(token);
    const user = await User.findById(id);
    if(!user){
        return res.json({
            ok: false,
            message: 'user not found',
        })
    }
    req.user = user;
    next();
}

const checkAuth = async (req,res) => {
    const {token} = req.body;
    if(!token){
        return res.json({
            ok: false,
            message: 'token not found',
        })
    }
    const id = verifyToken(token);
    const user = await User.findById(id).populate('contacts.contact');
    if(!user){
        return res.json({
            ok: false,
            message: 'user not found',
        })
    }
    
   
    const data = {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        contacts: user.contacts,
        publicKey:user.publicKey
    }
    
    res.json({
        ok: true,
        message: 'user found',
        data,
    })
}

async function lightAuth(req,res,next){
    const {token} = req.body;
    if(!token){
        return res.json({
            ok: false,
            message: 'token not found',
        })
    }
    const id = verifyToken(token);
    if(!id){
        return res.json({
            ok: false,
            message: 'invalid token',
        })
    }
    req.id = id;
    next();
}
    

module.exports = {createToken, verifyToken,auth,checkAuth,lightAuth};