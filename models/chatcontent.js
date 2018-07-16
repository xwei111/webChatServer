const mongoose = require('mongoose');
const mongoConnectDB = require('../mongodb/mongoConnect')

const Schema = mongoose.Schema;

const chatcontentSchema = new Schema({
			user:{
				type: String,
			    required: true
			},
			message: {
			    type: String
			},
			img:{
				type: String,
			    required: true
            },
            time:{
                type: String,
			    required: true
			},
			sendimg:{
				type: String,
			}
		},{
			timestamps: true,//在schema中设置timestamps为true，schema映射的文档document会自动添加createdAt和updatedAt这两个字段，代表创建时间和更新时间
		})

chatcontentSchema.set('autoIndex', false);

const chatcontent = mongoConnectDB.model('chatcontent', chatcontentSchema);


module.exports = chatcontent;