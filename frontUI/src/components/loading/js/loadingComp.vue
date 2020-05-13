<template>
	<div
		tabindex="0"
		class="vld-overlay is-active"
		:class="{ 'is-full-page': isFullPage }"
		:style="{ zIndex }"
		:ref="id"
	>
		<div
			class="vld-background"
			@click.prevent="cancel"
			:style="{ background: backgroundColor, opacity }"
		></div>
		<div class="vld-icon">
			<slot name="before" />
			<slot name="default">
				<template v-if="spinnerType === 'HollowDotsSpinner'">
					<hollow-dots-spinner
						:animation-duration="1000"
						:dots-num="dotsNum"
						:dot-size="dotSize"
						:color="color"
					></hollow-dots-spinner>
				</template>
				<template v-if="spinnerType === 'ScalingSquaresSpinner'">
					<scaling-squares-spinner
						:animation-duration="duration"
						:size="size"
						:color="color"
					/>
				</template>
				<template v-if="spinnerType === 'PixelSpinner'">
					<pixel-spinner :animation-duration="duration" :size="size" :color="color" />
				</template>
				<template v-if="spinnerType === 'HalfCircleSpinner'">
					<half-circle-spinner
						:animation-duration="duration"
						:size="size"
						:color="color"
					/>
				</template>
				<template v-if="spinnerType === 'FlowerSpinner'">
					<flower-spinner :animation-duration="duration" :size="size" :color="color" />
				</template>
				<template v-if="spinnerType === 'AtomSpinner'">
					<atom-spinner :animation-duration="duration" :size="size" :color="color" />
				</template>
			</slot>
			<slot name="after" />
		</div>
	</div>
</template>

<script>
// import spinners from '../spinner/index.js';
// import HollowDotsSpinner from '../spinner/HollowDotsSpinner';
import {
	HollowDotsSpinner,
	FlowerSpinner,
	HalfCircleSpinner,
	PixelSpinner,
	ScalingSquaresSpinner,
	AtomSpinner,
} from 'epic-spinners';
// import { HollowDotsSpinner } from 'epic-spinners';
import { removeElement, HTMLElement } from '../helpers.js';
import trapFocusMixin from '../trapFocusMixin.js';
// import HollowDotsSpinner from './HollowDotsSpinner';
export default {
	name: 'vue-loading',
	mixins: [trapFocusMixin],
	components: {
		HollowDotsSpinner,
		FlowerSpinner,
		HalfCircleSpinner,
		PixelSpinner,
		ScalingSquaresSpinner,
		AtomSpinner,
	},
	props: {
		id: {
			type: String,
			default: 'full',
		},
		active: {
			type: Boolean,
			default: false,
		},
		programmatic: {
			type: Boolean,
			default: true,
		},
		container: [Object, Function, HTMLElement],
		isFullPage: {
			type: Boolean,
			default: true,
		},
		transition: {
			type: String,
			default: 'fade',
		},
		canCancel: {
			type: Boolean,
			default: false,
		},
		onCancel: {
			type: Function,
			default: () => {},
		},
		backgroundColor: {
			type: String,
			default: 'black',
		},
		opacity: {
			type: Number,
			default: 0.5,
		},
		zIndex: {
			type: Number,
			default: 700,
		},
		// spinner props
		spinnerType: {
			type: String,
			default: 'AtomSpinner',
		},
		duration: {
			type: Number,
			default: 1000,
		},
		dotSize: {
			type: Number,
			default: 20,
		},
		dotsNum: {
			type: Number,
			default: 3,
		},
		size: {
			type: Number,
			default: 65,
		},

		color: {
			type: String,
			default: '#7e51ff',
		},
	},
	// watch: {
	// 	active(value) {
	// 		console.log(1111, value);
	// 		this.isActive = value;
	// 	},
	// },
	// watch: {
	// 	active: {
	// 		handler(newVal, oldVal) {
	// 			console.log('탐aaaaaaaaaaaaaaaaaaa', newVal);
	// 			this.isActive = newVal;
	// 		},
	// 		deep: true,
	// 	},
	// },
	data() {
		return {
			isActive: this.active || false,
		};
	},
	beforeMount() {
		if (this.programmatic) {
			if (this.container) {
				this.isFullPage = false;
				this.container.appendChild(this.$el);
			} else {
				document.body.appendChild(this.$el);
			}
		}
	},
	mounted() {
		// if (this.programmatic) {
		// 	this.isActive = true;
		// }

		document.addEventListener('keyup', this.keyPress);
	},
	methods: {
		cancel() {
			if (!this.canCancel || !this.isActive) return;
			this.hide();
			this.onCancel.apply(null, arguments);
		},
		show() {
			// this.$emit('show');
			// this.$emit('update:active', true);
			// if (this.programmatic) {
			// 	this.isActive = true;
			// this.$refs[this.id].style.display = 'flex';
			// }
			this.$refs[this.id].style.display = 'flex';
			// console.log('show 2', this.id, this.isActive);
		},
		hide() {
			this.$refs[this.id].style.display = 'none';
			// console.log('hide 2');
			// this.$emit('hide');
			// this.$emit('update:active', false);
			// if (this.programmatic) {
			// 	this.isActive = false;
			// }
			// this.$refs[this.id].style.display = 'none';
		},
		remove() {
			// console.log('remove 3');
			this.$destroy();
			removeElement(this.$el);
			// setTimeout(() => {
			// 	this.$destroy();
			// 	removeElement(this.$el);
			// }, 150);
		},
		keyPress(event) {
			// todo keyCode is deprecated
			if (event.keyCode === 27) this.cancel();
		},
	},
	beforeDestroy() {
		document.removeEventListener('keyup', this.keyPress);
	},
};
</script>
<style>
.vld-overlay {
	bottom: 0;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	align-items: center;
	display: none;
	justify-content: center;
	overflow: hidden;
	z-index: 1;
	user-select: none;
}

.vld-overlay.is-active {
	display: none;
}

.vld-overlay.is-full-page {
	z-index: 700;
	position: fixed;
}

.vld-overlay .vld-background {
	bottom: 0;
	left: 0;
	position: absolute;
	right: 0;
	top: 0;
	background: #fff;
	opacity: 0.5;
}

.vld-overlay .vld-icon,
.vld-parent {
	position: relative;
}
</style>
