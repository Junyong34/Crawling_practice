<template>
	<div ref="legendList" class="legend-list">
		<div
			v-for="(legend, i) in legendList"
			:class="legend.isSelected ? 'legend selected' : 'legend'"
			:key="i"
			@mouseenter="legendMouseEnterHandler($event, legend)"
			@mouseleave="legendMouseLeaveHandler($event, legend)"
			@click="onLegendClick($event, legend, i)"
		>
			<el-tooltip
				v-model="legend.showTooltip"
				manual
				:content="legend.label"
				placement="right"
				transition="none"
				:visible-arrow="false"
			>
				<div>
					<span class="symbol" :style="{ backgroundColor: legend.color }" />
					<div class="label" :ref="`legendLabel_${i}`">
						{{ legend.label }}
					</div>
				</div>
			</el-tooltip>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.legend-list {
	position: relative;
	width: 100%;
	height: 100%;
	padding: 5px;
	overflow-y: auto;
	.legend {
		font-size: 11px;
		cursor: pointer;
		position: relative;
		margin-bottom: 2px;
		.label {
			@include skip-text();
			margin-left: 15px;
			/*padding-right: 5px;*/
		}
		.symbol {
			height: 10px;
			width: 10px;
			border-radius: 50%;
			position: absolute;
			left: 0px;
			top: calc(50% - 5px);
		}

		&.hover {
			filter: brightness(0.8);
			background-color: rgba(0, 0, 0, 0.2);
		}

		&.selected {
			background-color: rgba(160, 93, 233, 0.29);
		}
	}
}
</style>

<script>
export default {
	name: 'aiChartLegend',
	inheritAttrs: false,
	components: {},
	props: {
		legendList: {
			type: Array,
			default: () => [],
		},
	},
	watch: {
		legendList: {
			handler(data) {},
		},
	},
	data() {
		return {
			selectedLegend: null,
			isFold: false,
		};
	},
	computed: {},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.render = true;
		});
	},
	updated() {},
	methods: {
		onFold() {
			this.isFold = !this.isFold;
		},
		legendMouseEnterHandler(e, legend) {
			const target = e.target;

			target.classList.add('hover');

			const label = target.querySelector('.label');

			if (label.offsetWidth < label.scrollWidth) legend.showTooltip = true;
		},
		legendMouseLeaveHandler(e, legend) {
			e.target.classList.remove('hover');

			legend.showTooltip = false;
		},
		onLegendClick(e, legend, index) {
			this.selectedLegend = this.selectedLegend !== legend ? legend : null;

			legend.isSelected = !legend.isSelected;

			this.$emit('legend-click', legend);
		},
	},
	destroyed() {},
};
</script>
