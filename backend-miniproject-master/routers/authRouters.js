const { authControllers } = require("../controllers");
const router = require("express").Router();


router.post("/register", authControllers.userRegis);
router.get("/verified/:token", authControllers.verifiedEmail);
router.post("/login", authControllers.login);
router.post("/resend", authControllers.sendEmaiAgain);
router.post("/forgot-pass", authControllers.linkForgotPass);
router.get("/token-pass/:token", authControllers.resetPassRedirect);



module.exports = router