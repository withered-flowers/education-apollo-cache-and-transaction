import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers, typeDefs } from "./schema/bookSchema.js";

import {
	resolvers as resolverOrder,
	typeDefs as typeDefOrder,
} from "./schema/orderSchema.js";

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
