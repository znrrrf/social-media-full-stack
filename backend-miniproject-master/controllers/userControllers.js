const db = require("../models");
const user_logins = db.user_logins;
const user_bios = db.user_bios;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    getAllUsers: async (req, res) => {
        try {

            const data = await user_logins.findAll()

            res.status(200).send({
                message: "data sended",
                data
            });

        } catch (err) {
            res.status(400).send(err);
        }
    },
    deleteUser: async (req, res) => {
        try {

            const userId = req.params.id
            const result = await user_logins.destroy({
                where: {
                    id: userId
                }
            })

            res.status(200).send({
                message: `user success deleted`,
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    resetPass: async (req, res) => {
        try {

            // const id = req.params.id;
            // const password = req.params.password;
            // const token = req.params.token;

            const { id, password, token } = req.body


            jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
                if (err) {
                    throw {
                        status: false,
                        message: "token error"
                    }
                    // throw res.status(400).send(err)
                }
            })


            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(password, salt)

            const result = await user_logins.update({
                password: hashPass
            }, {
                where: {
                    id: id
                },
                fields: ['password', 'updateAt']
            });

            if (!result) throw {
                status: 404,
                message: "something went wrong"
            }

            res.status(200).send({
                message: "password updated",
                password
                // data: decoded
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    checkUserName: async (req, res) => {
        try {

            const { username, profileName } = req.body

            if (username == null || username == '') throw {
                status: false,
                message: 'input username'
            }

            let result = null

            if (username !== profileName) {

                result = await user_logins.findOne({
                    where: {
                        username: username
                    }
                })

                if (result) throw {
                    status: false,
                    message: "username is already used"
                }

            }



            res.status(200).send({
                status: true,
                message: 'username good',
                result,
                username
            })
        } catch (err) {
            res.status(400).send(err)
        }
    },
    editBio: async (req, res) => {
        try {
            // console.log(typeof req.file.path);
            // const {fullname} = req.body
            const formData = req.file.path
            const fullname = req.body.fullname
            const address = req.body.address
            const userdate = req.body.userdate
            const hobby = req.body.hobby
            const username = req.body.username
            const email = req.body.email

            const check = formData.split('.')
            const checkLength = check.length - 1
            // const result = check[checkLength]

            if (check[checkLength] !== 'jpg' && check[checkLength] !== 'jpeg') {
                throw {
                    status: false,
                    message: 'need jpg or jpeg'
                }
            }

            const data = await user_logins.findOne({
                where: {
                    email
                }
            })

            // const id = data.id

            const isExist = await user_bios.findOne({
                where: {
                    id_user_logins: data.id
                }
            })

            let result_bio = null
            let result_logins = null
            let imageUser = null

            if (isExist) {

                result_bio = await user_bios.update({
                    fullname,
                    address,
                    userdate,
                    hobby,
                    pic: formData,
                    // id_user_logins: data.id
                }, {
                    where: {
                        id_user_logins:data.id
                    }
                })

                result_logins = await user_logins.update({
                    username
                }, {
                    where: {
                        id: data.id
                    }
                })

                if (isExist.pic !== formData) {


                    imageUser = isExist.pic.split('\\')

                    deleteImageFromServer(imageUser[1])

                    function deleteImageFromServer(imagePath) {
                        const fullPath = path.join(__dirname, '..', 'assets', imagePath);
                        fs.unlink(fullPath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            // console.log('Image deleted successfully');
                        });
                    }

                }



            } else if (!isExist) {

                result_bio = await user_bios.create({
                    fullname,
                    address,
                    userdate,
                    hobby,
                    pic: formData,
                    id_user_logins: data.id
                })

                result_logins = await user_logins.update({
                    username
                }, {
                    where: {
                        id: data.id
                    }
                })
            }




            // formData.split('\\')

            // const result = await user_logins

            // let pic = formData.split("\\")
            // pic = pic[pic.length-1]
            // const {name} = req.body

            res.status(200).send({
                status: true,
                message: 'success',
                result_bio,
                result_logins
                // name
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    getMyBio: async (req, res) => {
        try {

            const {id} = req.body;

            const result = await user_bios.findOne({
                where: {
                    id_user_logins: id
                }
            })

            res.status(200).send({
                status:true,
                message: 'success',
                result
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    getUserName: async (req, res) => {
        try {

            const data = await user_logins.findAll({
                attributes: ['id', 'username']
                
            })

            res.status(200).send({
                message: "data sended",
                data
            });

        } catch (err) {
            res.status(400).send(err);
        }
    },

}