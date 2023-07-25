<template>
	<div ref="pyq">
		<u-navbar class="navbar" :title="scrolled ? '朋友圈':''" :autoBack="true" bgColor="#F8F8F8"
			:style="{'opacity': opacity}" :class="scrolled ? '':'transparent_pyq'"
			rightIcon="scrolled ? 'camera': 'camera-fill'">
			<view slot="right">
				<u-icon :name="scrolled ? 'camera': 'camera-fill'" size="20"></u-icon>
			</view>
		</u-navbar>
		<image src='https://cdn.uviewui.com/uview/album/10.jpg' style="width: 100%;" :height="fadeImgHeight*2 + 'rpx'"
			mode=""></image>
		<view class="container relative">
			<view class="user_img">
				<view class="margin10_r">
					蔚
				</view>
				<u--image src="/static/hh.jpg" radius="10" :fade="false" width="140rpx" height="140rpx"></u--image>
			</view>

			<view class="album" v-for="(item,inx) in list" :key="inx">
				<view class="album__avatar">
					<image src="../../static/pd.jpg" mode="" style="width: 64rpx;height: 64rpx;"></image>
				</view>
				<view class="album__content">
					<u--text :text="'胖达'+item" type="primary" bold size="17"></u--text>
					<u--text margin="0 0 16rpx 0" text="拥有梅州飞机场的超级富婆,瓜皮不露脸网友!"></u--text>
					<u-album :urls="urls2"></u-album>
				</view>
			</view>
		</view>

		<view v-if="loading" style="background-color: #fff; padding:0rpx 0rpx 30rpx 0rpx">
			<u-loading-icon text="加载中..."></u-loading-icon>
		</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				opacity: 1,
				fadeImgHeight: 240,
				loading: false,
				list: [0, 1, 2, 3],
				albumWidth: 0,
				urls2: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg',
					'https://cdn.uviewui.com/uview/album/6.jpg',
					'https://cdn.uviewui.com/uview/album/7.jpg',
					'https://cdn.uviewui.com/uview/album/8.jpg',
					'https://cdn.uviewui.com/uview/album/9.jpg',
					'https://cdn.uviewui.com/uview/album/10.jpg',
				],
				scrolled: false
			}
		},
		onPageScroll(e) {
			if (this.fadeImgHeight - 32 <= e.scrollTop) {
				this.opacity = 0
			} else {
				this.opacity = 1.2 - e.scrollTop / this.fadeImgHeight;
				this.opacity = this.opacity > 0 ? this.opacity : 0

			}
			this.setNavBarBg(e.scrollTop)
		},
		onPullDownRefresh() {
			console.log('下拉刷新')
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		onReachBottom() {
			console.log('下拉底部')
			let that = this
			if (that.list.length !== 10) {
				that.loading = true
				setTimeout(() => {
					that.loading = false
					that.list.push(that.list.length)
				}, 1500)
			}

		},
		mounted() {
			// uni.startPullDownRefresh()
		},
		methods: {
			setNavBarBg(scrollTop) {
				if (scrollTop >= this.fadeImgHeight - 32) {
					this.scrolled = true
					this.opacity = (scrollTop - this.fadeImgHeight + 32) / 20
					this.opacity = this.opacity > 1 ? 1 : this.opacity
				} else {
					this.scrolled = false
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.h44 {
		height: 88rpx;
	}

	.user_img {
		position: absolute;
		right: 40rpx;
		top: -120rpx;
		display: flex;
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		align-items: center;
	}

	.navbar {
		position: fixed;
		z-index: 12;
		width: 100%;
	}

	/deep/.transparent_pyq {
		.u-navbar__content {
			background-color: transparent !important;
		}

		.u-icon--right span {
			color: #fff
		}
	}

	.album {
		display: flex;
		align-items: flex-start;
		margin-top: 40rpx;
		margin-bottom: 40rpx;

		&__avatar {
			background-color: #eee;
			display: flex;
			padding: 10rpx;
			border-radius: 6rpx;
		}

		&__content {
			margin-left: 20rpx;
			flex: 1;

		}
	}
</style>
