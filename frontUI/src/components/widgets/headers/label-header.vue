<template>
	<div class="widget-header" ref="widgetHeader">
		<div class="widget-header-btn-wrap">
			<img
				v-if="this.static"
				class="widget-header-btn static-btn"
				:src="require(`@/assets/svg/widget/static.svg`)"
				alt="static"
			/>
			<widget-menu
				v-if="widgetHandler && widgetHandler.length"
				v-on="$listeners"
				:handler="widgetHandler"
			/>
		</div>
	</div>
</template>

<script>
import WidgetMenu from '@/components/widgets/etc/widget-menu-dropdown';

export default {
	name: 'widget-header',
	components: {
		WidgetMenu,
	},
	inheritAttrs: false,
	props: {
		id: {
			type: String,
		},
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
		isEditable: {
			type: Boolean,
			default: true,
		},
		isMinimize: {
			type: Boolean,
			default: true,
		},
		isMaximize: {
			type: Boolean,
			default: true,
		},
		widgetHandler: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			x: 0,
			y: 0,
			isOpen: false,
		};
	},
	mounted() {},
	computed: {
		staticImgName() {
			return this.static ? 'static' : 'un-static';
		},
	},
	methods: {
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

			return this.isOpen;
		},
	},
};
</script>

<style lang="scss" scoped>
.widget-header {
	@include flex-align($a: center, $j: flex-end);
	user-select: none;
	position: absolute;
	background: none;
	z-index: 3;
	align-self: flex-end;
	width: 100%;

	> * {
		visibility: hidden;
	}

	&:hover {
		> * {
			visibility: visible;
		}
	}
}

.widget-header-title {
	padding-left: 12px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-family: Roboto, sans-serif;
	font-size: 12px;
	font-weight: bold;
	font-style: normal;
	font-stretch: normal;
}

.widget-header-btn-wrap {
	margin-right: 5px;
	display: flex;
	align-items: center;

	img {
		margin-right: 5px;
		flex: 1;
		display: flex;
		align-items: center;
		height: 10px;
		cursor: pointer;
	}
}

.widget-header-menu-btn:hover {
	cursor: pointer;
}
</style>
