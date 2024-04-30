const MOVIES = [
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

// skema / blueprint / kontrak / janji
const typeDefs = `#graphql
  # SINGULAR + PascalCase
  type Movie {
    id: ID
    title: String
    author: String
  }

  input NewMovie {
    title: String
    author: String
  }

  # Di phase sebelumnya kalian bikin endpoint
  # router.get("/Movies", Controller.getMovies)

  # Type Query khusus untuk GET aja
  type Query {
    # router.get("/Movies",
    Movies: [Movie]
    # router.get("/Movie/:id",
    Movie(id: ID!): Movie
  }
  
  # Type Mutation buat selain GET (PATCH, POST , PUT , DELETE)
  type Mutation {
    # router.post("/addMovie",
    addMovie(newMovie: NewMovie): Movie
  }
`;

// Controller.getMovies
const resolvers = {
	Query: {
		Movies: () => {
			// lakukanlah proses untuk mengambil datanya dengan memanggil model
			return MOVIES;
		},
		Movie: (_, args) => {
			// args.id
			return MOVIES.find((Movie) => {
				return Movie.id === args.id;
			});
		},
	},
	Mutation: {
		addMovie: (_, args) => {
			console.log(args, "<---");
			const Movie = {
				...args.newMovie,
				id: MOVIES.length + 1,
			};
			MOVIES.push(Movie);
			return Movie;
		},
	},
};

module.exports = {
	typeDefs,
	resolvers,
};
