function inserted(el, binding) {
	const callback = binding.value;
	const options = binding.options || { passive: true };

	window.addEventListener('resize', callback, options);
	el._onResize = {
		callback,
		options,
	};
	if (!binding.modifiers || !binding.modifiers.quiet) {
		callback();
	}
}

function unbind(el) {
	if (!el._onResize) return;
	const elOnResize = el._onResize;

	const callback = elOnResize.callback;
	const options = elOnResize.options;

	window.removeEventListener('resize', callback, options);
	delete el._onResize;
}

export default {
	inserted,
	unbind,
};
// # sourceMappingURL=resize.js.map
