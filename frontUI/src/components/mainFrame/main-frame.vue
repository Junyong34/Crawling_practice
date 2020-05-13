<template>
	<div :class="['application', `theme--${themeColor}`]" style="flex-basis: inherit;">
		<div class="application--wrap">
			<div class="xai-header">
				<header-frame />
			</div>
			<div class="xai-body">
				<content-frame />
			</div>
		</div>
		<main-layer-popup
			v-if="getMainLayerPopup.show"
			:title="getMainLayerPopup.titleLabel"
			v-bind="getMainLayerPopup"
			@close="closePopup"
		>
		</main-layer-popup>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getItem } from '@/common/LocalStorageMemager';
import HeaderFrame from '@/components/mainFrame/header-frame';
import ContentFrame from '@/components/mainFrame/content-frame';
import MainLayerPopup from '@/components/etc/layerPopup';

export default {
	name: 'MainFrame',
	components: {
		HeaderFrame,
		ContentFrame,
		MainLayerPopup,
	},
	props: {},
	computed: {
		...mapGetters({
			getMainLayerPopup: 'params/getMainLayerPopup',
		}),
	},
	watch: {
		getNotification: {
			handler(d) {
				this.$nextTick(() => {});
			},
			immediate: true,
		},
	},
	data() {
		return {
			themeColor: '',
			err: false,
			vm: null,
			info: null,
		};
	},
	created() {
		this.themeColor = getItem('themeColor') || 'dark';
		this.$i18n.locale = getItem('language') === null ? 'ko' : getItem('language');
	},
	mounted() {
		this.$nextTick(() => {});
	},
	beforeDestroy() {},
	destroy() {},
	methods: {
		closePopup() {
			this.$store.dispatch('params/main_layer_popup', { show: false });
		},
	},
	errorCaptured(err, vm, info) {
		this.err = err;
		this.vm = vm;
		this.info = info;

		return true;
	},
};
</script>
<style lang="scss">
.application {
	@include xai-get-style(background-color, background, main);
	@include xai-get-style(color, color, primary);
	display: flex;
	line-height: 1.5;
	font-family: 'Roboto', sans-serif;
}

.application--wrap {
	@include flex-align($d: column);
	flex: 1 1 auto;
	backface-visibility: hidden;
	min-height: 100vh;
	max-width: 100%;
	position: relative;

	.xai-header {
		display: flex;
		height: 48px;
		width: 100%;
		z-index: 10;
	}

	.xai-body {
		position: absolute;
		height: 100%;
		width: 100%;
		padding-top: 48px;
	}
}
</style>
