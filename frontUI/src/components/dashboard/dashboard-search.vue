<template>
	<div class="xai-dashboard-search-wrap">
		<div class="xai-dashboard-search">
			<i class="el-icon-search xai-dashboard-search-icon"></i>
			<label class="xai-dashboard-search-input-label">
				<input
					ref="searchInput"
					class="xai-dashboard-search-input"
					placeholder="Search"
					@change="onSearch"
				/>
			</label>
		</div>
		<el-button
			class="xai-dashboard-search-btn"
			type="primary"
			size="mini"
			round
			@click="onSearch"
		>
			Search
		</el-button>
		<div class="xai-dashboard-search-result-count">
			Result: {{ resultCount }}, Total: {{ totalCount }}
		</div>
		<div class="xai-dashboard-sort-wrap">
			<!--				<span>Sort By</span>-->
			<el-select
				v-model="sortBy"
				:value="sortBy"
				size="mini"
				placeholder="Sort By"
				class="xai-dashboard-sort-select"
				@change="onSortByChange"
			>
				<el-option
					v-for="(item, i) in sortByList"
					:key="i"
					:label="item.label"
					:value="item.value"
					size="mini"
				/>
			</el-select>
			<el-radio-group
				class="xai-dashboard-sort-radio"
				v-model="orderBy"
				size="mini"
				@change="onOrderByChange"
			>
				<el-radio-button label="Ascending" />
				<el-radio-button label="Descending" />
			</el-radio-group>
		</div>
		<div class="xai-dashboard-btn-wrap">
			<template v-if="getActiveView.name === 'documentDashboard'">
				<div class="xai-dashboard-import-btn" @click="$emit('dashboard-import')" />
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.xai-dashboard-search-wrap {
	height: 36px;
	padding: 4px 8px;
	margin: 4px;
	@include flex-align($a: center);
	@include xai-get-style(background-color, background, container);
	@include xai-get-style(box-shadow, box-shadow, container);

	.xai-dashboard-search-btn {
		@include xai-get-style(background-color, button, primary);
		margin-left: 8px;
	}

	.xai-dashboard-search-result-count {
		font-style: italic;
		margin-left: 8px;
		font-size: 10px;
		opacity: 0.7;
	}

	.xai-dashboard-search {
		@include flex-align($a: center);
		height: 28px;
		border-radius: 4px;
		width: 30%;
		@include xai-get-style(background-color, background, search);
		border: solid 1px rgba(255, 255, 255, 0.38);

		.xai-dashboard-search-icon {
			padding: 0 10px;
		}

		.xai-dashboard-search-input-label {
			height: 100%;
			width: 100%;
		}

		.xai-dashboard-search-input {
			background-color: transparent;
			border: none;
			height: 100%;
			width: 100%;
			color: #fff;
			outline: none;
			font-size: 12px;
		}
	}

	/deep/ .xai-dashboard-sort-wrap {
		margin-left: 16px;
		margin-right: auto;

		.xai-dashboard-sort-select {
			.is-focus .el-input__inner {
				@include xai-get-style(border-color, button, primary);
			}
		}

		.xai-dashboard-sort-radio {
			.el-radio-button__inner {
				color: #fff;
			}

			.is-active .el-radio-button__inner {
				@include xai-get-style(background-color, button, primary);
				@include xai-get-style(border-color, button, primary);
				box-shadow: none;
			}
		}

		& > * {
			margin-right: 8px;
		}
	}

	.xai-dashboard-btn-wrap {
		@include flex-align($a: center);

		.xai-dashboard-import-btn {
			height: 20px;
			width: 20px;
			cursor: pointer;
			mask: url('../../assets/svg/common/import.svg');
			mask-size: contain;
			mask-repeat: no-repeat;
			mask-position: center;
			background-color: #b2b2b2;
		}
	}
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'dashboard-search',
	components: {},
	props: {
		selectedDashboard: {
			type: Object,
			default: null,
		},
		resultCount: {
			type: Number,
			default: null,
		},
		totalCount: {
			type: Number,
			default: null,
		},
	},
	watch: {},
	data() {
		return {
			sortBy: null,
			orderBy: 'Ascending',
			sortByList: [
				{ value: 'title', label: 'Title' },
				{ value: 'created_date', label: 'Created Date' },
				{ value: 'modified_date', label: 'Modified Date' },
			],
		};
	},
	computed: {
		...mapGetters({
			getActiveView: 'getActiveView',
		}),
	},
	created() {},
	mounted() {
		this.$nextTick(() => {});
	},
	methods: {
		onSearch() {
			this.$emit('search', this.$refs.searchInput.value);
		},
		onSortByChange(value) {
			this.$emit('sort-by-change', value);
		},
		onOrderByChange(value) {
			this.$emit('order-by-change', value.toLowerCase());
		},
	},
	destroyed() {},
};
</script>
