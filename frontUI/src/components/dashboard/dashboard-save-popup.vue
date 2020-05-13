<template>
	<div class="xai-dashboard-save-popup">
		<template v-if="loadingFinish">
			<div class="xai-dashboard-save-popup-editor">
				<div class="xai-dashboard-save-popup-item1">
					<div
						v-if="thumbnailURL"
						ref="dashboardThumbnail"
						class="xai-dashboard-thumbnail"
					>
						<img class="xai-dashboard-thumbnail-image" :src="thumbnailURL" />
					</div>
					<div v-else class="xai-dashboard-thumbnail empty">
						<div
							v-for="(item, i) in new Array(9)"
							:key="i"
							class="xai-dashboard-thumbnail-widget"
						></div>
					</div>
					<div class="xai-dashboard-save-popup-item">
						Title
						<el-input v-model="form.title" size="small" />
					</div>
					<div></div>
					<div class="xai-dashboard-save-popup-item">
						Description
						<el-input type="textarea" :rows="3" v-model="form.description"> </el-input>
					</div>
					<div class="xai-dashboard-save-popup-item">
						Share
						<el-switch class="xai-dashboard-share-switch" v-model="form.share" />
					</div>
				</div>
				<div class="xai-dashboard-save-popup-item3">
					<el-button type="primary" size="small" @click="closeEditor">Cancel</el-button>
					<el-button type="primary" size="small" @click="saveDashboard">Save</el-button>
				</div>
			</div>
		</template>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import html2canvas from 'html2canvas';
import { getItem } from '@/common/LocalStorageMemager';

export default {
	name: 'widgetDashboardSave',
	components: {},
	props: {
		id: { type: Number, default: null },
		title: { type: String, default: null },
		description: { type: String, default: null },
		share: { type: Boolean, default: false },
		layout: { type: Array, default: () => [] },
		thumbnailBase64: { type: String, default: null },
	},
	data() {
		return {
			serviceIns: this.$webCaller.serviceIns,
			posingLayout: null,
			thumbnailBlob: null,
			loadingFinish: false,
			form: {
				title: null,
				description: null,
				share: null,
			},
		};
	},
	computed: {
		...mapGetters({
			getUserId: 'getUserId',
			getSelectedDashboard: 'widget/getSelectedDashboard',
		}),
		thumbnailURL() {
			if (!this.thumbnailBlob) return null;
			return window.URL.createObjectURL(this.thumbnailBlob);
		},
	},
	watch: {
		thumbnailBlob: {
			handler() {},
		},
	},
	created() {
		this.form.title = this.title;
		this.form.description = this.description;
		this.form.share = this.share;

		this.$nextTick(() => {
			if (this.thumbnailBase64) {
				this.setThumbnailBlob();
			} else {
				this.readyToCapture();
			}
		});
	},
	beforeDestroy() {
		window.URL.revokeObjectURL(this.thumbnailBlob);
	},
	methods: {
		setThumbnailBlob() {
			this.loadingFinish = true;

			this.thumbnailBlob = this.dataURLtoBlob(this.thumbnailBase64);
		},
		dataURLtoBlob(dataURL) {
			// convert base64/URLEncoded data component to raw binary data held in a string
			let byteString;

			if (dataURL.split(',')[0].indexOf('base64') >= 0) {
				byteString = atob(dataURL.split(',')[1]);
			} else {
				byteString = unescape(dataURL.split(',')[1]);
			}

			// separate out the mime component
			const mimeString = dataURL
				.split(',')[0]
				.split(':')[1]
				.split(';')[0];

			// write the bytes of the string to a typed array
			const u8arr = new Uint8Array(byteString.length);

			for (let ix = 0; ix < byteString.length; ix++) {
				u8arr[ix] = byteString.charCodeAt(ix);
			}

			return new Blob([u8arr], { type: mimeString });
		},
		saveDashboard() {
			if (!this.form.title) {
				this.$alert(this.$t('message.input_enter', ['Title']), 'alert');
				return;
			}

			if (this.id) {
				// 수정
				this.updateDashboard();
			} else {
				// 신규
				this.createDashboard();
			}
		},
		saveDashboardThumbnail(id) {
			if (!this.thumbnailBlob) {
				return new Promise(resolve => {
					resolve();
				});
			}

			const apiPath = this.$api.dashboard({ id }).idThumbnail;

			const formData = new FormData();
			const image = new File([this.thumbnailBlob], 'image');

			formData.append('dashboardThumbnail', image);

			return this.serviceIns.post(
				apiPath,
				formData,
				(status, response) => response,
				'multipart/form-data',
			);
		},
		setDashboardList() {
			const apiPath = this.$api.dashboard().dashboard;
			const params = { userId: getItem('userId') };
			return this.serviceIns.get(apiPath, params, (status, response) => {
				if (response && response.data) {
					this.$store.dispatch('widget/dashboard_list', response.data);
				}
			});
		},
		removeUnusedProperty(layout) {
			layout.forEach(l => {
				delete l.moved;
			});

			return layout;
		},
		createDashboard() {
			const layout = this.removeUnusedProperty(this.layout);

			const apiPath = this.$api.dashboard({ userId: getItem('userId') }).dashboardUserId;
			const params = {
				// layout, title, description, share
				layout: JSON.stringify(layout),
				...this.form,
			};

			this.serviceIns
				.post(apiPath, params, (status, response) => response)
				.then(response => {
					const { id } = response.data;

					this.saveDashboardThumbnail(id).finally(() => {
						this.$store.dispatch('widget/selected_dashboard', params);

						this.setDashboardList().then(() => {
							this.$router.push({
								name: 'documentDashboard',
							});
						});

						this.closeEditor();
					});
				});
		},
		updateDashboard() {
			const layout = this.removeUnusedProperty(this.layout);

			const apiPath = this.$api.dashboard({ id: this.id }).dashboardId;
			const params = {
				// layout, title, description, share
				layout: JSON.stringify(layout),
				...this.form,
				userId: getItem('userId'),
			};

			this.serviceIns
				.patch(apiPath, params, (status, response) => response)
				.then(response => {
					this.saveDashboardThumbnail(this.id).finally(() => {
						this.$store.dispatch('widget/selected_dashboard', {
							...this.getSelectedDashboard,
							...params,
						});

						this.setDashboardList();

						this.closeEditor();
					});
				});
		},
		readyToCapture() {
			this.posingLayout = document.querySelector('.dashboard-layout');

			if (!this.posingLayout) {
				this.loadingFinish = true;
			} else {
				// 1. 3d topology 뷰 이미지 전환
				this.$EventBus.$emit('DASHBOARD_SAVE_FOR_TOPOLOGY', {
					completed: false,
				});
				// const svgElements = this.posingLayout.querySelectorAll('img');
				//
				// svgElements.forEach(item => {
				// 	item.setAttribute('width', item.getBoundingClientRect().width);
				// 	item.style.width = null;
				// });

				// 2. 이미지 캡쳐
				html2canvas(this.posingLayout, {
					// logging: true,
					// letterRendering: 1,
					// allowTaint: true,
					// useCORS: true,
				}).then(canvas => {
					canvas.toBlob(blob => {
						this.thumbnailBlob = blob;
						this.loadingFinish = true;
					}, 'image/png');

					// 3. 3d topology 뷰 캔버스 재생
					this.$EventBus.$emit('DASHBOARD_SAVE_FOR_TOPOLOGY', {
						completed: true,
					});
				});
			}
		},
		closeEditor() {
			this.$EventBus.$emit('DASHBOARD_SAVE_POPUP_CLOSE');
			this.$store.dispatch('params/main_layer_popup', { show: false });
		},
	},
	destroyed() {},
};
</script>

<style lang="scss" scoped>
.xai-dashboard-save-popup {
	height: 100%;
	width: 100%;

	.dashboard-save-popup-loading {
		top: -5px;
		left: -10px;
		height: calc(100% + 10px);
		width: calc(100% + 20px);
	}
}

.xai-dashboard-save-popup-editor {
	height: 100%;
	padding: 10px;
	@include flex-align($d: column);

	.xai-dashboard-save-popup-item1 {
		flex: 1;

		.xai-dashboard-thumbnail {
			text-align: center;
			height: 130px;
			margin: auto auto 10px;
			display: block;
			box-sizing: border-box;

			.xai-dashboard-thumbnail-image {
				height: 100%;
			}

			&.empty {
				width: 70%;
				@include flex-align($w: wrap);
				padding: 8px;
				border: solid 1px #717171;
			}

			.xai-dashboard-thumbnail-widget {
				border: solid 1px #717171;
				width: calc(100% / 3 - 4px);
				height: calc(100% / 3 - 4px);
				margin: 2px;
			}
		}

		.xai-dashboard-save-popup-item {
			margin-bottom: 10px;

			.xai-dashboard-share-switch {
				margin-left: 10px;
			}
		}
	}

	.xai-dashboard-save-popup-item3 {
		flex: 1;
		@include flex-align($a: center, $j: flex-end);
	}
}
</style>
