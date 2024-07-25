const mongoose = require("mongoose");
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookschema = new mongoose.Schema({
  book_title: {
    type: String,
    required: true,
  },
  commentcount: {
    type: Number,
    default: 0,
  },
  comments: [String],
});

const Book = mongoose.model("Book", bookschema);

module.exports = Book;
