<template>
	<hollow-dots-spinner
		:animation-duration="duration"
		:dots-num="dotsNum"
		:dot-size="dotSize"
		:color="color"
	/>
</template>

<script>
import { HollowDotsSpinner } from 'epic-spinners';

export default {
	name: 'HollowDotsSpinner',
	components: { HollowDotsSpinner },
	props: {
		duration: {
			type: Number,
			default: 1000,
		},
		dotSize: {
			type: Number,
			default: 15,
		},
		dotsNum: {
			type: Number,
			default: 3,
		},

		color: {
			type: String,
			default: '#007bff',
		},
	},
};
</script>
