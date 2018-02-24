export default {
	functional: true,
	props: {
		value: Boolean,
		icon: null,
		text: null,
		color: null
	},
	render(h, { props }) {
		const v = props.value,
			icon = (props.icon === undefined || props.icon === true) ? {} : props.icon,
			color = (props.color === undefined || props.color === true) ? {} : props.color;

		function iconClass() {
			if (v === true) return icon.checked || 'check';
			if (v === false) return icon.unchecked || 'times';
			return icon.unknown || 'question-circle';
		}

		function rootClass() {
			if (!color) return null;
			if (v === true) return 'text-' + (color.checked || 'primary');
			if (v === false) return 'text-' + (color.unchecked || 'normal');
			return 'text-' + (color.unknown || 'muted');
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
			icon && h('i', { class: ['fas', 'fa-' + iconClass()]}),
			' ',
			text && h('span', { domProps: { innerHTML: text } })
		]);
	}
};
