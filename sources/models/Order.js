const { ObjectId } = require("mongodb");
const { DB } = require("../config/db");

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class Order {
	static async findAll() {
		return await DB.collection("orders").find({}).toArray();
	}

	static async findByID(_id, session) {
		return await DB.collection("orders").findOne({
			_id: new ObjectId(String(_id)),
		});
	}

	// ? Ceritanya karena ini mengandung data sensitif, sekarang kita ingin menggunakan session
	static async findByIDWithTx(_id, session) {
		console.log(_id, "<--- ini id dari model");

		// ! Pada parameter kedua (options) pada find(One), kita akan menambahkan session
		const order = await DB.collection("orders").findOne(
			{
				_id: new ObjectId(String(_id)),
			},
			{
				session,
			},
		);
		console.log(order, "<---- order found");
		return order;
	}

	static async updateById(_id, body) {
		return await DB.collection("orders").updateOne(
			{
				_id: new ObjectId(String(_id)),
			},
			{
				$set: body,
			},
		);
	}

	static async updateByIdWithTx(_id, body, session) {
		return await DB.collection("orders").updateOne(
			{
				_id: new ObjectId(String(_id)),
			},
			{
				$set: body,
			},
			// ! Berbeda dengan Query yah !
			// ! Pada parameter ketiga (options) di update(One), kita akan menambahkan session
			{
				session,
			},
		);
	}
}

module.exports = Order;
