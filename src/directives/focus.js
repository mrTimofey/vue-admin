export default {
	inserted(el, binding) {
		if (binding.value || !binding.hasOwnProperty('value')) setTimeout(() => {
			let target = el.querySelector('input, textarea, select, [tabindex]');
			(target || el).focus();
		}, 300);
	},
};
