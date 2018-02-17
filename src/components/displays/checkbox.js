export default {
	functional: true,
	props: {
		icon: null,
		value: Boolean,
		text: null
	},
	render(h, { props }) {
		const v = props.value,
			icon = (props.icon === undefined || props.icon === true) ? {} : props.icon;

		function iconClass() {
			if (v === true) return icon.checked || 'check';
			if (v === false) return icon.unchecked || 'remove';
			return icon.unknown || 'question';
		}

		function rootClass() {
			if (v === true) return 'text-primary';
			if (v === false) return null;
			return icon.unknown || 'text-muted';
		}

		function getText() {
			if (!props.text) return false;
			if (typeof props.text === 'string') return props.text;
			if (v === true) return props.text.checked;
			if (v === false) return props.text.unchecked;
			return props.text.unknown;
		}

		const text = getText();

		return h('span', { class: rootClass() }, [
			icon && h('i', { class: ['fa', 'fa-' + iconClass()]}),
			' ',
			text && h('span', { domProps: { innerHTML: text } })
		]);
	}
};
