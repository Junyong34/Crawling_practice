<template>
	<pixel-spinner :animation-duration="duration" :size="size" :color="color" />
</template>

<script>
import { PixelSpinner } from 'epic-spinners';

export default {
	name: 'PixelSpinner',
	components: { PixelSpinner },
	props: {
		duration: {
			type: Number,
			default: 2000,
		},
		size: {
			type: Number,
			default: 70,
		},
		color: {
			type: String,
			default: '#007bff',
		},
	},
};
</script>
