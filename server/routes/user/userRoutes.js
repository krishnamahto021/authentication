const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/userController");
const { checkToken } = require("../../middlewares/checkTokenMiddleware");
const postController = require("../../controllers/posts/postsController");

router.post("/sign-up", userController.signUp);
router.get("/verify-user/:token", userController.verifyUser);
router.post("/reset-password", userController.sendMailForResetPassword);

router.post(
  "/update-password/:token",
  checkToken,
  userController.updatePassword
);

router.get("/get-posts", postController.sendPosts);

module.exports = router;
