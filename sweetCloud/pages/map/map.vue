<template>
	<view class="relative">
		<map v-if="!isWindow" id="map" style="width: 750rpx; height: calc(100vh - 50px);" :latitude="latitude"
			:scale="scale" :longitude="longitude" :markers="covers" :polyline="polyline" :show-location="true"
			:include-points="includePoint" :enable-traffic="true" :enable-overlooking="true"></map>
		<map v-else id="map" style="width: 750rpx;height: 100vh;" :latitude="latitude" :scale="scale"
			:longitude="longitude" :markers="covers" :polyline="polyline" :show-location="true"
			:include-points="includePoint"></map>
		<cover-view class="absolute map-search">
			<cover-view class="map-icon">
				<cover-view class="padding10 map-icon-item">
					<u-icon name="plus" size="22" @touchstart.native="upScale"></u-icon>
				</cover-view>
				<cover-view class="padding10 map-icon-item">
					<u-icon name="minus" size="22" @touchstart.native="downScale"></u-icon>
				</cover-view>
				<cover-view class="padding10 map-icon-item">
					<u-icon name="map" size="22" @touchstart.native="goBackToLocation"></u-icon>
				</cover-view>
			</cover-view>
			<cover-view class="map-search-c">
				<u-button text="选择目的地" @click="chooseMap"></u-button>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchVal: '',
				isWindow: false,
				latitude: 30.182, // 纬度
				title: 'maps',
				longitude: 120.159, // 经度
				id: 0,
				scale: 16, // 默认缩放
				includePoint: [],
				covers: [
					// {
					// 	latitude: 30.175,
					// 	longitude: 120.156,
					// 	iconPath: require('../../static/location.png')
					// },
				],
				polyline: []
			}
		},

		methods: {
			chooseMap() {
				let that = this
				uni.chooseLocation({
					success(res) {
						that.includePoint = [that.includePoint[0]]
						that.includePoint.push({
							latitude: res.latitude,
							longitude: res.longitude
						})
						that.covers = []
						that.covers.push({
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: require('../../static/location.png')
						})
						that.$jsonp(
							'https://apis.map.qq.com/ws/direction/v1/walking', {
								from: `${that.includePoint[0].latitude},${that.includePoint[0].longitude}`,
								to: `${that.includePoint[1].latitude},${that.includePoint[1].longitude}`,
								key: 'LZFBZ-RV7LF-VUPJW-NOJRP-GUHAH-7OBGP',
								output: 'jsonp'
							}
						).then(res => {
							console.log(res)
							that.polyline = []
							let points = []
							// 存储每一条的路线规划图
							res.result.routes.forEach((item, inx) => {
								// 重组每条规划图的点数据
								// 先解压
								for (let i = 2; i < item.polyline.length; i++) {
									item.polyline[i] = item.polyline[i - 2] + item.polyline[i] /
										1000000
								}
								console.log(item.polyline)
								item.polyline.forEach((el, i) => {
									i++
									if (i % 2 === 0) {
										points[i / 2 - 1].longitude = el
									} else {
										if (!points[parseInt(i / 2)]) {
											points[parseInt(i / 2)] = {}
										}
										points[parseInt(i / 2)].latitude = el
									}

								})
								console.log(points)
								that.polyline[inx] = {
									points,
									color: '#0091ea',
									width: 6,
									arrowLine: true
								}
							})
							// that.polyline = [
							// 	{
							// 		points: [{
							// 			latitude: 30.179,
							// 			longitude: 120.148
							// 		}, {
							// 			latitude: 30.175,
							// 			longitude: 120.156
							// 		}],

							// 	}
							// ]
						})
						// console.log(that.includePoint)
					}
				})
			},
			goBackToLocation() {
				this.getLocation()
				// uni.createMapContext('map').moveToLocation({latitude: 30.182,longitude: 120.159})
				this.scale = 16
			},
			upScale() {
				if (this.scale < 18) {
					this.scale++
				}

			},
			downScale() {
				if (this.scale > 3) {
					this.scale--
				}

			},
			getLocation(flag) {
				let that = this
				uni.getLocation({
					type: 'gcj02',
					geocode: true, // 解析地址信息
					isHighAccuracy: true,
					success(res) {
						that.latitude = res.latitude
						that.longitude = res.longitude
						// that.covers = [{
						// 	latitude: that.latitude,
						// 	longitude: that.longitude,
						// 	iconPath: require('../../static/location.png')
						// }]
						console.log(res, that.covers)
						if (!flag) {
							uni.createMapContext('map').moveToLocation({
								latitude: that.latitude,
								longitude: that.longitude
							})
							that.includePoint = [{
								latitude: that.latitude,
								longitude: that.longitude
							}]
						} else {
							uni.openLocation({
								latitude: that.latitude,
								longitude: that.longitude
							})
						}


					}
				})
			}
		},
		mounted() {
			if (window) {
				this.isWindow = true
			}
			this.getLocation()
		}
	}
</script>

<style lang="scss" scoped>
	.map-search {
		text-align: right;
		left: 20rpx;
		right: 20rpx;
		bottom: 50rpx;
	}

	.map-search-c {
		background-color: #fff;
	}

	.map-icon {
		display: inline-flex;
		flex-direction: column;
	}

	.map-icon-item {
		display: inline-flex;
		background-color: #fff;
		margin-bottom: 10px;
	}
</style>
