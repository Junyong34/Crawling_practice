<template>
	<div ref="legendList" class="legend-list">
		<!--<div class="fold-handle" @click="onFold">-->
		<!--</div>-->
		<template v-if="!isFold">
			<div
				v-for="(legend, i) in legendList"
				class="legend"
				:key="i"
				@mouseenter="legendMouseEnterHandler($event, legend)"
				@mouseleave="legendMouseLeaveHandler($event, legend)"
				@click="onLegendClick($event, legend, i)"
			>
				<el-tooltip
					v-model="legend.showTooltip"
					manual
					:content="legend.name"
					placement="right"
					transition="none"
					:visible-arrow="false"
				>
					<div>
						<span class="symbol" :style="{ backgroundColor: legend.color }" />
						<div class="label" :ref="`legendLabel_${i}`">
							{{ legend.name }}
						</div>
					</div>
				</el-tooltip>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.fold-handle {
	position: absolute;
	height: 100%;
	width: 5px;
	z-index: 1;
	/*background-color: #0D0D0F;*/

	&:hover {
		background-color: #0d0d0f;
	}
}

.legend-list {
	position: absolute;
	right: 0;
	max-height: calc(100% - 10px);
	width: 20%;
	overflow-y: auto;
	flex: 1;

	.legend {
		font-size: 11px;
		cursor: pointer;
		position: relative;
		margin-bottom: 2px;

		.symbol {
			height: 10px;
			width: 10px;
			border-radius: 50%;
			position: absolute;
			left: 8px;
			top: calc(50% - 5px);
		}

		.label {
			@include skip-text();
			margin-left: 22px;
			padding-right: 5px;
		}

		&.hover {
			filter: brightness(0.8);
			background-color: rgba(0, 0, 0, 0.2);
		}

		&.selected {
			background-color: rgba(0, 0, 0, 0.8);
		}
	}
}
</style>

<script>
export default {
	name: 'widget-legend',
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

			const legendList = this.$el.childNodes;

			legendList.forEach((l, i) => {
				l.classList.remove('selected');
				if (index === i && this.selectedLegend) {
					l.classList.add('selected');
				}
			});

			this.$emit('legend-click', legend.name);
		},
	},
	destroyed() {},
};
</script>
