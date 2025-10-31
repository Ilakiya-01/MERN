const router = require("express").Router();
const auth = require("../middleware/auth");
const postController = require("../controllers/postController");

router.post("/", auth, postController.create);
router.put("/:id", auth, postController.edit);
router.delete("/:id", auth, postController.delete);
router.get("/feed", auth, postController.getFeed);
router.post("/:id/like", auth, postController.like);
router.post("/:id/unlike", auth, postController.unlike);

module.exports = router;
