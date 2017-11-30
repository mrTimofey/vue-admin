export default {
	bind(el, binding, vNode) {
		if (typeof binding.value !== 'function') {
			const compName = vNode.context.name;
			let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`;
			if (compName) warn += `Found in component '${compName}'`;
			// eslint-disable-next-line no-console
			console.warn(warn);
		}

		const bubble = binding.modifiers.bubble;
		const handler = (e) => {
			if (bubble || (!el.contains(e.target) && el !== e.target)) {
				binding.value(e);
			}
		};
		el.__vueClickOutside__ = handler;
		window.document.addEventListener('click', handler);
	},

	unbind(el) {
		window.document.removeEventListener('click', el.__vueClickOutside__);
		delete el.__vueClickOutside__;
	}
};
