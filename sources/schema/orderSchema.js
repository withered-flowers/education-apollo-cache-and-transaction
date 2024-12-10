import { GraphQLError } from "graphql";
import { client } from "../config/db.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";

const typeDefs = `#graphql
  type Order {
    _id: ID!
    orderDate: String!
    bookId: ID!
    status: String!
    qty: Int!
    paidDate: String!
  }

  type SuccessResponse {
    message: String
  }

  type Mutation {
    payOrder(_id: ID!): SuccessResponse
  }
`;

const resolvers = {
	Mutation: {
		payOrder: async (_, args) => {
			// ? Ambil dulu sessionnya !
			const session = client.startSession();

			// ? Option untuk transaction (Bila tidak ada, maka akan menggunakan default options)
			const transactionOptions = {};

			try {
				const { _id } = args;
				console.log("==================================== id nya");
				console.log(_id);
				console.log("====================================");

				// ? Gunakan si session untuk menjalankan "runtutan perintah / query"
				// ? dengan menggunakan "withTransaction(fnCallback)"
				await session.withTransaction(
					// ? Menerima handler (fnCallback), biasanya async
					async () => {
						// const order = await DB.collection("orders").findOne(
						//   {
						//     _id: new ObjectId(String(_id)),
						//   },
						//   {
						//     session,
						//   },
						// );

						// ? Refactor kode di atas agar lebih "modular"
						const order = await Order.findByIDWithTx(_id, session);

						if (!order) {
							throw new GraphQLError("Order does not exist", {
								extensions: {
									code: "BAD_REQUEST",
								},
							});
						}

						// ? Ceritanya bila status adalah paid, artinya sudah dibayarkan
						// ? Jadi tidak perlu dibayar lagi, sehingga akan terjadi error
						if (order.status === "paid") {
							throw new GraphQLError("Order already paid", {
								extensions: {
									code: "BAD_REQUEST",
								},
							});
						}

						const book = await Book.findByIDWithTx(order.bookId, session);
						if (!book) {
							throw new GraphQLError("Book does not exist", {
								extensions: {
									code: "BAD_REQUEST",
								},
							});
						}

						if (book.stock < order.qty) {
							throw new GraphQLError("unsufficient book stock", {
								extensions: {
									code: "BAD_REQUEST",
								},
							});
						}

						const data = await Order.updateByIdWithTx(
							_id,
							{
								status: "paid",
								paidDate: new Date(),
							},
							session,
						);

						const updateBook = await Book.updateByIdWithTx(
							order.bookId,
							{
								stock: book.stock - order.qty,
							},
							session,
						);
					},
					transactionOptions,
				);

				return {
					message: "Pembayaran berhasil",
				};
			} catch (error) {
				// biome-ignore lint/complexity/noUselessCatch: <explanation>
				throw error;
			} finally {
				await session.endSession();
			}
		},
	},
};

export { typeDefs, resolvers };
