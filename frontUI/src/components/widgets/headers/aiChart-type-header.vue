<template>
	<div
		:class="['widget-header']"
		ref="widgetHeader"
		@mouseenter="isHover = true"
		@mouseleave="isHover = false"
	>
		<div class="widget-header-title">
			<img
				:src="require(`@/assets/svg/common/${header.frame}.svg`)"
				style="width: 15px; height: 15px; margin-right: 3px;"
			/>
			{{ title }} -
			{{ header.type }}
		</div>
		<div class="widget-header-btn-wrap">
			<template v-if="!maximize">
				<div v-if="this.static" class="widget-header-btn static-btn" />
				<widget-menu
					v-if="widgetHandler && widgetHandler.length"
					v-on="$listeners"
					:handler="widgetHandler"
				/>
			</template>
			<div v-else>
				<i
					class="el-icon-close"
					style="cursor: pointer"
					@click="
						() => {
							$emit('maximize');
						}
					"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import WidgetMenu from '@/components/widgets/etc/widget-menu-dropdown';

export default {
	name: 'aichart-type-header',
	inheritAttrs: false,
	components: {
		WidgetMenu,
	},
	props: {
		title: {
			type: String,
		},
		static: {
			type: Boolean,
			default: false,
		},
		maximize: {
			type: Boolean,
			default: false,
		},
		widgetHandler: {
			type: Array,
			default: () => [],
		},
		widgetInfoList: {
			type: Object,
			default: () => ({}),
		},
		component: {
			type: Object,
			default: () => ({}),
		},
		header: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			x: 0,
			y: 0,
			isOpen: false,
			showInfo: false,
			isHover: false,
		};
	},
	created() {},
	mounted() {},
	watch: {},
	computed: {
		staticImgName() {
			return this.static ? 'static' : 'un-static';
		},
		isShow() {
			return this.title || this.isHover;
		},
	},
	methods: {
		infoHandler(data) {
			this.showInfo = this.showInfo ? false : data;
		},
		minimizeHandler() {
			this.$emit('minimize');
		},
		maximizeHandler() {
			this.$emit('maximize');
			this.changeToggle();
		},
		staticHandler() {
			this.$emit('static');
		},
		closeHandler() {
			this.$emit('close');
		},
		changeToggle() {
			this.y = 30;
			this.x = this.$refs.widgetHeader.clientWidth;

			this.isOpen = !this.isOpen;
		},
		refreshHandler() {
			this.$emit('refresh');
		},
	},
};
</script>

<style lang="scss" scoped>
.widget-header-title {
	@include flex-align($a: center);
	@include skip-text();
	padding-left: 10px;
	font-family: Roboto, sans-serif;
	font-size: 15px;
	font-weight: bold;
	font-style: normal;
	font-stretch: normal;
	flex: 1;
}

.widget-header-btn-wrap {
	@include flex-align($a: center);

	> * {
		margin-right: 4px;
	}
	margin-left: 4px;

	.widget-header-btn {
		&.static-btn {
			height: 14px;
			width: 16px;
			mask: url('../../../assets/svg/widget/static.svg');
			mask-size: contain;
			mask-repeat: no-repeat;
			mask-position: center;
			background-color: #666666;
		}
	}
}

/*.widget-header-btn-wrap {*/
/*    margin-right: 5px;*/
/*    display: flex;*/
/*    align-items: center;*/

/*    .widget-header-btn {*/
/*        margin-right: 5px;*/
/*        flex: 1;*/
/*        display: flex;*/
/*        align-items: center;*/
/*        height: 10px;*/
/*        cursor: pointer;*/
/*    }*/

/*    .info-btn {*/
/*        height: 14px;*/
/*    }*/
/*}*/

.widget-info-wrap {
	@include flex-align($d: column);
	max-width: 230px;

	.info {
		@include flex-align($a: center);
		border-bottom: 1px solid #5e5e5e;
		width: 100%;
		padding: 2px 0;
	}

	.info-key {
		width: 20%;
		min-width: 80px;
		text-align: center;
		padding: 2.5px 0;
	}

	.info-value {
		@include flex-align($w: wrap);
		max-width: calc(80% - 20px);
		padding: 2.5px 10px 2.5px 10px;

		.info-tag {
			margin: 1px;
		}
	}

	.tag:not(:last-child) {
		margin-right: 2px;
	}
}
</style>
