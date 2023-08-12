const { userControllers } = require("../controllers");
const router = require("express").Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "./assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage: storage})

router.get("/", userControllers.getAllUsers);
router.delete("/:id", userControllers.deleteUser);
router.post('/reset-pass', userControllers.resetPass);
router.post('/check-username', userControllers.checkUserName);
router.post('/bio',upload.single('pic'), userControllers.editBio)
router.post("/my-bio", userControllers.getMyBio);
router.get('/all-user', userControllers.getUserName);

module.exports = router