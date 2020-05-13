<template>
	<div class="xai-dashboard-settings-viewer-container">
		<div class="xai-dashboard-settings-left">
			<dashboard-search
				ref="dashboardSearch"
				:selected-dashboard="selectedDashboard"
				:total-count="totalLen"
				:result-count="filterLen"
				@search="searchHandler"
				@dashboard-import="importHandler"
				@clone="cloneHandler"
				@delete="deleteHandler"
				@sort-by-change="sortByChangeHandler"
				@order-by-change="orderByChangeHandler"
			/>
			<dashboard-thumbnail-list
				ref="dashboardList"
				:dashboard-list="displayList"
				@clone="cloneHandler"
				@export="exportHandler"
				@delete="deleteHandler"
				@selected-dashboard="dashboardSelectionHandler"
			/>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getItem } from '@/common/LocalStorageMemager';
import moment from 'moment';
import defaultMixin from '@/mixins/defaultMixin';
import DashboardThumbnailList from '@/components/dashboard/dashboard-thumbnail-list';
import DashboardSearch from '@/components/dashboard/dashboard-search';
import FileUtil from '@/components/report/fileUtil';
import DashboardSavePopup from '@/components/dashboard/dashboard-save-popup';

export default {
	name: 'dashboardListSettings',
	components: { DashboardThumbnailList, DashboardSearch },
	mixins: [defaultMixin],
	props: {},
	watch: {
		getDashboardList: {
			handler() {
				this.setDisplayData();
			},
			deep: true,
		},
		filterKeyword: {
			handler() {
				this.setDisplayData();
			},
		},
	},
	data() {
		return {
			serviceIns: this.$webCaller.serviceIns,
			displayList: [],
			thumbnailList: null,
			dashboardSelection: [],
			searchKeywords: null,
			filterKeyword: null,
			totalLen: null,
			filterLen: null,
			sortBy: 'modifiedDate',
			orderBy: 'ascending',
		};
	},
	computed: {
		...mapGetters({
			getDashboardList: 'widget/getDashboardList',
			getActiveView: 'getActiveView',
		}),
		selectedDashboard() {
			return this.dashboardSelection[this.dashboardSelection.length - 1];
		},
	},
	created() {
		this.$EventBus.$on('RESEARCH_DASHBOARD_LIST', this.reSearch);
		this.reSearch();
	},
	mounted() {
		this.$nextTick(() => {
			// this.$store.dispatch('params/loading_circle_progress', ['fullScreen', false]);
		});
	},
	beforeDestroy() {
		this.$EventBus.$on('RESEARCH_DASHBOARD_LIST', this.reSearch);
	},
	methods: {
		setDisplayData() {
			if (!this.getDashboardList) return;
			const filterList = this.getDashboardList.filter(
				d =>
					this.filterKeyword === null ||
					d.title.toLowerCase().includes(this.filterKeyword.toLowerCase()),
			);

			this.displayList = filterList.sort(this.dashboardSort);

			this.totalLen = this.getDashboardList.length;
			this.filterLen = this.displayList.length;
		},
		dashboardSort(s1, s2) {
			const prop = this.sortBy;
			let result = 0;

			if (s1[prop] === s2[prop]) result = 0;
			if (s1[prop] > s2[prop]) result = 1;
			if (s1[prop] < s2[prop]) result = -1;

			return this.orderBy === 'ascending' ? result : result * -1;
		},
		dashboardSelectionHandler(dashboardList, dashboard) {
			this.dashboardSelection = dashboardList;
		},
		initSelectedDashboard() {
			this.dashboardSelection = [];
			this.$refs.dashboardList.clearDashboardSelection();
		},
		reSearch() {
			const viewName = this.getActiveView.name;
			const apiPath = this.$api.dashboard()[
				viewName === 'documentDashboard' ? 'dashboard' : 'template'
			];
			const params = {
				userId: getItem('userId'),
			};

			this.serviceIns
				.get(apiPath, params, (status, response) => {
					if (response && response.data) {
						this.$store.dispatch('widget/dashboard_list', response.data);
					}
				})
				.then(() => {
					this.initSelectedDashboard();
				});
		},
		unixToDate(value) {
			return moment(value).format('YYYY. MM. DD');
		},
		createViewMove() {
			// 신규 화면 셋팅
			this.$store.dispatch('widget/dashboard_layout', []);
			this.$store.dispatch('widget/selected_dashboard', null);
			this.$router.push({
				name: 'createDashboardLayout',
				params: {
					label: 'Create',
					mainLabel: 'Dashboard',
				},
			});
		},
		deleteHandler() {
			this.$confirm(this.$t('message.delete_confirm', ['dashboard_list']), 'deleteConfirm', {
				confirmButtonText: 'OK',
				cancelButtonText: 'Cancel',
				type: 'info',
			}).then(() => {
				const promiseArr = [];

				this.dashboardSelection.forEach(dashboard => {
					const id = dashboard.id;
					const apiPath = this.$api.dashboard({ id }).dashboardId;

					promiseArr.push(
						this.serviceIns
							.delete(apiPath, '', (status, response) => response)
							.then(() => {
								const apiPath2 = this.$api.dashboard({ id }).idThumbnail;
								this.serviceIns.delete(
									apiPath2,
									'',
									(status, response) => response,
								);
							}),
					);
				});
				Promise.all(promiseArr)
					.then(() => {
						this.reSearch();
					})
					.then(() => {
						this.$message({
							showClose: true,
							message: this.$t('message.delete_success', ['dashboard']),
							type: 'success',
						});
					});
			});
		},
		cloneHandler() {
			let isConflict = true;
			let conflictCount = 0;
			const titleList = this.getDashboardList.map(r => r.title);
			const promiseArr = [];

			// TODO api title duplicateKeyException
			this.dashboardSelection.forEach(dashboard => {
				const { id, layout, title, description } = dashboard;
				const params = {
					layout,
					title: `${title}_clone`,
					description,
				};

				while (isConflict) {
					const newName = params.title + (conflictCount ? ` (${conflictCount + 1})` : '');

					if (titleList.includes(newName)) {
						conflictCount++;
					} else {
						params.title = newName;
						isConflict = false;
					}
				}

				const apiPath = this.$api.dashboard({ userId: getItem('userId') }).dashboardUserId;

				promiseArr.push(
					this.serviceIns
						.post(apiPath, params, (status, response) => response)
						.then(response => {
							this.thumbnailCopy(id, response.data.id);
						}),
				);
			});

			Promise.all(promiseArr)
				.then(() => {
					this.reSearch();
				})
				.then(() => {
					this.$message({
						showClose: true,
						message: this.$t('message.clone_success', ['dashboard']),
						type: 'success',
					});
				});
		},
		thumbnailCopy(id, copiedId) {
			const apiPath = this.$api.dashboard({ id }).thumbnailId;

			this.serviceIns
				.get(apiPath, '', (status, response) => response, 'image/png', 'blob')
				.then(blob => {
					const formData = new FormData();
					const image = new File([blob], 'image');

					formData.append('dashboardThumbnail', image);

					const apiPath2 = this.$api.dashboard({ id: copiedId }).idThumbnail;

					this.serviceIns
						.post(
							apiPath2,
							formData,
							(status, response) => response,
							'multipart/form-data',
						)
						.then(() => {
							this.$EventBus.$emit('DASHBOARD_THUMBNAIL_UPDATE', copiedId);
						});
				});
		},
		searchHandler(value) {
			this.filterKeyword = value;
		},
		sortByChangeHandler(value) {
			this.sortBy = value;
			this.setDisplayData();
		},
		orderByChangeHandler(value) {
			this.orderBy = value;
			this.setDisplayData();
		},
		exportHandler({ title, layout, thumbnail }) {
			const base64 = this.urlToBase64(thumbnail);

			const parseLayout = JSON.parse(layout);

			parseLayout.forEach(l => {
				delete l.moved;
			});

			const data = JSON.stringify({ layout: parseLayout, thumbnailBase64: base64 });

			FileUtil.save(data, 'json', title);
		},
		urlToBase64(url) {
			const img = new Image();

			img.src = url;

			const canvas = document.createElement('canvas');

			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');

			ctx.drawImage(img, 0, 0);

			return canvas.toDataURL('image/png');
		},
		importHandler() {
			this.openFileSelector();
		},
		openFileSelector() {
			FileUtil.selectfile(file => {
				FileUtil.read(file, fileData => {
					let data = null;

					try {
						const temp = JSON.parse(fileData);

						if (temp.layout && typeof temp.layout === 'string') {
							data = {
								layout: JSON.parse(temp.layout),
								thumbnailBase64: temp.thumbnailBase64,
							};
						} else {
							data = temp;
						}
					} catch (e) {
						data = {
							layout: [],
							thumbnailBase64: null,
						};
					} finally {
						if (data) {
							this.savePopup(data);
						}
					}
				});
			});
		},
		savePopup({ layout, thumbnailBase64 }) {
			const popupData = {
				show: true,
				titleLabel: `DashBoard Import`,
				contentsComp: DashboardSavePopup,
				x: 760,
				y: 300,
				w: 400,
				h: 450,
				z: 100,
				draggable: false,
				closeHandle: false,
				params: {
					layout,
					thumbnailBase64,
				},
			};

			this.$store.dispatch('params/main_layer_popup', popupData);
		},
	},
};
</script>

<style lang="scss" scoped>
.xai-dashboard-settings-viewer-container {
	@include flex-align();
	padding: 4px;
	height: 100%;

	.xai-dashboard-settings-left {
		height: 100%;
		width: 100%;
		position: relative;
		overflow-y: auto;
	}

	.xai-dashboard-settings-right {
		@include flex-align($d: column, $j: space-between);
		flex: 2;
	}

	.xai-dashboard-settings-detail {
		@include flex-align($d: column, $j: center, $a: center);
		@include xai-get-style(background-color, background, container);
		text-align: center;
		height: calc(50% - 5px);
		position: relative;
		padding: 0 15%;
	}
}
</style>
