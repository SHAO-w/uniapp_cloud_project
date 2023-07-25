<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		<u-upload accept="image" class="upload" :fileList="imgList" @afterRead="afterReadImg" @delete="deleteImg"
			name="imgUp" multiple width="100%" :maxCount="9">
			<u-button type="primary" text="上传"></u-button>
		</u-upload>
		<u-modal :show="modal.show" @confirm="deleteConfirm" @cancel="modal.show = false" :showCancelButton="true">
			<view class="slot-content">
				<text>是否确认</text>
				<text>移除</text>
			</view>
		</u-modal>
	</view>
</template>

<script>
	const swiperImg = uniCloud.importObject('swiperImg')
	export default {
		data() {
			return {
				imgList: [],
				videoList: [],
				form: {
					title: ''
				},
				rules: {
					'title': {
						type: 'string',
						required: true,
						message: '请填写图片文字',
						trigger: ['blur', 'change']
					},
				},
				// 提示框数据
				modal: {
					show: false,
				},
				eventObj: {} // 删除图片的数据
			}
		},
		methods: {
			async afterReadImg(event) {
				console.log(event.file)
				let fileListLen = this.imgList.length
				event.file.map(item => {
					this.imgList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < event.file.length; i++) {
					const result = await this.uploadFilePromise(event.file[i].url, event.file[i].name)
					let item = this.imgList[fileListLen] || {}
					if (result.fileID) {
						this.imgList.splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '上传成功',
							url: result.fileID
						}))
						fileListLen++
					} else {
						this.imgList.splice(fileListLen, 1)
					}

				}
				console.log(this.imgList)
			},
			uploadFilePromise(url, filename) {
				return new Promise((resolve, reject) => {
					let that = this
					let a = uniCloud.uploadFile({
						filePath: url,
						cloudPath: filename,
						onUploadProgress: function(progressEvent) {
							console.log(progressEvent);
							let percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
						},
						success: (res) => {
							console.log(res)
							that.$refs.uToast.show({
								type: 'success',
								message: '上传成功',
							})
							setTimeout(() => {
								resolve(res)
							}, 1000)
							this.setImg(res, filename)
						}
					});
				})
			},
			async setImg(res, filename) {
				let data = await swiperImg.set({
					'img_path': res.fileID,
					'img_name': filename,
					'user_id': uniCloud.getCurrentUserInfo().uid
				})
				console.log(data)
			},
			async getImg() {
				const swiperI = await swiperImg.get()
				console.log(swiperI)
				if (swiperI.data.data) {
					this.imgList = swiperI.data.data
					this.imgList.forEach(el => {
						el.url = el.img_path
					})
				}
			},
			deleteImg(event) {
				this.modal.show = true;
				this.eventObj = event
				console.log(this.eventObj)
			},
			deleteConfirm() {

				this.deletSwiperImg(this.eventObj.file._id)
			},
			async deletSwiperImg(id) {
				let res = await swiperImg.delete({
					id
				})
				console.log(res)
				if (res.deleted) {
					this.imgList.splice(this.eventObj.index, 1)
					this.modal.show = false;
					this.$refs.uToast.show({
						type: 'success',
						message: '删除成功'
					})
				}

			}
		},
		mounted() {
			this.getImg()
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.upload {
		.u-upload__wrap {
			flex-direction: column !important;
			flex-wrap: nowrap !important;
		}

		.u-upload__wrap__preview {
			margin: 0 0 14px 0;
		}
	}
</style>
