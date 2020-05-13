<template>
	<div class="dashboard">
		<dashboard-toolbox
			class="dashboard-toolbox"
			v-bind="getSelectedDashboard"
			:layout="layout"
			ref="dashboardToolbox"
		/>
		<div class="dashboard-layout-wrap">
			<dashboard-layout
				class="dashboard-layout"
				ref="dashboardLayout"
				:layout.sync="layout"
				:drag-allow-from="dragAllowFrom"
				:drag-ignore-from="dragIgnoreFrom"
				:resize-ignore-from="resizeIgnoreFrom"
				widget-resizable
				@move="moveHandle"
			/>
			<!--			<dashboard-target-setting class="widget-target-setting" />-->
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
// import interact from 'interactjs';
import defaultMixin from '@/mixins/defaultMixin';
// import DashboardTargetSetting from '@/components/dashboard/dashboard-target-setting';
import DashboardToolbox from '@/components/dashboard/dashboard-toolbox';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import _ from 'lodash-es';

export default {
	name: 'dashboard-settings',
	components: {
		DashboardToolbox,
		// DashboardTargetSetting,
		DashboardLayout,
	},
	mixins: [defaultMixin],
	props: {
		viewId: { type: [String, Number] },
	},
	data() {
		return {
			layout: [],
			responsive: false,
			verticalCompact: true,
			dragAllowFrom: '.widget-header',
			dragIgnoreFrom: '.widget-view, .widget-header-btn-wrap',
			resizeIgnoreFrom: '.widget-container, .added-item',
			serviceIns: this.$webCaller.serviceIns,
			addedItem: null,
			drawItemType: null,
			preventCollision: false,
			pause: false,
		};
	},
	computed: {
		...mapGetters({
			getIsUseWidgetList: 'widget/getIsUseWidgetList',
			getSelectedDashboard: 'widget/getSelectedDashboard',
			getDashboardLayout: 'widget/getDashboardLayout',
			getActiveView: 'getActiveView',
			getWidgetFormatList: 'widget/getWidgetFormatList',
		}),
	},
	watch: {
		layout: {
			handler(data) {
				this.$store.dispatch('widget/dashboard_layout', data);
			},
			deep: true,
		},
	},
	created() {
		this.$nextTick(() => {
			this.generateActiveView();
		});
	},
	mounted() {
		this.$nextTick(() => {
			if (this.getDashboardLayout) {
				this.layout = this.generateLayout(this.getDashboardLayout);
			} else if (this.viewId) {
				this.callDashboard();
			} else {
				this.layout = [];
			}
		});
	},
	methods: {
		callDashboard() {
			const apiPath = this.$api.dashboard({ id: this.viewId }).dashboardId;

			this.serviceIns.get(apiPath, '', (status, response) => {
				if (!(response && response.data)) return;

				const dashboard = response.data;

				this.$store.dispatch('widget/selected_dashboard', dashboard);
				const layout = JSON.parse(dashboard.layout);

				this.layout = this.generateLayout(layout);
			});
		},
		generateActiveView() {
			const activeView = this.getActiveView;

			if (!activeView.params.mainLabel || !activeView.params.label) {
				const params = {
					mainLabel: 'Dashboard',
					label: activeView.name === 'documentDashboardLayout' ? 'Document' : 'Template',
					viewId: this.viewId,
				};

				this.$store.dispatch('activeView', {
					...activeView,
					params,
				});
			}
		},
		moveHandle() {
			if (this.pause) return;
			this.pause = true;

			document.addEventListener(
				'mouseup',
				() => {
					this.pause = false;
				},
				{ once: true },
			);
		},
		mergeCustomizer(objVal, srcVal) {
			if (
				objVal &&
				objVal.constructor === Object &&
				srcVal &&
				srcVal.constructor === Object
			) {
				return _.mergeWith({ ...objVal }, srcVal, this.mergeCustomizer);
			}

			return srcVal || objVal;
		},
		generateLayout(layout = []) {
			const data = [];

			const _layout = [...layout];

			_layout.forEach(e => {
				const i = e.id;
				const info = e.info;
				const formatKeyList = Object.keys(this.getWidgetFormatList);
				const findFormatKey = formatKeyList.find(
					k => this.getWidgetFormatList[k].widget.body === e.widget.body,
				);
				const item = _.mergeWith(
					{ ...this.getWidgetFormatList[findFormatKey] },
					e,
					this.mergeCustomizer,
				);
				// const item = { ...e };

				let dataSet;

				dataSet = {
					i,
					...info,
					...item,
				};

				const options = e.options;
				if (options && Object.hasOwnProperty.call(options, 'static')) {
					dataSet = options.static;
				}

				if (!item.widget) {
					const header = e.header === 'label-header' ? 'default-header' : e.header;
					const widgetType = item.widgetType.includes('-view')
						? item.widgetType
						: `${item.widgetType}-view`;

					dataSet.widget = {
						header,
						body: widgetType,
						title: item.title,
						description: item.description,
					};
				}

				dataSet.component = item.component || {};

				if (item.api || item.params) {
					if (dataSet.widget.body === 'event-view') {
						dataSet.component.params = item.params;
					} else {
						const obj = {};

						if (item.api) obj.uri = item.api;
						if (item.params) obj.params = item.params;

						dataSet.component.api = obj;
					}
				}

				if (item.visualization) {
					dataSet.component.visualization = item.visualization;
				}

				const deleteKeyList = [
					'id',
					'info',
					'static',
					'header',
					'widgetType',
					'useCheck',
					'tags',
					'api',
					'params',
					'dataType',
					'visualization',
					'moved',
					'title',
					'description',
					'options',
				];

				deleteKeyList.forEach(k => {
					delete dataSet[k];
				});

				data.push(dataSet);
			});

			return data;
		},
		initUsedWidgetList() {
			const isUseWidgetList = this.getIsUseWidgetList;

			isUseWidgetList.forEach(w => {
				w.isUse = false;
			});
			this.$store.dispatch('widget/is_use_widget_list', isUseWidgetList);
		},
	},
	beforeDestroy() {
		this.initUsedWidgetList();
		this.$store.dispatch('params/main_layer_popup', { show: false });
		this.$store.dispatch('widget/dashboard_layout', null);
		this.$EventBus.$off('DASHBOARD_TRIGGER');
	},
};
</script>

<style lang="scss" scoped>
.dashboard {
	@include flex-align($d: column);
	@include xai-get-style(background-color, background, dashboard);
	width: 100%;
	height: 100%;

	.dashboard-toolbox {
		margin: 8px 8px 0;
		height: 36px;
	}

	.dashboard-layout-wrap {
		position: relative;
		flex: 1;
		overflow-y: auto;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	.dashboard-layout {
		@include xai-get-style(background-color, background, dashboard);
	}
}

.dashboard-added-item {
	background: none;
	@include flex-align($a: center, $j: center);
	opacity: 0.8;

	img {
		margin: auto;
		height: 38px;
	}
}

.dashboard-sign {
	position: absolute;
	height: 100%;
	width: 100%;
	@include flex-align($a: center, $j: center);
	font-family: Roboto-Bold, sans-serif;
	font-size: 24px;
	opacity: 0.5;
	user-select: none;
}

.division-line {
	margin: auto;
	border: 1px solid #585858;

	&.horizontal {
		width: calc(100% - 20px);
	}

	&.vertical {
		height: calc(100% - 20px);
	}

	.drag-handle {
		top: 0;
	}

	.resize-handle {
		position: absolute;
		height: 8px;
		width: 8px;
		bottom: 5px;
		right: 5px;
		border-right: 2px solid #787878;
		border-bottom: 2px solid #787878;
	}
}

/deep/ .vue-grid-item {
	&:not(.added-item):hover {
		.vue-resizable-handle {
			visibility: visible;
		}
	}

	&.added-item:hover {
		cursor: move;
	}

	&.resizing {
		opacity: 0.3;
	}

	.vue-resizable-handle {
		visibility: hidden;
		background: none;
		width: 15px;
		height: 15px;
		bottom: 0;
		right: 0;

		&:before {
			position: absolute;
			content: '';
			height: 8px;
			width: 8px;
			bottom: 5px;
			right: 5px;
			border-right: 2px solid #787878;
			border-bottom: 2px solid #787878;
		}
	}
}
</style>
