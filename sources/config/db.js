const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

const DB = client.db("sample_mongodb");

module.exports = {
	DB,
	client,
};
