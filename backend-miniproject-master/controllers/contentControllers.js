const { transporter } = require("../helper");
const db = require("../models");
const user_logins = db.user_logins;
const comment_tables = db.comment_tables
const content_tables = db.content_tables
const user_bios = db.user_bios
const like_tables = db.like_tables
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const fs = require('fs')
const path = require('path')


module.exports = {
    uploadContent: async (req, res) => {
        try {
            const formData = req.file.path
            const caption = req.body.caption
            // const like_point = 0
            const id_user_logins = Number(req.body.id_user_logins)

            const check = formData.split('.')
            const checkLength = check.length - 1

            if (check[checkLength] !== 'jpg' && check[checkLength] !== 'jpeg') {
                throw {
                    status: false,
                    message: 'need jpg or jpeg'
                }
            }


            const result = await content_tables.create({
                content_pic: formData,
                caption,
                like_point: 0,
                id_user_logins
            })


            res.status(200).send({
                status: true,
                message: 'success',
                result,
                check,
                checkLength
            })
        } catch (err) {
            res.status(400).send(err)
        }
    },
    getAllContent: async (req, res) => {
        try {

            const data = await content_tables.findAll()

            res.status(200).send({
                status: true,
                data
            })
        } catch (err) {
            res.status(400).send(err)
        }
    },
    deleteNontentId: async (req, res) => {
        try {

            const content = req.params.id

            const result = await content_tables.findOne({
                where: {
                    id: content
                }
            })

            let arrContent = result.content_pic
            arrContent = arrContent.split('\\')



            deleteImageFromServer(arrContent[1])

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

            const data = await content_tables.destroy({
                where: {
                    id: content
                }
            })

            res.status(200).send({
                message: 'success',
                content
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    gotMyContent: async (req, res) => {
        try {

            const { myId } = req.body

            const result = await content_tables.findAll({
                where: {
                    id_user_logins: myId
                }
            })

            res.status(200).send({
                status: true,
                message: 'success',
                result
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    getMyContent: async (req, res) => {
        try {

            const { id } = req.body;

            const result = await content_tables.findOne({
                where: {
                    id: id
                }
            })

            res.status(200).send({
                status: true,
                message: 'success',
                result
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    UpdateCaption: async (req, res) => {

        try {

            const { id, caption } = req.body;

            // const result = await content_tables.findOne({
            //     where: {
            //         id: id
            //     }
            // })

            const result = await content_tables.update({
                caption: caption
            }, {
                where: {
                    id: id
                },
                fields: ['caption', 'updateAt']
            })

            if (!result) throw {
                status: false,
                message: 'something went wrong'
            }

            res.status(200).send({
                status: true,
                message: 'success',
                result,
                caption
            })

        } catch (err) {
            res.status(400).send(err)
        }

    },
    addComment: async (req, res) => {
        try {

            const { comment, id_user_logins, id_content_tables } = req.body;

            const result = await comment_tables.create({
                comment,
                id_user_logins,
                id_content_tables
            })

            res.status(200).send({
                status: true,
                message: 'success',
                result
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    showCommentHome: async (req, res) => {

        try {

            // const { id } = req.body;

            const result = await comment_tables.findAll()

            const coba = await Promise.all(
                result.map(async (el) => {

                    return (
                        await user_logins.findOne({
                            where: {
                                id: el.id_user_logins
                            },
                            attributes: ["id", "username"]
                        })
                    )

                })
            )

            const commenterPic = await Promise.all(
                result.map(async (el) => {

                    return (
                        await user_bios.findOne({
                            where: {
                                id_user_logins: el.id_user_logins
                            },
                            attributes: ["id_user_logins", "pic"]
                        })
                    )

                })
            )

            res.status(200).send({
                result,
                coba,
                commenterPic
            })

        } catch (err) {
            res.status(400).send(err)
        }

    },
    getLike: async (req, res) => {
        try {
            
            const {id_user_logins, id_content_tables } = req.body

            const data = await like_tables.findAll({
                where :{
                    id_user_logins:id_user_logins,
                    id_content_tables: id_content_tables
                }
            })

            let deleted = null
            let result = null
            if (data.length > 0) {
                
                deleted = await like_tables.destroy({
                    where: {
                        id_content_tables: id_content_tables,
                        id_user_logins:id_user_logins,
                    }


                })


            }  else {
                result = await like_tables.create({
                    id_content_tables,
                    id_user_logins
                })
            }
            

            res.status(200).send({
                message: 'success',
                id_content_tables,
                id_user_logins,
                result,
                deleted
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    getDetileContent: async (req, res) => {
        try {

            const { contentData } = req.body

            const result = await content_tables.findOne({
                where: {
                    id :contentData
                },
                attributes: ['content_pic','caption', 'id_user_logins', 'updatedAt','id']
            })

            let pic = result.content_pic.split('\\')
            const picLenth = pic.length - 1

            pic = pic[picLenth]


            res.status(200).send({
                status: true,
                result,
                pic
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    allLike: async (req, res) => {
        try {
            
            const data = await like_tables.findAll()



            res.status(200).send({
                message:'success',
                data
            })

        } catch (err) {
            res.status(400).send(err)
        }
    },
    getUserId: async (req, res) => {

        try {

            const { id } = req.body

            const result = await content_tables.findOne({
                where: {
                    id: id
                },
                attributes: ['id_user_logins']
            })

            res.status(200).send({
                result
            })
        } catch (err) {
            res.status(400).send(err)
        }

    },
    delete: async (req, res) => {
        try {

            const id = req.params.id

            const result = await comment_tables.destroy({
                where: {
                    id
                }
            })

            res.status(200).send({
                message:'success',
                result
            })


        }catch (err) {
            res.status(400).send(err)
        }
    },
    deleteContent: async (req, res) => {
        try {

            const id = req.params.id

            const result = await content_tables.destroy({
                where: {
                    id
                }
            })

            res.status(200).send({
                message:'success',
                result
            })


        }catch (err) {
            res.status(400).send(err)
        }
    },
}