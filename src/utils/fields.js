/* eslint no-invalid-this:0 */

export function emitValue({ target }) {
	if (target.value === '') {
		if (this.value !== null) this.$emit('input', null);
	}
	else if (target.value !== this.value) this.$emit('input', target.value);
}

export function trimValue({ target }) {
	const trimmed = target.value.trim();
	if (trimmed === '') {
		if (this.value !== null) this.$emit('input', null);
	}
	else if (trimmed !== this.value) this.$emit('input', trimmed);
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

export const typeAliases = {
	boolean: 'checkbox',
	bool: 'checkbox',
	string: 'text',
	integer: 'number',
	int: 'number',
	real: 'float',
	double: 'float',
	decimal: 'float',
	collection: 'array',
	timestamp: 'datetime'
};
