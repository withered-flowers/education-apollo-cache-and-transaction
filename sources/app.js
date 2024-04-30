if (process.env !== "production") {
	require("dotenv").config();
}
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { typeDefs, resolvers } = require("./schema/bookSchema");

const {
	typeDefs: typeDefOrder,
	resolvers: resolverOrder,
} = require("./schema/orderSchema");

const server = new ApolloServer({
	typeDefs: [typeDefs, typeDefOrder],
	resolvers: [resolvers, resolverOrder],
	introspection: true,
});

(async () => {
	const result = await startStandaloneServer(server, {
		listen: { port: process.env.PORT || 4000 },
	});

	console.log("Sukses konek", result.url);
})();
