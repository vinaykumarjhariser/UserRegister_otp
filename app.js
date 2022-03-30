const express = require('express');
const mongoose = require('mongoose');
const app = express()
const userApi = require("./model/user");
const otpGenerator = require('otp-generator')
// const nodemailer = require('./service/nodemailer');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');

app.use(express.json());
// app.use('/user',userApi);
const port = 3000


let otp = "";

app.post('/signup', async (req, res, next) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (password !== confirmpassword) {
        res.json({
            msg: "Password Not Matched!"
        })
    } else {
        otp = otpGenerator.generate(4, {
            digits: true,
            upperCaseAlphabets: true,
            specialChars: true
        });
        bcrypt.hash(password, 10, function (err, hash) {
            // Store hash in your password DB.
            if (err) {
                return res.json({
                    result: "Something went Wrong",
                    error: err
                })
            } else {
                const userDeatils = new userApi({
                    _id: new mongoose.Types.ObjectId(),
                    username: username,
                    email: email,
                    password: hash,
                    otp: otp

                })
                userDeatils.save()
                    .then(function (doc) {
                        res.status(201).json({
                            msg: "User Registered Sucessfully",
                            result: doc
                        })
                    }).catch(function (err) {
                        res.json(err)
                    })

            }

        });


    }

});

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',

    auth: {
        user: 'Your_mail',
        pass: 'Your_password',
    }

});

app.post('/send', function (req, res) {
    email = req.body.email;
    // send mail with defined transport object
    const mailOptions = {
        to: req.body.email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('otp');
    });
});

app.post('/verify', function (req, res) {

    if (req.body.otp === otp) {
        res.send("You has been successfully registered");
    } else {
        res.render('otp', {
            msg: 'otp is incorrect, Please try again!'
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})