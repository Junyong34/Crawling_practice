<template>
	<div class="load-pattern-analysis">
		<load-pattern></load-pattern>
		<div></div>
	</div>
</template>
<script>
import viewMixin from '@/mixins/viewMixin';
import LoadPattern from '@/views/performanceAnalysis/load-pattern';

export default {
	name: 'LoadPatternView',
	mixins: [viewMixin],
	components: {
		LoadPattern,
	},
	// props: {},
	data() {
		return {};
	},
	// computed: {},
	// watch: {},
	// created() {},
	// mounted() {
	// 	this.$nextTick(() => {});
	// },
	// beforeDestroy() {},
	// destroyed() {},
	// methods: {
	// },
};
</script>
<style lang="scss" scoped>
.load-pattern-analysis {
	position: relative;
	display: grid;
	grid-template-columns: 50% auto;
	width: 100%;
	height: 100%;
	/*border: 1px solid cornflowerblue;*/
}
</style>
