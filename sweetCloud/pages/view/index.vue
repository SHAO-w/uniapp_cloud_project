<template>
	<view class="listContain" ref="contain" @scroll="listScroll">
		<view style="width: 100%;" :style="{height: list.length*20+'px'}">
		</view>
		<view ref="list" class="list" style="top: 0;">
			<template v-for="(item,i) in list.slice(start,end)">
				<view :key="i" class="u-list-item u-list-item-">
					<u-cell :title="`虚拟列表-${item + 1}`">
						<u-avatar slot="icon" shape="square" size="35" :src="urls[parseInt(Math.random()*10)]"
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
					</u-cell>
				</view>
			</template>
		</view>
	</view>
	<!-- <view class="">
		<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<marker id="arrow" viewBox='0 0 20 20' refX='0' refY='10' markerWidth='10' markerHeight="10" orient="auto">
					<path d="M 0 0 L 20 10 L 0 20 Z"></path>
				</marker>
			</defs>
			<line x1='100' y1='100' x2='200' y2='150' stroke='red' stroke-width='2'
			    marker-end='url(#arrow)'></line>
		</svg>
	</view> -->
</template>
<script>
	let list = []
	for (let i = 0; i < 10000; i++) {
		list.push(i)
	}
	export default {
		data() {
			return {
				list: list,
				start: 0,
				end: 50,
				n: 1,
				heightItem: 50,
				scrollTopTemp: 0,
				urls: [
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
				]
			}
		},
		methods: {
			listScroll() {
				console.log(this.$refs.contain.$el.scrollTop, this.scrollTopTemp)
				if (this.$refs.contain.$el.scrollTop > this.heightItem * 15 * this.n && this.scrollTopTemp < this.$refs.contain.$el
					.scrollTop) {
					this.start = parseInt(this.$refs.contain.$el.scrollTop / this.heightItem)
					this.end = this.start + 50
					this.n++
					this.$refs.list.$el.setAttribute('style', `top:${this.$refs.contain.$el.scrollTop}px`)
				}
				if (this.scrollTopTemp > this.$refs.contain.$el.scrollTop && this.$refs.contain.$el.scrollTop <= this.heightItem * 15 *
					this.n) {
					this.start = parseInt(this.$refs.contain.$el.scrollTop / this.heightItem) - 15 > 0 ? parseInt(this.$refs.contain.$el
						.scrollTop / this.heightItem) - 15 : 0
					this.end = this.start + 50
					this.n--
					let top = this.$refs.contain.$el.scrollTop - this.heightItem * 15
					this.$refs.list.$el.setAttribute('style', `top:${top > 0 ? top: 0}px`)
				}
				this.scrollTopTemp = this.$refs.contain.$el.scrollTop
			}
		},
		mounted() {

		}
	}
</script>
<style lang="scss" scoped>
	.listContain {
		height: calc(100vh - 94px);
		position: relative;
		width: 100%;
		overflow-y: scroll;
	}

	.list {
		position: absolute;
		z-index: 1;
		width: 100%;
	}
</style>
