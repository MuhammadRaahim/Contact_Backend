const express = require('express');
const userController = require('../controlers/usercontroller');
const validateToken = require('../middleware/validateTokkenHandler');
const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 5242880
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a valid image file'))
        }
        cb(undefined, true)
    }
});

const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/forgot-password', userController.forgotPassword);

router.get('/getCurrentUser', validateToken, userController.currentUser);
router.post('/upload-profile', validateToken,upload.single('profile_image'),userController.uploadProfile);

module.exports = router;
