// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniIdCommon = require('uni-id-common')
const db = uniCloud.database()
// let userInfo = uniCloud.getCurrentUserInfo()
module.exports = {
	_before: function() { // 通用预处理器
		this.uniIdCommon = uniIdCommon.createInstance({
			clientInfo: this.getClientInfo()
		})

	},
	async get() {
		// 业务逻辑
		let swiperImgData = {}
		swiperImgData = await db.collection('swiper-img').get()
		// 返回结果
		return {
			data: swiperImgData //请根据实际需要返回值
		}
	},
	async set(param) {
		const {
			errCode,
			errMsg,
			uid
		} = await this.uniIdCommon.checkToken(this.getUniIdToken())
		if (errCode) { // uni-id-common的checkToken接口可能返回`uni-id-token-expired`、`uni-id-check-token-failed`错误码，二者均会触发客户端跳转登陆页面
			return {
				errCode,
				errMsg
			}
		}
		// 参数校验，如无参数则不需要
		if (!param) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		let res = await db.collection('swiper-img').add({
			'img_path': param.img_path,
			'img_name': param.img_name,
			'user_id': param.user_id,
			'create_date': new Date().valueOf()
		})
		// 返回结果
		return {
			data: param //请根据实际需要返回值
		}
	},
	async delete(param) {
		// 参数校验，如无参数则不需要
		if (!param) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		let res = await db.collection('swiper-img').where({
			'_id': param.id
		}).remove()
		// 返回结果
		return res
	}
}
