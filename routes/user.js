const router = require('express').Router();
const { signUp, login,addContact,deleteContact,searchQuery} = require('../controllers/user');
const {auth, checkAuth,lightAuth} = require('../services/Auth');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/addContact',auth, addContact);
router.post('/deleteContact',auth, deleteContact);
router.post('/checkAuth',checkAuth);
router.post('/search',lightAuth,searchQuery);


module.exports = router;    

