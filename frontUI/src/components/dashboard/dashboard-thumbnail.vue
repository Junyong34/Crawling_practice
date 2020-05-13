<template>
	<div
		:class="['xai-dashboard-list-item', `item-${index}`]"
		@click="
			e => {
				$emit('click', e, thumbnailURL);
			}
		"
		@dblclick="
			e => {
				$emit('dblclick', e);
			}
		"
		v-click-outside="
			e => {
				$emit('click-outside', e);
			}
		"
	>
		<div class="xai-dashboard-thumbnail-wrap">
			<img
				v-if="thumbnailURL"
				class="xai-dashboard-thumbnail"
				:src="thumbnailURL"
				alt="thumbnail"
			/>
			<!--			<div v-else class="xai-dashboard-thumbnail empty">-->
			<!--				<div-->
			<!--					v-for="(item, i) in new Array(9)"-->
			<!--					:key="i"-->
			<!--					class="xai-dashboard-thumbnail-widget"-->
			<!--				></div>-->
			<!--			</div>-->
		</div>
		<div class="xai-dashboard-info-wrap">
			<div class="xai-dashboard-info-header">
				<el-tooltip
					class="xai-dashboard-title"
					manual
					v-model="tooltipVisible"
					:content="title"
					placement="top"
					popper-class="xai-dashboard-title-tooltip"
				>
					<span @mouseover="tooltipHandle" @mouseleave="tooltipVisible = false">{{
						title
					}}</span>
				</el-tooltip>
				<el-popover
					ref="configList"
					placement="bottom-end"
					popper-class="dashboard-config-list"
					v-click-outside="
						() => {
							this.configVisible = false;
						}
					"
				>
					<div
						slot="reference"
						:class="['xai-dashboard-config-btn', configVisible && 'is-active']"
						@click="configVisible = !configVisible"
					/>
					<div
						v-for="(config, i) in configList"
						:key="i"
						class="dashboard-config"
						@click="() => configHandle(config.handler)"
					>
						{{ config.name }}
					</div>
				</el-popover>
			</div>
			<div class="xai-dashboard-info-list">
				<div class="xai-dashboard-info">
					<el-tooltip class="xai-dashboard-info-label">Created Date</el-tooltip>
					<div class="xai-dashboard-info-value">
						{{ moment(created_date).format('YYYY-MM-DD HH:mm') }}
					</div>
				</div>
				<div class="xai-dashboard-info">
					<div class="xai-dashboard-info-label">Modified Date</div>
					<div class="xai-dashboard-info-value">
						{{ moment(modified_date).format('YYYY-MM-DD HH:mm') }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
	name: 'dashboard-list-item',
	inheritAttrs: false,
	props: {
		id: {
			type: Number,
			default: null,
		},
		index: {
			type: Number,
			default: null,
		},
		title: {
			type: String,
			default: null,
		},
		created_date: {
			type: Number,
			default: null,
		},
		modified_date: {
			type: Number,
			default: null,
		},
		layout: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			serviceIns: this.$webCaller.serviceIns,
			thumbnailURL: '',
			moment,
			configList: [
				{ name: 'Clone', handler: () => this.$emit('clone') },
				{
					name: 'Export',
					handler: () =>
						this.$emit('export', {
							title: this.title,
							layout: this.layout,
							thumbnail: this.thumbnailURL,
						}),
				},
				{ name: 'Delete', handler: () => this.$emit('delete') },
			],
			configVisible: false,
			tooltipVisible: false,
		};
	},
	computed: {
		...mapGetters({
			getDashboardList: 'widget/getDashboardList',
		}),
	},
	created() {
		this.$EventBus.$on('DASHBOARD_THUMBNAIL_UPDATE', this.dashboardThumbnailUpdateHandle);
	},
	beforeDestroy() {
		this.$EventBus.$off('DASHBOARD_THUMBNAIL_UPDATE', this.dashboardThumbnailUpdateHandle);
	},
	mounted() {
		this.$nextTick(() => {
			this.dashboardThumbnailApiCall();
		});
	},
	methods: {
		dashboardThumbnailUpdateHandle(id) {
			if (this.id !== id) return;
			this.dashboardThumbnailApiCall();
		},
		dashboardThumbnailApiCall() {
			const apiPath = this.$api.dashboard({ id: this.id }).thumbnailId;

			this.serviceIns.get(
				apiPath,
				'',
				(status, response) => {
					const blob = response;

					if (!blob.size) return;

					this.thumbnailURL = window.URL.createObjectURL(blob);
				},
				'image/png',
				'blob',
			);
		},
		configHandle(handler) {
			this.$refs.configList.doClose();
			handler();
		},
		tooltipHandle(e) {
			this.tooltipVisible = e.target.scrollWidth > e.target.offsetWidth;
		},
	},
};
</script>

<style lang="scss">
.dashboard-config-list {
	padding: 6px 0;
	background-color: #313131;
	box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
		0 8px 10px 1px rgba(0, 0, 0, 0.14);
	margin-left: 8px;
	margin-right: -8px;

	&[x-placement^='bottom'] .popper__arrow::after {
		border-bottom-color: #313131;
	}

	&.el-popover {
		min-width: 90px;
	}

	.dashboard-config {
		@include flex-align($a: center);
		padding: 0 12px;
		height: 32px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.6);

		&:hover {
			background-color: #7e51ff;
			color: rgba(255, 255, 255, 0.87);
		}
	}
}

.xai-dashboard-title-tooltip {
	&.el-tooltip__popper {
		background: #313131;
	}
}
</style>

<style lang="scss" scoped>
.xai-dashboard-list-item {
	float: left;
	@include flex-align();
	width: calc(25% - 8px);
	height: calc(25% - 8px);
	margin: 4px;
	position: relative;
	@include xai-get-style(background-color, background, container);
	@include xai-get-style(box-shadow, box-shadow, container);

	.xai-dashboard-thumbnail-wrap {
		height: 100%;
		width: calc(100% - 140px);
		@include flex-align($a: center);
		overflow-y: auto;

		&::-webkit-scrollbar {
			display: none;
		}

		.xai-dashboard-thumbnail {
			width: 100%;

			&.empty {
				@include flex-align();
				flex-wrap: wrap;
				padding: 8px;
				/*border: solid 1px #717171;*/
			}

			.xai-dashboard-thumbnail-widget {
				/*border: solid 1px #717171;*/
				width: calc(100% / 3 - 4px);
				height: calc(100% / 3 - 4px);
				margin: 2px;
			}
		}
	}

	.xai-dashboard-info-wrap {
		@include xai-get-style(background-color, background, info);
		@include xai-get-style(box-shadow, box-shadow, info);
		@include flex-align($d: column);
		width: 140px;
		height: 100%;

		.xai-dashboard-info-header {
			margin: 12px 16px;
			@include flex-align($a: center, $j: space-between);

			.xai-dashboard-title {
				@include skip-text();
				font-size: 12px;
				color: rgba(255, 255, 255, 0.87);
				user-select: none;
			}

			.xai-dashboard-config-btn {
				@include flex-align($a: center);
				position: relative;
				height: 16px;
				width: 16px;
				cursor: pointer;
				mask: url('../../assets/svg/common/configuration.svg');
				mask-size: contain;
				mask-repeat: no-repeat;
				mask-position: center;
				background-color: #666666;

				&:hover,
				&.is-active {
					background-color: #fff;
				}
			}
		}

		.xai-dashboard-info-list {
			@include flex-align();
			flex-wrap: wrap;
			padding: 16px;
			font-size: 10px;
			opacity: 0.8;

			.xai-dashboard-info {
				width: 100%;

				&:not(:last-child) {
					margin-bottom: 16px;
				}

				.xai-dashboard-info-label {
					padding-right: 5px;
					color: rgba(255, 255, 255, 0.6);
				}

				.xai-dashboard-info-value {
					text-align: left;
					margin-left: 8px;
					color: rgba(255, 255, 255, 0.87);
				}
			}
		}
	}

	&.selected:after {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		border: solid 1px #906aff;
		background-color: rgba(144, 106, 255, 0.1);
		box-sizing: border-box;
		pointer-events: none;
	}
}
</style>
