/* eslint no-invalid-this:0 */

export function emitValue({ target }) {
	if (target.value !== this.value) this.$emit('input', target.value);
}

export function trimValue({ target }) {
	const trimmed = target.value.trim();
	if (target.value !== trimmed) this.$emit('input', trimmed);
}

export function transformedOptions() {
	const options = [];

	if (Array.isArray(this.options)) for (let opt of this.options) {
		if (typeof opt === 'object') {
			let value = this.valueField ? opt[this.valueField] : (opt.id || opt.value);
			options.push({
				value,
				label: this.labelField ? opt[this.labelField] : (opt.label || opt.title || opt.name || value)
			});
		}
		else options.push({
			value: opt,
			label: opt.toString()
		});
	}
	else for (let value of Object.keys(this.options)) {
		options.push({
			value,
			label: this.options[value]
		});
	}

	return options;
}
