/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

module.exports = function (app) {
  const Book = require("../models/book");

  app
    .route("/api/books")
    .get(function (req, res) {
      // response will be array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({})
        .then((data) => {
          // Map over the array of documents and create a new array with the desired properties
          const books = data.map((book) => ({
            _id: book._id,
            title: book.book_title,
            commentcount: book.commentcount,
          }));
          res.json(books);
        })
        .catch((err) => {
          console.log(err);
        });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send("missing required field title");
        return;
      }

      let book = new Book({
        book_title: title,
        commentcount: 0,
      });

      book
        .save()
        .then((data) => {
          res.json({
            _id: data._id,
            title: data.book_title,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}).then((data) => {
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid)
        .then((data) => {
          if (!data) {
            res.send("no book exists");
            return;
          }
          res.json({
            _id: data._id,
            title: data.book_title,
            comments: data.comments,
          });
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      try {
        let data = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment } },
          { new: true },
        );
        if (!data) {
          res.send("no book exists");
          return;
        }
        res.json({
          _id: data._id,
          title: data.book_title,
          comments: data.comments,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update book" });
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      Book.findByIdAndDelete(bookid)
        .then((data) => {
          if (!data) {
            res.send("no book exists");
            return;
          }
          res.send("delete successful");
        })
        .catch((err) => {
          console.log(err);
        });
    });
};
