<template>
	<flower-spinner :animation-duration="duration" :size="size" :color="color" />
</template>

<script>
import { FlowerSpinner } from 'epic-spinners';

export default {
	name: 'FlowerSpinner',
	components: { FlowerSpinner },
	props: {
		duration: {
			type: Number,
			default: 2500,
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
