<template>
	<view class="tool container">
		<u--form labelPosition="left" labelWidth="80" labelAlign="left">
			<u-form-item label="标题">
				<u--textarea v-model="form.title"  placeholder="请输入内容" autoHeight ></u--textarea>
			</u-form-item>
			<template v-if="iconList.length">
				<view class="" v-for="(item, inx) in iconList" :key="inx">
					<u-form-item :label="'标识' + (inx + 1)" >
						<u--input
						    placeholder="请输入标识"
						    border="surround"
							v-model="item.icon"
						  ></u--input>
					</u-form-item>
					<u-form-item :label="'标识名称' + (inx + 1)">
						<u--input
						    placeholder="请输入标识名称"
						    border="surround"
							v-model="item.label"
						  ></u--input>
					</u-form-item>
				</view>
				
			</template>
			
		</u--form>
		<u-button type="primary">提交</u-button>
		<u-button type="info" class="margin10_t">重置</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					title: '',
					data: ''
				},
				iconList: [
					{
						icon: '',
						label: ''
					}
				]
			}
		}
	}
	
</script>

<style>
</style>