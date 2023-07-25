<template>
	<section class="padding10">
		<u-row justify="space-between" gutter="14" >
			<u-col span="4">
				<router-link :to="{path: 'three'}" class="tc">
					<u-button type="primary" size="small" text="基础用法"></u-button>
				</router-link>
				<view class="margin4_t">
					<baseThree :full="false"></baseThree>
				</view>
			</u-col>
			<u-col span="4">
				<router-link :to="{path: 'three'}" class="tc">
					<u-button type="primary" size="small" text="基础地图"></u-button>
				</router-link>
				<view class="margin4_t">
					<baseMap ></baseMap>
				</view>
			</u-col>
			<u-col span="4">
				<router-link :to="{path: 'three'}" class="tc">
					<u-button type="primary" size="small" text="基础用法"></u-button>
				</router-link>
				<view class="margin4_t">
					<baseThree :full="false"></baseThree>
				</view>
			</u-col>
		</u-row>
	</section>
	
</template>

<script>
	const baseThree = () => import('@/pages/set/three/three.vue')
	const baseMap = () => import('@/pages/set/three/map.vue')
	export default {
		components: {
			baseThree,
			baseMap
		},
		data() {
			return {}
		}
	}
</script>

<style>
</style>