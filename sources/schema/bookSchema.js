const redis = require("../config/redis");
const Book = require("../models/Book");

const DATA_BOOKS = [
	{
		id: 1,
		title: "Harpot",
		author: "JK Rowling",
	},
	{
		id: 2,
		title: "Lord of the ring",
		author: "lupa",
	},
];

const typeDefs = `#graphql
  # SINGULAR + PascalCase
  type Book {
    _id: ID
    title: String
    author: String
    price: Int
  }

  input NewBook {
    title: String
    author: String
  }

  # Di phase sebelumnya kalian bikin endpoint
  # router.get("/books", Controller.getBooks)

  # Type Query khusus untuk GET aja
  type Query {
    # router.get("/books",
    books: [Book]
    book(_id: ID!): Book
  }
  
  # Type Mutation buat selain GET (PATCH, POST , PUT , DELETE)
  type Mutation {
    # router.post("/addBook",
    addBook(newBook: NewBook): Book
  }
`;

// Controller.getBooks
const resolvers = {
	Query: {
		books: async () => {
			// lakukanlah proses untuk mengambil datanya dengan memanggil model
			// 1. Kita cek di redis apakah ada cache buku?
			// 2.    Kalo ada cache -> balikin data dari cache
			// 3. Kalo cache masih kosong kita perlu ambil dari mongoDB
			// 4. Dapat dari mongodb -> save redis
			const booksCache = await redis.get("books");

			if (booksCache) {
				return JSON.parse(booksCache);
			}

			const result = await Book.findAll();
			await redis.set("books", JSON.stringify(result));
			return result;
		},
		book: async (_, args) => {
			const result = await Book.findByID(args._id);
			console.log(result);
			return result;
		},
	},
	Mutation: {
		addBook: async (_, args) => {
			console.log(args, "<---");
			const book = {
				...args.newBook,
			};
			const result = await Book.create(book);
			await redis.del("books");
			const response = await Book.findByID(result.insertedId);
			return response;
		},
	},
};

module.exports = {
	typeDefs,
	resolvers,
};
