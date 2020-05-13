<template>
	<div v-if="tagList || tagList.length === 0">
		<el-tooltip :placement="tooltipPlacement">
			<template slot="content">
				<div class="tooltip-content" v-for="(tag, index) in displayTagList" :key="index">
					{{
						typeof tag === 'object'
							? tooltipProp
								? tag[tooltipProp]
								: tag[tagProp]
							: tag
					}}
					<div v-if="unique && tag.count > 1" class="duplicate-badge">
						x{{ unique ? `${tag.count}` : '' }}
					</div>
				</div>
			</template>
			<div class="tag-wrap" :style="wrapStyle">
				<template v-for="(tag, index) in displayTagList">
					<el-tag
						:key="index"
						v-if="index < limit"
						class="tag"
						:color="`${color}`"
						effect="dark"
						:size="tagSize"
						:style="tagStyle"
					>
						{{ typeof tag === 'object' ? tag[tagProp] : tag }}
					</el-tag>
				</template>
				<div
					v-if="displayTagList.length > limit"
					class="more-symbol"
					:style="{ backgroundColor: `${color}72` }"
				>
					<span>+{{ displayTagList.length - limit }}</span>
				</div>
			</div>
		</el-tooltip>
	</div>
	<div v-else></div>
</template>

<script>
export default {
	name: 'tag-content',
	props: {
		tagList: {
			type: Array,
			default: () => [],
		},
		tagProp: {
			type: String,
			default: 'tag',
		},
		tooltipProp: {
			type: String,
			default: null,
		},
		color: {
			type: String,
			default: '#000000',
		},
		limit: {
			type: Number,
			default: 3,
		},
		tagSize: {
			type: String,
			default: 'small',
		},
		wrapStyle: {
			type: Object,
			default: () => {},
		},
		tagStyle: {
			type: Object,
			default: () => {},
		},
		tooltipPlacement: {
			type: String,
			default: 'right',
		},
		unique: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			uniqueTagList: [],
		};
	},
	created() {
		if (this.unique) {
			this.uniqueTagList = this.getUniqueTagList();
		}
	},
	watch: {
		tagList() {
			this.uniqueTagList = this.getUniqueTagList();
		},
	},
	computed: {
		displayTagList() {
			return this.unique ? this.uniqueTagList : this.tagList;
		},
	},
	methods: {
		getUniqueTagList() {
			return this.tagList.reduce((unique, el) => {
				const newEl = {
					[this.tagProp]: typeof el === 'object' ? el[this.tagProp] : el,
					count: 1,
				};

				if (this.tooltipProp) newEl[this.tooltipProp] = el[this.tooltipProp];

				const uniqueIndex = unique.findIndex(e =>
					this.tooltipProp
						? e[this.tooltipProp] === newEl[this.tooltipProp]
						: e[this.tagProp] === newEl[this.tagProp],
				);

				if (uniqueIndex === -1) {
					return [...unique, newEl];
				} else {
					unique[uniqueIndex].count++;
					return unique;
				}
			}, []);
		},
	},
};
</script>

<style lang="scss" scoped>
.tag-wrap {
	display: flex;
	align-items: center;
}

.tag {
	border-radius: 20px;
	border: none;
	margin: 2px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.more-symbol {
	margin: 2px;
	padding: 0 10px;
	height: 20px;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.more-symbol span {
	position: absolute;
	font-size: 10px;
}

.tooltip-content {
	@include flex-align($a: center);
}

.duplicate-badge {
	@include flex-align($a: center, $j: center);
	background-color: #ffffffdd;
	color: #303133;
	border-radius: 4px;
	padding: 0 5px;
	margin-left: 5px;
	font: {
		size: 11px;
	}
}
</style>
