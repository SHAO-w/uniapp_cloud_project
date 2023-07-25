<template>
	<view class="container">
		<view>
			<u-notice-bar :text="notice"></u-notice-bar>
		</view>
		<view class="margin10_t">
			<u-search :show-action="true" actionText="搜索" :animation="true"></u-search>
		</view>
		<view class="margin10_t">
			<u-swiper :list="imgList" @click="setSwiperItem"></u-swiper>
		</view>
		<view class="margin10_t">
			<u-grid :border="false" col="4">
				<u-grid-item v-for="(listItem,listIndex) in iconlist" :key="listIndex" @click="iconClick(listItem)">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="listItem.name" :size="22"></u-icon>
					<text class="grid-text">{{listItem.title}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" />
			<u-overlay :show="overlay.show" @click="overlay.show = false" :opacity="1">
				<view class="flex_center">
					<u--image :showLoading="true" :src="overlay.imgCur" :duration="100"></u--image>
				</view>
			</u-overlay>
		</view>
	</view>
</template>

<script>
	const swiperImg = uniCloud.importObject('swiperImg')
	export default {
		data() {
			return {
				iconlist: [{
						name: 'photo',
						title: '导航'
					},
					{
						name: 'lock',
						title: '个人中心'
					},
					{
						name: 'star',
						title: '朋友圈',
						path: '/pages/set/pyq'
					},
					{
						name: 'hourglass',
						title: '日记'
					},
					{
						name: 'home',
						title: '画廊',
						path: '/pages/set/three/index'
					},
					{
						name: 'star',
						title: '音乐',
						path: '/pages/set/music/index'
					},
					{
						name: 'setting',
						title: '设置',
						path: '/pages/set/set'
					}
				],
				imgList: [

				],
				notice: '加油加油！',
				overlay: {
					show: false,
					imgCur: ''
				}
			}
		},
		methods: {
			// 点击轮播图
			setSwiperItem(inx) {
				this.overlay.show = true;
				this.overlay.imgCur = this.imgList[inx];
			},
			iconClick(item) {
				this.$refs.uToast.success(`点击了${item.path || item.name}`)
				uni.navigateTo({
					url: item.path
				})
			},
			async getImg(){
				const swiperI = await swiperImg.get()
				console.log(swiperI)
				if(swiperI.data.data) {
					this.imgList = swiperI.data.data
					this.imgList.forEach(el => {
						el.url = el.img_path
					})
				}
			},
			
		},
		onLoad() {
			this.getImg()
			
			// console.log(uniCloud.getCurrentUserInfo())
			
		}
	}
</script>

<style>

</style>
