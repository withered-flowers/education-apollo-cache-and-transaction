const { ObjectId } = require("mongodb");
const { DB } = require("../config/db");

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Book {
	static async findAll() {
		return await DB.collection("books").find({}).toArray();
	}

	static async findByID(_id) {
		return await DB.collection("books").findOne({
			_id: new ObjectId(String(_id)),
		});
	}

	static async findByIDWithTx(_id, session) {
		return await DB.collection("books").findOne(
			{
				_id: new ObjectId(String(_id)),
			},
			{
				session,
			},
		);
	}

	static async create({ title, author }) {
		// kalian lakukan validasi
		//
		return await DB.collection("books").insertOne({
			title,
			author,
		});
	}

	static async updateById(_id, body) {
		return await DB.collection("books").updateOne(
			{
				_id: new ObjectId(String(_id)),
			},
			{
				$set: body,
			},
		);
	}

	static async updateByIdWithTx(_id, body, session) {
		return await DB.collection("books").updateOne(
			{
				_id: new ObjectId(String(_id)),
			},
			{
				$set: body,
			},
			{
				session,
			},
		);
	}
}

module.exports = Book;
