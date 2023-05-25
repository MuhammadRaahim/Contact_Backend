const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const sharp = require('sharp')
const path = require('path')
const nodemailer = require("nodemailer");



const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, image} = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
        res.status(400);
        throw new Error("User already exist !");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashPassword,
        image: image || ""
    });

    if (user) {
        res.status(201).json({ message: 'User Register Sucessfully.', user: { id: user.id, username: user.username, email: user.email } });
    } else {
        res.status(400);
        throw new Error("User already exist !");
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECERT,
            { expiresIn: "15m" }
        );
        res.status(200).json({
            message: 'User login Sucessfully.',
            user: { id: user.id, username: user.username, email: user.email },
            tokken: accessToken
        });
    } else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
})

const currentUser = asyncHandler(async (req, res) => {
 const currentUser = await User.findById(req.user.id).select('-password -__v');;
 res.status(200).json({ status: true, message: 'User information', user: currentUser });
})

const uploadProfile = asyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            res.status(401);
            throw new Error("No file uploaded");
        }
        const parentDirectory = path.resolve(__dirname, '..');
        const resizedImagePath = path.join(parentDirectory, 'uploads', req.user.id + '-profile.png');
        await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toFile(resizedImagePath);

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.user.id}-profile.png`;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { image: fileUrl },
            { new: true }
          );

        res.status(200).json({ status: true, message: `Profile image uploded.` });
    } catch (error) {
        res.status(500);
        throw new Error("server error");
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    
        const { email } = req.body;
        if (!email) {
            res.status(400);
            throw new Error("email field is require");
        }
        const user = await User.findOne({ email });
        if(!user){
            res.status(400);
            throw new Error("email is not registerd");
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'malvina.kirlin0@ethereal.email',
                pass: 'UadkVbmgmPzHhPTmdA'
            }
        });

        let info = await transporter.sendMail({
            from: '"Raahim Mughal" <raahimmughal1250@gmail.com>', // sender address
            to: "hassan.m.seham@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        });

        res.status(200).json({status: true, message: `Forgot Password mail sent sucessfully.`})

    
})



module.exports = { registerUser, loginUser, currentUser, uploadProfile, forgotPassword}