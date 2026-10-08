const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    genre: [{
        type: String,
        enum: ["Fiction", "Business", "Historical", "Romance", "Autobiography", "Fantasy", "Mystery", "Thriller", "Non-Fiction", "Self-help",], 
    },],
    language: String,
    country: String,
    rating: Number,
    summary: String,
    coverImageUrl: String,
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;