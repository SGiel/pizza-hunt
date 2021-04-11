const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema(
  {
    // set custom id to avoid confusion with parent comment's _id field
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String
    },
    writtenBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String
    },
    commentBody: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    // use ReplySchema to validate data for a reply
    replies: [ReplySchema]
  },
  // Tells the schema that it can use virtuals and getters.
  // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;