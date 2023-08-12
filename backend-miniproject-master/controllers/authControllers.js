const { transporter } = require("../helper");
const db = require("../models");
const user_logins = db.user_logins;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


module.exports = {
    userRegis: async (req, res) => {
        try {

            const { email, username, password } = req.body;

            const emailIsExist = await user_logins.findOne({
                where: {
                    email
                }
            });

            const usernameIsExist = await user_logins.findOne({
                where: {
                    username
                }
            });

            if (emailIsExist && usernameIsExist) {
                throw {
                    status: "both",
                    message: "someone already used both of it",
                }
            } else if (usernameIsExist) {
                throw {
                    status: "username",
                    message: "username already used",
                }
            } else if (emailIsExist) {
                throw {
                    status: "email",
                    message: "email already used"
                }
            }

            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(password, salt);
            const result = await user_logins.create({
                email,
                username,
                password: hashPass,
                is_verified: false
            });

            const payload = { id: result.id, email: result.email }
            const token = jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "5m" })

            const url = `http://localhost:5000/auth/verified/${token}`

            await transporter.sendMail({
                from: "admin <inuiro1@gmail.com>",
                to: result.email,
                subject: "activate account",
                html: `<h1>click this link to verified: <a href= "${url}">${url}</a></h1>`
            });
            //04/04/2023

            // res.json({
            //     status: true,
            //     message: "email sended"
            // })
            console.log("email sended");

            res.status(200).send({
                message: "email sended"
            })

        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
    verifiedEmail: async (req, res) => {
        try {

            const token = req.params.token

            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
                    if (err) {
                        if (err.name === "TokenExpiredError") {
                            // token expired, redirect to verification page
                            return res.redirect("http://localhost:3000/err-token")
                        // reject(err);
                        // throw res.redirect("http://localhost:3000/err-token");
                        }
                        reject(err);
                    }
                    resolve(decoded)

                })
            })

            const id = decoded.id
            // const email = decoded.email

            const result = await user_logins.update({
                is_verified: true
            }, {
                where: {
                    id
                },
                fields: ['is_verified', 'updatedAt']
            })

            // res.status(200).send({
            //     message: "tverifiedt",
            //     email,
            //     id,
            //     result
            // })
            return res.redirect("http://localhost:3000/verif")

        } catch (err) {
            console.log("unverified & error");
            // res.status(400).send(err)
            res.redirect("http://localhost:3000/err-token");
        }
    },
    login: async (req, res) => {
        try {
            const { value, credential, password } = req.body;

            let result = null
            let userPass = null
            let profile = null

            if (value === "email") {
                result = await user_logins.findOne({
                    where: {
                        email: credential
                    },
                    attributes: ['id', 'email', 'username', 'is_verified']
                })

                userPass = await user_logins.findOne({
                    where: {
                        email: credential
                    },
                    attributes: ['password']
                })

                profile = await user_logins.findOne({
                    where: {
                        email: credential
                    },
                    attributes: ['username']
                })

            } else if (value === "username") {
                result = await user_logins.findOne({
                    where: {
                        username: credential
                    },
                    attributes: ['id', 'email', 'username', 'is_verified']
                })

                userPass = await user_logins.findOne({
                    where: {
                        username: credential
                    },
                    attributes: ['password']
                })

                profile = await user_logins.findOne({
                    where: {
                        username: credential
                    },
                    attributes: ['username']
                })

            }

            if (!result) throw {
                type: "credential",
                message: "username or email is not found"
            }

            const isValid = await bcrypt.compare(password, userPass.password)

            if (!isValid) throw {
                type: "pass",
                message: "wrong password"
            }

            // console.log(result);

            res.status(200).send({
                status: true,
                message: "logins success",
                result,
                profile
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    sendEmaiAgain: async (req, res) => {
        try {

            const {id , email} = req.body;

            const payload = { id: id, email: email }
            const token = jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: "5m"});

            const url = `http://${process.env.DB_HOST}:${process.env.PORT}/auth/verified/${token}`

            await transporter.sendMail({
                from: `admin <${process.env.EMAIL}>`,
                to: email,
                subject: "activating account",
                html: `<h1>click this link to verified: <a href="${url}">${url}</a><h/>`
            })

            console.log("email sended");
            
            res.status(200).send({
                message: "email sended"
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    linkForgotPass: async (req, res) => {
        try {

            const {email} = req.body;

            const result = await user_logins.findOne({
                where: {
                    email: email
                },
                attributes: ['id', 'email']
            })

            if (!result) throw {
                status: 404,
                message: "email not registered"
            }

            const payload = { id: result.id, email: result.email }
            const token = jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn:"5m"});

            const url = `http://${process.env.DB_HOST}:${process.env.PORT}/auth/token-pass/${token}`

            await transporter.sendMail({
                from: `admin <${process.env.EMAIL}>`,
                to: email,
                subject: 'forgot password',
                html: `<h1>click the link for reset your password: <a href='${url}'>${url}</a></h1>`
            })

            console.log("email sended");
            
            res.status(200).send({
                message: "email sended",
                result
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    resetPassRedirect: async (req, res) => {
        try {

            const token = req.params.token

            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
                    if (err) {
                        if (err.name === "TokenExpiredError") {
                            // token expired, redirect to verification page
                            return res.redirect("http://localhost:3000/err-token")
                        // reject(err);
                        // throw res.redirect("http://localhost:3000/err-token");
                        }
                        reject(err);
                    }
                    resolve(decoded)

                })
            })

            const id = decoded.id

            const result = await user_logins.findOne({
                where: {
                    id: id
                },
                // attributes: ["id"]
            })

            if ( !result ) throw {
                status: 404,
                message: "account not found"
            }

            // res.status(200).send({
            //     message: "account founded",
            //     result,
            // })
            // localStorage.setItem("userData", JSON.stringify(result))

            res.redirect(`http://localhost:3000/reset-pass-page/${token}`)

        } catch (err) {
            res.status(400).send(err)
        }
    }
}