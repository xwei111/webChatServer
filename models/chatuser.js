const mongoose = require('mongoose');
const mongoConnectDB = require('../mongodb/mongoConnect')

const Schema = mongoose.Schema;

const chatuserSchema = new Schema({
			user:{
				type: String,
			    required: true
			},
			pass: {
			    type: String,
			    required: true
			},
			img:{
				type: String,
			    required: true
			}
		},{
			timestamps: true,//在schema中设置timestamps为true，schema映射的文档document会自动添加createdAt和updatedAt这两个字段，代表创建时间和更新时间
		})

chatuserSchema.set('autoIndex', false);

const chatuser = mongoConnectDB.model('chatuser', chatuserSchema);


module.exports = chatuser;