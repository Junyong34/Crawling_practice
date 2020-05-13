<template>
	<div>zzz</div>
</template>

<style scoped></style>

<script>
import { mapGetters } from 'vuex';
import defaultMixin from '@/mixins/defaultMixin';

export default {
	name: 'sample',
	components: {},
	mixins: [defaultMixin],
	props: {
		sample: {
			type: String,
			default: '',
		},
	},
	watch: {
		getNotification: {
			handler(d) {
				// 로직
			},
		},
	},
	data() {
		return {
			sampleView: '',
		};
	},
	computed: {
		...mapGetters({}),
	},
	created() {},
	mounted() {
		this.$nextTick(() => {

		});
	},
	methods: {},
	destroyed() {},
};
</script>
