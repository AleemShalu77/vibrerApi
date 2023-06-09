const commentController = require("./commentController");

module.exports = router => {
  router.post("/add/comment", commentController.addComment);
  router.put("/update/comment", commentController.updateComment);
  router.get("/all/comment", commentController.getAllComment);
  router.get("/comment/:id", commentController.getComment);
  router.post("/remove/comment/:id", commentController.deleteComment);
}