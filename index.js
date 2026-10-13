const express = require("express");
const app = express();
const cors = require("cors");

const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models")

const corsOptions = {
  origin: [
    "http://localhost:5173",
   "https://bi-1-1-hw-1-nu.vercel.app",
   "bi-1-2-hw-1-six.vercel.app"
],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

initializeDatabase();


// 1. Create an API with route "/books" to create a new book data in the books Database. Make sure to do error handling. Test your API with Postman. 
async function createBook(newBook) {
    try {
        const book = new Book(newBook);
        const saveBook = await book.save();
        return saveBook; 
        
    } catch (error) {
        throw error;
    }
}

app.post("/books", async(req, res) => {
    try {
        
        const savedBook = await createBook(req.body);
        res.status(200).json({message: "Book added successfully.", book:savedBook});
    } catch (error) {
        res.status(500).json({error: "Failed to add Book.", message: error.message })
    }
})

// 3. Create an API to get all the books in the database as response. Make sure to do error handling.
async function readAllBook() {
    try {

        const allBooks = await Book.find();
        return allBooks;
        
    } catch (error) {
        throw error
    }
}

app.get("/books", async(req, res) => {
    try {
        const books = await readAllBook();

        if(books.length != 0) {
            res.status(200).json({message: "Books fetched successfully.", data: books})
        } else {
            res.status(201).json({message: "No Book found."});
        }
        
    } catch (error) {
        res.status(500).json({message: "Error fetching Books", error: error.message})
    }
})

//4. Create an API to get a book's detail by its title. Make sure to do error handling.
async function readBookByTitle(title) {
    try {
        const bookByTitle = await Book.find({title:title});
        return bookByTitle;
        
    } catch (error) {
        throw error;
    }
}

app.get("/books/:bookTitle", async(req, res) => {
    try {
        const book = await readBookByTitle(req.params.bookTitle);

        if(book.length != 0) {
            res.status(200).json({message: "Book fetched successfully.", data: book});
        } else {
            res.status(201).json({message: "No Book found."});
        }
    } catch (error) {
        res.status(500).json({message: "Failed to fetch Book.", error: error.message})
    }
})

//5. Create an API to get details of all the books by an author. Make sure to do error handling.
async function readBookByAuthor(author) {
    try {
        const bookByAuthor = await Book.find({author : author});
        return bookByAuthor;
        
    } catch (error) {
        throw error;
    }
}

app.get("/books/author/:bookAuthor", async(req, res) => {
    try {
        const book = await readBookByAuthor(req.params.bookAuthor);
        if(book.length != 0) {
            res.status(200).json({message: "Book fetched successfully.", data: book})
        } else {
            res.status(201).json({message: "Book not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching Book.", error: error.message})
    }
})

//6. Create an API to get all the books which are of "Business" genre.
async function readBookByGenre(genre) {
    try {
        const bookByGenre = await Book.find({genre : genre});
        return bookByGenre;
    } catch (error) {
        throw error;
    }
}
app.get("/books/genre/:bookGenre", async(req, res) => {
    try {
        const book = await readBookByGenre(req.params.bookGenre);

        if(book.length != 0) {
            res.status(200).json({message: "Book fetched successfully.", data: book});
        } else{
            res.status(201).json({message: "Book not found."});
        }
        
    } catch (error) {
        res.status(500).json({message: "Error fetching Book.", error: error.message})
    }
})


// 7. Create an API to get all the books which was released in the year 2012.
async function readBookByPublishedYear(publishedYear) {
    try {

        const bookByPublishedYear = await Book.find({publishedYear : publishedYear});
        return bookByPublishedYear;
        
    } catch (error) {
        throw error
    }
}

app.get("/books/publishedYear/:publishedYear", async(req, res) => {
    try {
        const book = await readBookByPublishedYear(req.params.publishedYear);

        if(book.length != 0) {
            res.status(200).json({message: "Book fetched successfully.", data: book});
        } else {
            res.status(201).json({message: "Book not found."});
        }
        
    } catch (error) {
        res.status(500).json({message: "Error feching Book.", error: error.message})
    }
})

// 8. Create an API to update a book's rating with the help of its id. Update the rating of the "Lean In" from 4.1 to 4.5. 
async function updateBook(bookId, dataToUpdate) {
    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {new: true});
        return updatedBook
    } catch (error) {
        throw error;
    }
}

app.post("/books/ratings/:bookId", async(req,res) => {
    try {
        const updatedBook = await updateBook(req.params.bookId, req.body);

        if(updatedBook) {
            res.status(200).json({message: "Book updated successfully.", data: updatedBook});
        } else {
            res.status(201).json({error: "Book does not exist."});
        }
    } catch (error) {
        res.status(500).json({message: "Error to update Book.", error: error.message});
    }
})

// 9. Create an API to update a book's rating with the help of its title. Update the details of the book "Shoe Dog".
async function updateBookByTitle(bookTitle, dataToUpdate) {
    try {

        const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate, {new:true});
        return updatedBook;
        
    } catch (error) {
        throw error;
    }
}

app.post("/books/ratings/publishedYear/:bookTitle", async(req, res) => {

    try {
        const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);

        if(updatedBook) {
            res.status(200).json({message: "Book updated successfully.", data: updatedBook})
        } else {
            res.status(201).json({message: "Book does not exist."});
        }
        
    } catch (error) {
        res.status(500).json({message: "Failed to update Book.", error: error.message})
    }
})

// 10. Create an API to delete a book with the help of a book id, Send an error message "Book not found" in case the book does not exist. Make sure to do error handling.
async function deleteBook(bookId) {
    try {
        const deleteBook = await Book.findByIdAndDelete(bookId);
        return deleteBook;
    } catch (error) {
        throw error;
    }
}

app.delete("/books/bookTitle/:bookId", async(req, res) => {
    try {
        const deletedBook = await deleteBook(req.params.bookId);

        if(deletedBook) {
            res.status(200).json({message: "Book deleted successfully.", data: deletedBook});
        } else{
            res.status(201).json({message: "Book not found."});
        }
        
    } catch (error) {
        res.status(500).json({message: "Failed to delete Book.", error: error.message})
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
})