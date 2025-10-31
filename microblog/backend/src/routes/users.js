const router = require("express").Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

router.put("/me", auth, userController.updateMe);
router.get("/", auth, userController.search);
router.get("/:id", auth, userController.getProfile);
router.post("/:id/follow", auth, userController.follow);
router.post("/:id/unfollow", auth, userController.unfollow);

module.exports = router;
