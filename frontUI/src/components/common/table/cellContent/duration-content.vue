<style scoped>
.duration-container {
	height: 100%;
	width: 100%;
}

.duration-box-outer {
	position: relative;
	font-size: 10px;
	text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
	min-height: 20px;
	line-height: 20px;
	margin: 2px 0;
	border-left: 1px solid #1cbe85;
}

.duration-box-inner-graph {
	position: absolute;
	background-color: #409eff;
	width: 100%;
	height: 50%;
	top: 25%;
}
</style>
<style>
.el-tooltip__popper.pre-line-tooltip {
	white-space: pre-line;
}
</style>
<template>
	<div class="duration-container">
		<el-tooltip :content="content" popperClass="pre-line-tooltip" placement="top">
			<div
				class="duration-box-outer"
				:style="{
					left: `${startPosition}%`,
					width: `${percentDuration}%`,
				}"
			>
				<span
					class="duration-box-inner-graph"
					:style="{
						backgroundColor: color,
					}"
				></span>
			</div>
		</el-tooltip>
	</div>
</template>
<script>
// import Tooltip from "@/views/topologyView/topologyEtc/Tooltip";

export default {
	name: 'duration-content',
	components: {},
	props: {
		formattedTime: {
			type: String,
		},
		minTime: {
			type: Number,
			default: 0,
		},
		maxTime: {
			type: Number,
			default: 100,
		},
		startTime: {
			type: Number,
			default: 0,
		},
		duration: {
			type: Number,
			default: 1,
		},
		color: {
			type: String,
			default: '#409eff',
		},
	},
	computed: {
		content() {
			return `Time: ${this.formattedTime}
Duration: ${this.duration} (ms)`;
		},
		startPosition() {
			const ret = ((this.startTime - this.minTime) / (this.maxTime - this.minTime)) * 100;

			return ret;
		},
		percentDuration() {
			const dur = (this.duration / (this.maxTime - this.minTime)) * 100;

			return dur < 1 ? 1 : dur;
		},
	},
};
</script>
