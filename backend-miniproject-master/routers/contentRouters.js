const router = require("express").Router();
const multer = require('multer');
const { contentControllers } = require('../controllers')


const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage: storage})

router.post('/upload-content',upload.single('content_pic'), contentControllers.uploadContent)
router.get('/all-content', contentControllers.getAllContent);
router.delete('/delete/:id', contentControllers.deleteNontentId);
router.post('/my-content', contentControllers.gotMyContent);
router.post('/my-one-content', contentControllers.getMyContent);
router.post('/update-caption', contentControllers.UpdateCaption);
router.post('/add-comment', contentControllers.addComment);
router.get('/all-comment', contentControllers.showCommentHome);
router.post('/like', contentControllers.getLike)
router.post('/detile-content', contentControllers.getDetileContent)
router.get('/data-like', contentControllers.allLike);
router.post('/get-id', contentControllers.getUserId)
router.delete('/delete-comment/:id',contentControllers.delete);
router.delete('/delete-content/:id',contentControllers.deleteContent)


module.exports = router
