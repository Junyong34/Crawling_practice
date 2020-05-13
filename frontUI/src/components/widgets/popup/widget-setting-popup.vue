<template>
	<div class="widget-setting-popup">
		<el-tabs
			ref="settingTabs"
			v-model="activeTab"
			tab-position="left"
			style="height: 100%; width: 100%;"
		>
			<el-tab-pane name="type" style="height: 100%;">
				<span slot="label">Type</span>
				<div class="collapse-content">
					<div class="type-title">Type</div>
					<div class="type-select-area">
						<div class="widget-type-list">
							<template v-for="(item, key) in getWidgetFormatList">
								<div
									:key="key"
									v-if="key !== 'empty'"
									:class="[
										'widget-type',
										selectedWidgetFormat === item ? 'selected-item' : null,
									]"
									@click="onSelectedWidgetFormat(key, item)"
								>
									{{ camelToUpperSpacing(key) }}
								</div>
							</template>
						</div>
					</div>
				</div>
				<div class="btn-wrap">
					<el-button
						size="small"
						type="primary"
						class="next-btn"
						:disabled="!selectedWidgetFormat"
						@click="activeTab = 'general'"
						>Next
					</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane name="general">
				<span slot="label">General</span>
				<div class="collapse-content">
					<div class="type-title">General</div>
					<general-form :ii="i" :form="generalForm" />
				</div>
				<div class="btn-wrap">
					<el-button size="small" type="primary" class="prev-btn" @click="onSubmit"
						>Submit
					</el-button>
					<el-button
						size="small"
						type="primary"
						class="next-btn"
						@click="activeTab = 'type'"
						>Prev
					</el-button>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import GeneralForm from '@/components/widgets/popup/etc/general-form';

export default {
	name: 'widget-setting-popup',
	components: { GeneralForm },
	data() {
		return {
			activeTab: 'type',
			generalForm: {
				title: null,
				description: null,
				options: [],
			},
			selectedWidgetFormat: null,
		};
	},
	props: {
		i: { type: String, default: null },
		widget: { type: Object, default: () => ({}) },
		component: { type: Object, default: () => ({}) },
	},
	watch: {},
	computed: {
		...mapGetters({
			getWidgetFormatList: 'widget/getWidgetFormatList',
		}),
	},
	created() {
		this.generalForm.title = this.widget.title;
		this.generalForm.description = this.widget.description;
	},
	mounted() {
		this.$nextTick(() => {
			if (this.widget.body !== 'empty-view') {
				this.selectedWidgetFormat = this.getWidgetFormatList[
					this.kebabToCamel(this.widget.body.replace('-view', ''))
				];
			}
		});
	},
	beforeDestroy() {},
	methods: {
		kebabToCamel(str) {
			const upperWords = str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
			const joinWord = upperWords.join('');

			return joinWord.charAt(0).toLowerCase() + joinWord.slice(1);
		},
		camelToUpperSpacing(str) {
			const upper = /([A-Z])/g;
			const replaceText = str.replace(upper, s => ` ${s.toLowerCase()}`);

			return replaceText.charAt(0).toUpperCase() + replaceText.slice(1);
		},
		onSubmit() {
			const widgetFormat = this.selectedWidgetFormat;

			const data = {
				minW: widgetFormat.minW,
				minH: widgetFormat.minH,
				maxW: widgetFormat.maxW,
				maxH: widgetFormat.maxH,
				widget: {
					...widgetFormat.widget,
					title: this.generalForm.title,
					description: this.generalForm.description,
				},
				component: widgetFormat.component,
			};

			if (this.component.api.constructor === Object) {
				if (this.component.api.uri === widgetFormat.component.api.uri) {
					data.component.api = this.component.api;
				}
			}

			this.closePopup();

			this.$EventBus.$emit('UPDATE_WIDGET', this.i, data);
		},
		closePopup() {
			this.$store.dispatch('paramsGlobal/main_layer_popup', { show: false });
		},
		onSelectedWidgetFormat(key, item) {
			this.selectedWidgetFormat = item;
		},
	},
};
</script>

<style lang="scss" scoped>
$gap: 8px;

/deep/ .el-tabs {
	.el-tabs__header {
		&.is-left {
			width: 15%;
		}
	}

	.el-tabs__item {
		color: #fff;

		&.is-disabled {
			color: #c0c4cc;
			cursor: not-allowed;
		}

		&.is-active {
			color: #2172ff;
		}
	}

	.el-tabs__active-bar {
		background-color: #2172ff;
	}

	&.el-tabs--left > .el-tabs__content {
		height: 100%;

		.el-tab-pane {
			height: 100%;
		}
	}
}

.widget-setting-popup {
	height: 100%;
	overflow: hidden;
	padding: 5px 0;

	.header-icon {
		color: #1cbe85;
		margin-left: 10px;
	}

	.collapse-content {
		height: calc(100% - 48px);
		overflow-y: auto;
		@include flex-align($d: column);
		padding: $gap;

		.type-title {
			margin-bottom: 5px;
			margin-left: 5px;
			font-size: 24px;
		}

		.type-hr {
			@include xai-get-style(border-color, background, filterBorder);
			margin-bottom: $gap * 2;
		}

		.type-select-area {
			@include flex-align();
			height: 100%;
			width: 100%;
			padding: $gap;

			.widget-type-list {
				@include flex-align();
				height: 100%;
				width: 100%;
				align-content: flex-start;
				flex-wrap: wrap;
				overflow-y: auto;

				.widget-type {
					@include flex-align($a: center, $j: center);
					@include xai-get-style(background-color, button, item);
					position: relative;
					background-color: #000;
					width: calc(100% / 3 - #{$gap});
					height: calc(25% - #{$gap});
					margin: $gap/2;
					border-radius: 5px;
					cursor: pointer;
					transition: all 0.15s;
					text-align: center;

					&:not(.selected-item):hover {
						@include xai-get-style(background-color, button, highlight);
					}

					&.selected-item {
						@include xai-get-style(background-color, button, primary);
					}

					&.disabled-item {
						filter: contrast(40%);
						cursor: no-drop;
					}
				}
			}
		}

		.data-select-area {
			padding: $gap / 2 $gap;
			height: calc(100% - 69px);
		}
	}

	.btn-wrap {
		padding: $gap $gap;
		@include flex-align($d: row-reverse, $j: space-between);
		position: absolute;
		bottom: 0;
		width: 100%;

		.prev-btn {
		}

		.next-btn,
		.submit-btn {
		}
	}
}
</style>
