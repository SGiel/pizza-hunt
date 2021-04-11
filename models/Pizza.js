const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// Schema constructor imported from Mongoose
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: 'You need to provide a pizza name!',
      trim: true
    },
    createdBy: {
      type: String,
      required: 'You need to provide a your name!',
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    toppings: [],
    // The ref property tells the Pizza model which documents to search to find the right comments.
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
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
// MDN Web Docs: syntaxon reduce: arr.reduce(callback( accumulator, currentValue, [, index[, array]] )[, initialValue])
// const array1 = [1, 2, 3, 4];
// const reducer = (accumulator, currentValue) => accumulator + currentValue;
// // 1 + 2 + 3 + 4
// console.log(array1.reduce(reducer));
// //expected output: 10

// Module 18: Here we're using the .reduce() method to tally up the total of every comment with its replies. In its basic form, 
// .reduce() takes two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the 
// currentValue is comment. As .reduce() walks through the array, it passes the accumulating total and the current 
// value of comment into the function, with the return of the function revising the total for the next iteration
// through the array.
PizzaSchema.virtual('commentCount').get(function () {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;