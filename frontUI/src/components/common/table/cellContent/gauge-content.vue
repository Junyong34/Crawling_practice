<template>
	<div class="gauge-container">
		<div class="gauge-box-outer" :style="{ backgroundColor: `${color}1a` }">
			<span
				class="gauge-box-inner-graph"
				:style="{
					width: `${percentValue}%`,
					backgroundColor: `${color}72`,
				}"
			></span>
			<span
				class="gauge-box-inner-text"
				:style="{ textAlign: !realValue ? 'center' : 'left' }"
			>
				{{ percentValue }} %
				<!--&nbsp;-->
				<!--{{contents}}-->
			</span>
			<span v-if="!realValue" class="gauge-box-inner-right">{{ realValue }}</span>
		</div>
	</div>
</template>
<script>
export default {
	name: 'bar-chart-content',
	props: {
		contents: {
			type: String,
			default: '',
		},
		value: {
			type: [Number, String, Array],
		},
		color: {
			type: String,
			default: '#d8798c',
		},
	},
	computed: {
		percentValue() {
			let value;

			switch (typeof this.value) {
				case 'object':
					value = Number(this.value[0] / this.value[1]) * 100; // 부분값 ÷ 전체값 * 100
					break;
				case 'string':
					value = Number(this.value);
					break;
				default:
					value = this.value;
			}

			return value === undefined || Number.isNaN(value) || value === Infinity
				? '0.00'
				: value.toFixed(2);
		},
		realValue() {
			// 1개의 데이터는 string 으로 분류
			// if (typeof this.value === "string") return null;
			if (Array.isArray(this.value)) {
				const [value1 = null, value2 = null, value3 = null] = this.value;

				// 단위를 표시해야하는 경우가 있는데, display 데이터로 그대로 보여준다.
				if (value3 !== null) {
					return value3;
				} else if (value2 !== null) {
					return Number(value1).toFixed(2);
				} else {
					return null;
				}
			}

			return null;

			// return this.value.length === 2 ? Number(this.value[0])
			//     .toFixed(2) : null;
		},
	},
};
</script>
<style scoped>
.gauge-container {
	height: 100%;
	width: 100%;
}

.gauge-box-outer {
	display: flex;
	background-color: rgba(104, 255, 252, 0.1);
	font-size: 10px;
	text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
	min-height: 20px;
	line-height: 20px;
	width: 100%;
	position: relative;
	margin: 2px 0;
}

.gauge-box-inner-graph {
	background-color: rgba(104, 255, 252, 0.447);
	transition: all 0.5s ease 0s;
}

.gauge-box-inner-text {
	width: 100%;
	height: 100%;
	padding-left: 5px;
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
}

.gauge-box-inner-right {
	text-align: right;
	width: 100%;
	padding-right: 5px;
	position: absolute;
}
</style>
