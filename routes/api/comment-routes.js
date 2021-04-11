const router = require('express').Router();
const {
  addComment,
  removeComment,
  addReply,
  removeReply
} = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router
  .route('/:pizzaId')
  .post(addComment);

// /api/comments/<pizzaId>/<commentId>
// Remember that the callback function of a route method has req and res as parameters, so we don't have to
// explicitly pass any arguments to addReply.

// This is a PUT route, instead of a POST, because technically we're not creating a new reply resource. 
// Instead, we're just updating the existing comment resource
router
  .route('/:pizzaId/:commentId')
  .put(addReply)
  .delete(removeComment);

  router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;