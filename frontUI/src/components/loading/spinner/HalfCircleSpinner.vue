<template>
	<half-circle-spinner :animation-duration="duration" :size="size" :color="color" />
</template>

<script>
import { HalfCircleSpinner } from 'epic-spinners';

export default {
	name: 'HalfCircleSpinner',
	components: { HalfCircleSpinner },
	props: {
		duration: {
			type: Number,
			default: 1000,
		},
		size: {
			type: Number,
			default: 60,
		},
		color: {
			type: String,
			default: '#007bff',
		},
	},
};
</script>
