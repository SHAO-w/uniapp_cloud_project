<template>
	<canvas id="c" style="width: 109px;height: 109px;">
		<div id="ui"></div>
	</canvas>
</template>

<script>
	import * as THREE from 'three';
	import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
	import {
		OrbitControls
	} from 'three/examples/jsm/controls/OrbitControls.js'
	export default {
		methods: {
			main() {
				const canvas = document.querySelector('#c');
				const renderer = new THREE.WebGLRenderer();
				const fov = 60;
				const aspect = 2; // the canvas default
				const near = 0.1;
				const far = 10;
				const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
				camera.position.z = 2.5;

				const controls = new OrbitControls(camera, canvas);
				controls.enableDamping = true;
				controls.enablePan = false;
				controls.minDistance = 1.2;
				controls.maxDistance = 4;
				controls.update();

				const scene = new THREE.Scene();
				scene.background = new THREE.Color('black');
			}
		},
		mounted() {
			setTimeout(() => {
				this.main()
			},500)
		}
	}
</script>

<style>
</style>
