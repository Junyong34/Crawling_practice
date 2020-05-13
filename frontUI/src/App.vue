<style></style>
<template>
	<router-view />
</template>
<script>
export default {
	name: 'App',
	data() {
		return {
			a: 1,
		};
	},
	computed: {},
	created() {
		window.addEventListener(
			'beforeunload',
			event => {
				sessionStorage.clear();
			},
			false,
		);
	},
	mounted() {},
	beforeUpdate() {
		// debugger;
	},
	updated() {
		// debugger;
	},
	methods: {},
	beforeDestroy() {},
};
</script>
