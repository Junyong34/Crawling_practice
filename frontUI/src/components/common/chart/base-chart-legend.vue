<template>
	<div class="legend-container">
		<div
			v-for="item in legendData"
			:key="item.index"
			ref="baseLegend"
			:class="positionStyle"
			@click="onClickLegend"
		>
			<span class="legend-symbol" :style="{ backgroundColor: item.color }" />
			<el-tooltip class="item" effect="dark" :content="item.name" placement="">
				<div class="legend-name">{{ item.name }}</div>
			</el-tooltip>
		</div>
	</div>
</template>
<style scoped>
.legend-container {
	margin: 10px;
	padding: 0 0 10px 5%;
}
.legend-child-horizontal {
	overflow-x: auto;
	position: relative;
	cursor: pointer;
	float: left;
	width: 90px;
}
.legend-child-vertical {
	overflow-y: auto;
	position: relative;
	cursor: pointer;
}
.legend-symbol {
	height: 10px;
	width: 10px;
	border-radius: 2px;
	position: absolute;
	left: 0;
	top: calc(50% - 5px);
}
.legend-name {
	padding-left: 15px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	width: 90%;
}
.unchecked > span {
	background-color: gray !important;
}
.unchecked > div {
	color: gray;
}
</style>
<script>
export default {
	name: 'baseChartLegend',
	props: {
		legendPosition: {
			type: String,
			default: 'left',
		},
		legendData: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		positionStyle() {
			if (this.legendPosition === 'top') {
				return 'legend-child-horizontal';
			}
			return 'legend-child-vertical';
		},
	},
	methods: {
		onClickLegend(event) {
			if (this.clickedLegend === event.target.innerText) {
				this.clickedLegend = null;
				for (const index in this.$refs.baseLegend) {
					this.$refs.baseLegend[index].classList.remove('unchecked');
				}
			} else {
				this.clickedLegend = event.target.innerText;
				for (const index in this.$refs.baseLegend) {
					this.$refs.baseLegend[index].classList.add('unchecked');
				}
				event.target.parentNode.classList.remove('unchecked');
			}

			// 선택한 범례만 강조
			const chart = this.$parent.$refs.baseChart;

			for (const value of this.legendData) {
				if (this.clickedLegend === null) {
					chart.dispatchAction({
						type: 'legendSelect',
						name: value.name,
					});
				} else if (value.name === this.clickedLegend) {
					chart.dispatchAction({
						type: 'legendSelect',
						name: value.name,
					});
				} else {
					chart.dispatchAction({
						type: 'legendUnSelect',
						name: value.name,
					});
				}
			}
		},
	},
};
</script>
