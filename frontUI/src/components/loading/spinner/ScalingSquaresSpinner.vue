<template>
	<scaling-squares-spinner :animation-duration="duration" :size="size" :color="color" />
</template>

<script>
import { ScalingSquaresSpinner } from 'epic-spinners';

export default {
	name: 'ScalingSquaresSpinner',
	components: { ScalingSquaresSpinner },
	props: {
		duration: {
			type: Number,
			default: 1250,
		},
		size: {
			type: Number,
			default: 65,
		},
		color: {
			type: String,
			default: '#007bff',
		},
	},
};
</script>
