<template>
	<section>
		<div ref="three"></div>
		<u-toast ref="uToast" />
	</section>
</template>

<script>
	import * as Three from "three"
	import {
		OrbitControls
	} from 'three/examples/jsm/controls/OrbitControls.js'
	export default {
		props: {
			full: {
				default: true,
				type: Boolean
			},
			bgc: {
				default: 'black',
				type: String
			}
		},
		data() {
			return {
				scene: {},
				camera: {},
				renderer: {},
				materials: {},
				cubs: []
			}
		},
		methods: {
			initThree() {
				
				// 场景
				this.scene = new Three.Scene();
				this.scene.background = new Three.Color(this.bgc)
				// 渲染器
				this.renderer = new Three.WebGLRenderer();
				this.renderer.shadowMap.enabled = true;

				let w = this.full ? window.innerWidth : this.$refs.three.clientWidth
				let h = this.full ? window.innerHeight : this.$refs.three.clientWidth
				this.renderer.setSize(w, h);
				this.$refs.three.appendChild(this.renderer.domElement);

				// 透视摄像机--视野角度、长宽比、近截面、远截面
				this.camera = new Three.PerspectiveCamera(45, w / h, 0.1, 100);
				// 正交摄像机--left, right, top, bottom, near, far
				// this.camera = new Three.OrthographicCamera(0,window.innerWidth,0,window.innerHeight, -1, 1 );
				this.camera.position.set(0, 10, 20);
				this.camera.lookAt(0, 0, 0);

				// 相机旋转控制器
				const canvas = this.renderer.domElement
				const controls = new OrbitControls(this.camera, canvas);
				controls.target.set(0, 5, 0);
				controls.update();

				// 直线光
				const light = new Three.DirectionalLight(0xFFFFFF, 1)
				light.castShadow = true
				light.position.set(10, 16, 3)
				light.target.position.set(-10, -10, 0);
				light.shadow.camera.left = -10
				light.shadow.camera.right = 10
				light.shadow.camera.top = 10
				light.shadow.camera.bottom = -10
				this.scene.add(light.target)
				// 辅助函数--- 光源投射
				// const cameraHelper = new Three.CameraHelper(light.shadow.camera);
				// this.scene.add(cameraHelper);
				// 环境光
				// const light = new Three.AmbientLight(0xFFFFFF, 1);
				// 半球光
				// const light = new Three.HemisphereLight(0xB1E1FF, 0xB97A20, 1);
				// 点光源
				// const light = new Three.PointLight(0xFFFFFF, 1)
				// light.position.set(-1, 10, 0)
				// 聚光灯（SpotLight）
				// 矩形区域光（RectAreaLight）--引入RectAreaLightUniformsLib使用---材质只能用MeshStandardMaterial、MeshPhysicalMaterial
				this.scene.add(light)
				// 几何平面体
				this.setPlane()
				// 球体
				this.setSphere(3)
				// 立方体
				const geometry = new Three.BoxGeometry(2, 2, 2);
				this.cubs = [
					this.setGeometry(geometry, 4, 0), // 普通材质
					this.setGeometry(geometry, 1.001, 1), // 纹理
				]
				// 阴影
				this.setShadow()
				// this.renderer.render(this.scene, this.camera)
				requestAnimationFrame(this.animate)

			},
			// 设置球体
			setSphere(r) {
				const sphereRadius = r;
				const sphereWidthDivisions = 32;
				const sphereHeightDivisions = 16;
				const sphereGeo = new Three.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
				const sphereMat = new Three.MeshPhongMaterial({
					color: '#CA8'
				});
				const mesh = new Three.Mesh(sphereGeo, sphereMat);
				mesh.castShadow = true
				mesh.receiveShadow = true
				mesh.position.set(-sphereRadius - 2, sphereRadius, 0);
				this.scene.add(mesh);


			},
			// 设置平面几何体
			setPlane() {
				// 设置集合体纹理
				const planeSize = 40;
				const loader = new Three.TextureLoader();
				const texture = loader.load("../../static/checker.png");
				texture.wrapS = Three.RepeatWrapping;
				texture.wrapT = Three.RepeatWrapping;
				texture.magFilter = Three.NearestFilter;
				const repeats = planeSize / 2;
				texture.repeat.set(repeats, repeats);

				// 初始化几何体
				const planeGeo = new Three.PlaneGeometry(planeSize, planeSize)
				const planeMat = new Three.MeshPhongMaterial({
					map: texture,
					side: Three.DoubleSide
				})
				planeMat.color.setRGB(1.5, 1.5, 1.5);
				const mesh = new Three.Mesh(planeGeo, planeMat)
				mesh.receiveShadow = true
				mesh.rotation.x = Math.PI * -.5;
				this.scene.add(mesh);
			},
			// 设置立方体
			setGeometry(geometry, X, type = 0) {
				// MeshBasicMaterial不会受灯光影响更换MeshPhongMaterial
				let material
				if (type === 0) {
					material = new Three.MeshPhongMaterial({
						color: 0x44aa88
					});
				} else if (type === 1) {
					const texture = [
						new Three.TextureLoader().load("../../static/pd.jpg"),
						new Three.TextureLoader().load("../../static/hh.jpg"),
						new Three.TextureLoader().load("../../static/c3.png"),
						new Three.TextureLoader().load("../../static/c4.png"),
						new Three.TextureLoader().load("../../static/c5.png"),
						new Three.TextureLoader().load("../../static/c6.png")
					];
					material = []
					texture.forEach(el => {
						material.push(new Three.MeshBasicMaterial({
							color: 0xFF8844,
							map: el
						}))
						// el.wrapS = Three.RepeatWrapping;
						// el.wrapT = Three.RepeatWrapping;
						// el.repeat.set(4, 4);
					})

				}

				this.materials[type] = new Three.Mesh(geometry, material);
				this.materials[type].castShadow = true;
				this.materials[type].receiveShadow = true;
				this.materials[type].position.y = X
				this.scene.add(this.materials[type]);
				return this.materials[type]
			},
			// 设置阴影
			setShadow() {
				const base = new Three.Object3D();
				this.scene.add(base);
				// 假阴影纹理网格
				const loader = new Three.TextureLoader();
				const shadowTexture = loader.load("../../static/roundshadow.png");
				const shadowMat = new Three.MeshBasicMaterial({
					map: shadowTexture,
					transparent: true,
					depthWrite: false,
				});
				const planeSize = 1;
				const shadowGeo = new Three.PlaneGeometry(planeSize, planeSize);
				const mesh = new Three.Mesh(shadowGeo, shadowMat);
				mesh.position.set(5, 0.001, 0);
				mesh.rotation.x = Math.PI * -0.5;
				base.add(mesh);
				// 一个球
				const sphereRadius = 1;
				const sphereWidthDivisions = 32;
				const sphereHeightDivisions = 16;
				const sphereGeo = new Three.SphereGeometry(
					sphereRadius,
					sphereWidthDivisions,
					sphereHeightDivisions
				);
				const sphereMat = new Three.MeshPhongMaterial({
					color: 'orange'
				});
				const sphereMesh = new Three.Mesh(sphereGeo, sphereMat);
				sphereMesh.castShadow = true
				sphereMesh.receiveShadow = true
				sphereMesh.position.set(5, sphereRadius + 2, 0);
				base.add(sphereMesh);

				// 动画效果
				function render(time) {
					time *= 0.001
					const yOff = Math.abs(Math.sin(time * 2));
					base.position.set(Math.cos(.2 * time) * Math.sin(time * .2) * 10, 0, Math.sin(time * .2) * Math.sin(
						time * .2) * 10);
					sphereMesh.position.y = sphereRadius + 2 + Three.MathUtils.lerp(-2, 2, yOff);
					mesh.material.opacity = Three.MathUtils.lerp(1, .25, yOff);
					requestAnimationFrame(render)
				}
				requestAnimationFrame(render);

			},
			animate() {
				let canvas = this.renderer.domElement
				// 检查canvas尺寸和显示尺寸---响应式（页面变化，监听canvas变化，重置图片尺寸缓冲区和相机长宽比）
				if (this.resizeRendererToDisplaySize(this.renderer, canvas)) {
					// canvas 不是铺满页面公用，防止页面拉伸
					this.camera.aspect = canvas.clientWidth / canvas.clientHeight
					this.camera.updateProjectionMatrix();
				}
				this.cubs.forEach((cube, ndx) => {
					// cube.rotation.x += 0.02;
					cube.rotation.y += 0.01;
				});
				this.renderer.render(this.scene, this.camera)
				requestAnimationFrame(this.animate)
			},
			// 检查canvas尺寸和显示尺寸,设置缓冲区
			resizeRendererToDisplaySize(renderer, canvas) {
				const pixelRatio = window.devicePixelRatio;
				const width = canvas.clientWidth * pixelRatio | 0;
				const height = canvas.clientHeight * pixelRatio | 0;
				const needResize = canvas.width !== width || canvas.height !== height;
				if (needResize) {
					renderer.setSize(width, height, false);
				}
				return needResize;
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.initThree()
			})
		}
	}
</script>

<style lang="scss">

</style>
