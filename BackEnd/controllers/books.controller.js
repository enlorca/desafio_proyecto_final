const BookService = require('../services/book.service');
const GenreService = require('../services/genre.service');
const BookGenreService = require('../services/bookGenre.service');
const AuthorService = require('../services/author.service');
const BookAuthorService = require('../services/bookAuthor.service');
const OrderItemsService = require('../services/orderItems.service');
const RatingService = require('../services/rating.service');
const boom = require('@hapi/boom');

const service = new BookService();
const genreService = new GenreService();
const bookGenreService = new BookGenreService();
const authorService = new AuthorService();
const bookAuthorService = new BookAuthorService();
const orderItemsService = new OrderItemsService();
const ratingService = new RatingService();

/**
 * Crea un nuevo libro
 */
const createBook = async (req, res, next) => {
  try {
    const body = req.body;
    let bookGenre,
      bookAuthor,
      newGenre,
      newAuthor = [];
    const existBook = await service.findOneByName(body.title);
    if (existBook) {
      throw boom.conflict('Libro ya existe'); 
    }
    const newBook = await service.create(body);
    const genre = await genreService.findOneByName(body.genre);
    
    if (genre != null) {
      bookGenre = await bookGenreService.create({
        book_id: newBook.book_id,
        genre_id: genre.genre_id,
      });
    } else {
      newGenre = await genreService.createByName(body.genre);
      bookGenre = await bookGenreService.create({
        book_id: newBook.book_id,
        genre_id: newGenre.genre_id,
      });
    }
    const author = await authorService.findOneByName(body.author);
    if (author != null) {
      bookAuthor = await bookAuthorService.create({
        book_id: newBook.book_id,
        author_id: author.author_id,
      });
    } else {
      const newAuthor = await authorService.create({
        name: body.author,
      });
      bookAuthor = await bookAuthorService.create({
        book_id: newBook.book_id,
        author_id: newAuthor.author_id,
      });
    }
    res.status(201).json({
      status: true,
      message: 'Libro agregado',
      data: {
        book: newBook,
        genre: genre != null ? genre : newGenre,
        author: author != null ? author : newAuthor,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Obtiene un libro por su id con sus generos y autores
 */
const getBook = async (req, res, next) => {
  try {

    const { book_id } = req.params;
    const { user_id } = req.params;
    
    let wishlist = null;
    let comments = null;
    const book = await service.findOne(book_id);
    const bookGenre = await bookGenreService.findOneByBook(book.book_id);
    if (bookGenre) {
      genre = await genreService.findOne(bookGenre.genre_id);
    }
    const bookAuthor = await bookAuthorService.findOneByBook(book.book_id);
    if (bookAuthor) {
      author = await authorService.findOne(bookAuthor.author_id);
    }
    if (user_id!=0) {
      wishlist = await ratingService.getWishlistByBook_User(book_id, user_id);
    }
    comments = await ratingService.getCommentsByBook(book_id);

    res.status(200).json({
      status: true,
      message: 'Libro encontrado',
      data: {
        book,
        genre: genre ?? null,
        author: author ?? null,
        wishlist,
        comments
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Actualiza un libro
 */
const updateBook = async (req, res, next) => {
  console.log('Actualizando libro...');
  try {
    const { book_id } = req.params;
    const body = req.body;
    const existBook = await service.findOne(book_id);
    if (!existBook) {
      throw boom.notFound('Libro no encontrado');
    }
    const book = await service.updateBook(book_id, body);
    if (book == null) {
      throw boom.notFound('Libro no encontrado');
    }
    const bookGenre = await bookGenreService.updateByGenreBook(
      book_id,
      body.genre_id
    );
    const genre = await genreService.findOne(body.genre_id);
    if (!genre) {
      throw boom.notFound('Genero no encontrado');
    }
    const bookAuthor = await bookAuthorService.updateByAuthorBook(
      book_id,
      body.author_id
    );
    const author = await authorService.findOne(body.author_id);
    if (!author) {
      throw boom.notFound('Autor no encontrado');
    }

    res.status(200).json({
      status: true,
      message: 'Libro actualizado correctamente',
      data: {
        book,
        genre,
        author,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Realiza eliminacion de un libro logico
 */
const deleteBook = async (req, res, next) => {
  try {
    const { book_id } = req.params;
    const existBook = await service.findOne(book_id);
    if (!existBook) {
      throw boom.notFound('Book not found');
    }
    const book = await service.updateDeleted(book_id);
    if (!book) {
      throw boom.notFound('Book not found');
    }
    const bookGenre = await bookGenreService.updateDeletedByBook(book.book_id);
    const bookAuthor = await bookAuthorService.updateDeletedByBook(
      book.book_id
    );

    res.status(200).json({
      status: true,
      message: 'Book deleted',
      data: {
        book,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

/* Obtiene todos los libros activos */
const getBooksMoreSold = async (req, res, next) => {
  try {
    const books = await service.getAllMoreSold();
    if (!books || books.length == 0) {
      throw boom.notFound('Books not found');
    }
    res.status(200).json({
      status: true,
      message: 'Libros más vendidos encontrados',
      data: {
        books,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Obtiene todas las editoriales
 */
const findAllPublishers = async (req, res, next) => {
  try {
    const publishes = await service.findAllPublishers();
    res.status(200).json({
      status: true,
      message: 'Editoriales encontradas',
      data: {
        publishes,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

/**
 * Obtiene todos los libros por editorial
 */
const getAllByPublisher = async (req, res, next) => {
  //console.log('Obteniendo libros por editorial...');
  try {
    const { publisher } = req.body;
    let books = [];
    if (publisher == '') {
      books = await service.getAllActive();
    } else books = await service.getAllByPublisher(publisher);
    res.status(200).json({
      status: true,
      message: 'Libros encontrados para la editorial',
      data: {
        books,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const getNews = async (req, res, next) => {
  try {
    const books = await service.getNewBooks();
    res.status(200).json({
      status: true,
      message: 'Libros encontrados',
      data: {
        books,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const getBooksActive = async (req, res, next) => {
  try {
    const books = await service.getAllActive();
    res.status(200).json({
      status: true,
      message: 'Libros encontrados',
      data: {
        books,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const getBooks = async (req, res, next) => {
  try {
    const books = await service.getAll();
    res.status(200).json({
      status: true,
      message: 'Libros encontrados',
      data: {
        books,
      },
    });
  } catch (error) {
    console.log(error);
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

const getWishlistBooks = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const wishlistBooks = await ratingService.getWishlistBooksByUser(user_id);

    if (wishlistBooks === false) {
      return res.status(200).json({
        status: true,
        message: 'No hay libros en la lista de deseos para este usuario',
        data: {
          wishlistBooks: [],
        },
      });
    }

    let detailedBooks = [];

    for (const wishlistBook of wishlistBooks) {
      const book = await service.findOne(wishlistBook.book_id);
      if (book) {
        detailedBooks.push(book);
      }
    }

    // Send the response
    res.status(200).json({
      status: true,
      message: 'Libros de Wishlist obtenidos exitosamente',
      data: {
        wishlistBooks: detailedBooks,
      },
    });
  } catch (error) {
    let codeError = error.isBoom ? error.output.statusCode : 500;
    res.status(codeError).json({
      status: false,
      message: error.message,
      data: null,
    });
  }
};

module.exports = {
  getBook,
  createBook,
  deleteBook,
  updateBook,
  findAllPublishers,
  getAllByPublisher,
  getNews,
  getBooksActive,
  getBooksMoreSold,
  getBooks,
  getWishlistBooks,
};
