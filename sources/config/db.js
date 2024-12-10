const isNotProduction = process.env.NODE_ENV !== "production";

if (isNotProduction) {
	const dotenv = await import("dotenv");
	dotenv.config();
}

import { MongoClient } from "mongodb";
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

const DB = client.db("orderan-buku");

export { DB, client };
