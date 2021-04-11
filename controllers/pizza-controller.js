const { Pizza } = require('../models');

const pizzaController = {
  // get all pizzas
  // will serve as the callback function for the GET /api/pizzas route
  getAllPizza(req, res) {
    // Telling Mongoose that we don't care about the __v field on pizza or comments. The minus sign - in front of the 
    // field for comments indicates that we don't want it to be returned. If we didn't have it, it would mean that
    // it would return only the __v field. For pizza it just adds unnecesary noise
    Pizza.find({})
      .populate({
        path: 'comments',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id -- instead of accessing entire req, destructured params out of it
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: 'comments',
        select: '-__v'
      })
      .select('-__v')
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createPizza
  // we destructured the body out of the Express.js req object because we 
  // don't need to interface with any of the other data it provides
  createPizza({ body }, res) {
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
  },

  // update pizza by id
  // if we don't set that third parameter, { new: true }, it will return the original document. 
  updatePizza({ params, body }, res) {
    // By setting the parameter new to true, we're instructing Mongoose to return the new version of the document.
    // update pizza by id
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },
  // delete pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }
}

module.exports = pizzaController;

// In MongoDB, the methods for adding data to a collection are .insertOne() or .insertMany(). 
// But in Mongoose, we use the .create() method, which will actually handle either one or multiple inserts!
// There are also Mongoose and MongoDB methods called .updateOne() and .updateMany(), which update documents without returning them.