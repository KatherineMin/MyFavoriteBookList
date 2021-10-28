// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// const { title } = require('process');
const books = require('../models/books');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  res.render('books/details', { 
    title: 'Books',
    books: new book()})                                                                                                               
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', async (req, res, next) => {
  const item = new book({
    title: req.body.title, 
    price: req.body.price, 
    author: req.body.author, 
    genre: req.body.genre
  })
  try {
    const newBook = await item.save()
    res.redirect('/books')
  } catch {
    res.render('books/add', {
      books : item
    })
  }
  // book.save((err, newBook) => {
  //   if (err) {
  //     res.render('books/add', {
  //       book : item,
  //       errorMessage: "Error creating Book"
  //     })
  //   } else {
  //     res.redirect('/books')
  //   }
  // })
});


// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  let id = ObjectID(req.params.id)

  book.findById(id, (err, newBook) => {
    if (err) {
      return console.error(err);
    } else {
      res.render('books/details', {
        title: 'Books',
        books: newBook
      })
    }
  })
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => { // put
  let id = ObjectID(req.params.id)
  let newBook = new book({
    title: req.body.title, 
    price: req.body.price, 
    author: req.body.author, 
    genre: req.body.genre
  })

  book.updateOne({_id: id}, newBook, (err) => {
    if(err) {
      console.log(err)
      res.end(err)
    } else {
      res.redirect('/books')
    }
  })
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  let id = ObjectID(req.params.id)

  book.remove({_id: id}, (err) => {
    if(err) {
      console.log(err)
      res.end(err)
    } else {
      res.redirect('/books')
    }
  })
});


module.exports = router;
