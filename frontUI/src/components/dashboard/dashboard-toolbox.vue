<template>
	<div class="dashboard-toolbox">
		<div class="dashboard-list-btn" @click="move2DashboardList" />
		<el-popover
			v-if="getActiveView.name !== 'createDashboardLayout'"
			trigger="manual"
			class="dashboard-list-dropdown"
			popper-class="dashboard-popper"
			placement="bottom-start"
			width="180"
			v-model="listVisible"
			v-click-outside="
				() => {
					this.listVisible = false;
				}
			"
		>
			<div
				slot="reference"
				:class="['dashboard-combobox', listVisible && 'is-active']"
				@click="listVisible = !listVisible"
			>
				<span class="dashboard-title">{{ title }}</span>
				<img
					class="dashboard-combobox-arrow"
					:src="require('@/assets/svg/common/arrow-up.svg')"
				/>
			</div>
			<div class="dashboard-list">
				<template v-for="(dashboard, i) in getDashboardList">
					<div
						v-if="id !== dashboard.id"
						:key="i"
						class="dashboard-list-item"
						@click="() => linkMove(dashboard)"
					>
						{{ dashboard.title }}
					</div>
				</template>
			</div>
		</el-popover>
		<div class="dashboard-btn-wrap">
			<widget-list-dropdown v-if="getActiveView.name !== 'templateDashboardLayout'" />
			<el-popover
				:class="['dashboard-toolbox-dropdown', configVisible && 'is-active']"
				popper-class="dashboard-config-popper"
				trigger="manual"
				v-model="configVisible"
				placement="bottom-end"
				width="90"
				:visible-arrow="false"
				v-click-outside="
					() => {
						this.configVisible = false;
					}
				"
			>
				<div
					slot="reference"
					:class="['dashboard-config-btn', configVisible && 'is-active']"
					@click="configVisible = !configVisible"
				/>
				<div class="dashboard-config-list-wrap">
					<div
						v-for="(item, i) in dashboardConfigList"
						:key="i"
						class="dashboard-config-list-item"
						@click="() => configClickHandle(item)"
					>
						{{ item }}
					</div>
				</div>
			</el-popover>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import FileUtil from '@/components/report/fileUtil';
import DashboardSavePopup from '@/components/dashboard/dashboard-save-popup';
import WidgetListDropdown from '@/components/dashboard/widget-list-dropdown';
import { getItem } from '@/common/LocalStorageMemager';

export default {
	name: 'dashboard-toolbox',
	components: { WidgetListDropdown },
	props: {
		id: {
			type: Number,
		},
		title: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		share: {
			type: Boolean,
			default: false,
		},
		layout: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			serviceIns: this.$webCaller.serviceIns,
			listVisible: false,
			configVisible: false,
			inputTitle: this.title,
		};
	},
	computed: {
		...mapGetters({
			getDashboardList: 'widget/getDashboardList',
			getIsUseWidgetList: 'widget/getIsUseWidgetList',
			getDashboardLayout: 'widget/getDashboardLayout',
			getActiveView: 'getActiveView',
		}),
		dashboardConfigList() {
			const viewName = this.getActiveView.name;
			// const list = ['Export'];
			const list = [];

			if (viewName === 'documentDashboardLayout') {
				list.push('Save');
				list.push('Delete');
			} else if (viewName === 'createDashboardLayout') {
				list.push('Save');
			}
			return list;
		},
	},
	watch: {
		title: {
			handler(data) {
				this.inputTitle = data;
			},
		},
	},
	created() {
		if (!this.getDashboardList) {
			this.setDashboardList();
		}

		this.$EventBus.$on('DASHBOARD_SAVE_POPUP_CLOSE', this.removeCloneLayout);
	},
	beforeDestroy() {
		this.$EventBus.$off('DASHBOARD_SAVE_POPUP_CLOSE', this.removeCloneLayout);
	},
	methods: {
		setDashboardList() {
			const viewName = this.getActiveView.name;
			const apiPath = this.$api.dashboard()[
				viewName === 'documentDashboardLayout' ? 'dashboard' : 'template'
			];
			const params = {
				userId: getItem('userId'),
			};

			this.serviceIns.get(apiPath, params, (status, response) => {
				if (response && response.data) {
					this.$store.dispatch('widget/dashboard_list', response.data);
				}
			});
		},
		linkMove(dashboard) {
			this.$store.dispatch('widget/selected_dashboard', dashboard);
			this.$store.dispatch('widget/dashboard_layout', JSON.parse(dashboard.layout));

			this.$router.push({
				name: 'documentDashboardLayout',
				params: {
					label: 'Document',
					mainLabel: 'Dashboard',
					viewId: dashboard.id,
				},
			});
		},
		configClickHandle(config) {
			this.$EventBus.$emit('DASHBOARD_TODO', config.toLowerCase());

			switch (config.toLowerCase()) {
				case 'save':
					this.onSave();
					break;
				case 'delete':
					this.onDelete();
					break;
				case 'export':
					this.onExport();
					break;
				case 'copy':
					break;
				default:
					break;
			}
		},
		onSave() {
			this.createCloneLayout();

			this.savePopup();
		},
		onDelete() {
			this.$confirm(this.$t('message.delete_confirm', ['dashboard_list']), 'deleteConfirm', {
				confirmButtonText: 'OK',
				cancelButtonText: 'Cancel',
				type: 'info',
			}).then(() => {
				const apiPath = this.$api.dashboard({ id: this.id }).dashboardId;

				this.serviceIns
					.delete(apiPath, '', (status, response) => response)
					.then(() => {
						const apiPath2 = this.$api.dashboard({ id: this.id }).idThumbnail;

						this.serviceIns
							.delete(apiPath2, '', (status, response) => response)
							.then(() => {
								this.$router.push({
									name: 'documentDashboard',
								});
							});
					});
			});
		},
		onExport({ title, layout }) {
			FileUtil.save(layout, 'json', title);
		},
		savePopup() {
			const popupData = {
				show: true,
				titleLabel: `DashBoard Save`,
				contentsComp: DashboardSavePopup,
				x: 760,
				y: 300,
				w: 400,
				h: 450,
				z: 100,
				draggable: false,
				closeHandle: false,
				params: {
					id: this.id,
					title: this.inputTitle,
					description: this.description,
					share: this.share,
					layout: this.layout,
				},
			};

			this.$store.dispatch('params/main_layer_popup', popupData);
		},
		createCloneLayout() {
			// const layout = document.querySelector(".dashboard-layout-wrap");
			// const mainView = document.querySelector(".main-view-area-content-ch");
			// const cloneLayout = layout.cloneNode(true);
			//
			// cloneLayout.classList.add("clone");
			// cloneLayout.style.position = "absolute";
			// cloneLayout.style.top = 0;
			// cloneLayout.style.zIndex = 1;
			//
			// mainView.appendChild(cloneLayout);
		},
		removeCloneLayout() {
			// const cloneLayout = document.querySelector(".dashboard-layout-wrap.clone");
			//
			// if (cloneLayout) cloneLayout.remove();
			//
		},
		move2DashboardList() {
			this.$router.push({
				name: 'documentDashboard',
			});
		},
	},
};
</script>

<style lang="scss">
.dashboard-title-input {
	width: 180px;

	&.el-input--mini .el-input__inner {
		border-radius: 2px;
		background: #121212;
		border: solid 1px rgba(255, 255, 255, 0.38);
		outline-style: none;
		transition: border-color 0.3s;
	}
}
.dashboard-popper {
	background-color: #272727;
	padding: 8px 0;
	box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
		0 6px 10px 0 rgba(0, 0, 0, 0.2);

	&[x-placement^='bottom'] .popper__arrow::after {
		border-bottom-color: #272727;
	}
}
.dashboard-list {
	background-color: #272727;

	.dashboard-list-item {
		@include flex-align($a: center);
		height: 36px;
		background-color: #272727;
		padding: 0 16px;
		cursor: pointer;
		font-size: 12px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.6);

		&:hover {
			background-color: #7e51ff;
			color: rgba(255, 255, 255, 0.87);
		}
	}
}

.dashboard-config-popper {
	border-radius: 0;
	background-color: #272727;
	box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
		0 6px 10px 0 rgba(0, 0, 0, 0.2);
	padding: 0;

	&[x-placement^='bottom'] {
		margin-top: 0;
	}

	.dashboard-config-list-wrap {
		background-color: #272727;

		.dashboard-config-list-item {
			@include flex-align($a: center);
			height: 36px;
			background-color: #272727;
			padding: 0 16px;
			cursor: pointer;
			font-size: 12px;
			font-weight: 500;
			color: rgba(255, 255, 255, 0.6);

			&:hover {
				background-color: #7e51ff;
				color: rgba(255, 255, 255, 0.87);
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.dashboard-toolbox {
	.dashboard-list-btn {
		height: 20px;
		width: 20px;
		margin-left: 8px;
		cursor: pointer;
		mask: url('../../assets/svg/common/arrow-back.svg');
		mask-size: contain;
		mask-repeat: no-repeat;
		mask-position: center;
		background-color: #b2b2b2;

		&:hover {
			background-color: #fff;
		}
	}

	@include xai-get-style(background-color, background, container);
	@include flex-align($a: center);
	height: 36px;
}

.dashboard-list-dropdown {
	margin-left: 8px;
	user-select: none;

	.dashboard-combobox {
		@include flex-align($a: center, $j: space-between);
		height: 28px;
		min-width: 180px;
		border-radius: 2px;
		background-color: #121212;
		border: solid 1px rgba(255, 255, 255, 0.38);
		outline-style: none;
		transition: border-color 0.3s;

		.dashboard-title {
			margin-left: 8px;
			font-size: 12px;
			color: rgba(255, 255, 255, 0.87);
		}

		.dashboard-combobox-arrow {
			margin: 6px;
			transition: transform 0.3s;
			opacity: 0.87;
		}

		&.is-active {
			border: solid 1px #906aff;

			.dashboard-combobox-arrow {
				opacity: 1;
				transform: rotate(180deg);
			}
		}
	}

	/*&:after {*/
	/*	display: block;*/
	/*	content: '';*/
	/*	width: 100%;*/
	/*	border-bottom: solid 1px #a7a7a7;*/
	/*	transform: scaleX(0);*/
	/*	transition: transform 0.1s ease-in-out;*/
	/*}*/

	&:hover {
		cursor: pointer;

		&:after {
			transform: scaleX(1);
		}

		.combobox-arrow {
			opacity: 1;
		}
	}

	.dashboard-title-wrap {
		display: inline-block;
		height: 28px;
		margin-left: 5px;
		margin-right: 20px;

		.dashboard-title {
			font-size: 16px;
			color: #fff;
		}
	}

	.combobox-arrow {
		opacity: 0;
		position: absolute;
		margin-left: 10px;
		top: calc(50% - 4px);
		width: 0;
		margin-top: 4px;
		border-right: 4px solid transparent;
		border-left: 4px solid transparent;
		border-top: 4px solid #a7a7a7;
		border-bottom: 4px solid transparent;
		transition: opacity 0.2s ease-in-out;
	}
}

.dashboard-btn-wrap {
	margin-left: auto;
	@include flex-align($a: center, $j: space-between);

	.dashboard-toolbox-dropdown {
		@include flex-align($a: center, $j: center);
		height: 36px;
		width: 36px;
		transition: background-color 0.3s;

		&.is-active {
			background-color: #7e51ff;
		}

		.dashboard-config-btn {
			height: 100%;
			width: 100%;
			cursor: pointer;
			mask: url('../../assets/svg/common/configuration.svg');
			mask-size: 20px;
			mask-repeat: no-repeat;
			mask-position: center;
			background-color: #b2b2b2;
			padding: 8px;
			outline-style: none;

			&.is-active {
				background-color: #eae4ff;
			}
		}
	}
}

/*.ascending {*/
/*    .cell .combobox-arrow {*/
/*        opacity: 1;*/
/*        top: 50%;*/
/*        border-top: 4px solid #A7A7A7;*/
/*        border-bottom: 4px solid transparent;*/
/*    }*/
/*}*/

/*.descending {*/
/*    .cell .combobox-arrow {*/
/*        opacity: 1;*/
/*        top: 50%;*/
/*        border-top: 4px solid #A7A7A7;*/
/*        border-bottom: 4px solid transparent;*/
/*    }*/
/*}*/

.dashboard-combobox-list {
	background-color: #1c1c26;
	border-color: #1c1c26;

	.dashboard-combobox-list-item {
		@include flex-align($a: center);
		color: #fff;

		img {
			height: 18px;
		}

		&:hover {
			background: #7d7d7d;
		}
	}
}
</style>
