<script>
	let idCounter = 1;

	function uid() {
		return idCounter++;
	}

	export default {
		props: {
			value: Array,
			disabled: {
				type: Boolean,
				default: false
			},
			itemProps: Object,
			itemDefault: null,
			length: Number,
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: Infinity
			},
			addLabel: String,
			errors: null
		},
		data: () => ({
			keys: null
		}),
		computed: {
			valueLength() {
				if (this.length) return this.length;
				// noinspection JSCheckFunctionSignatures
				return Math.max(this.value ? this.value.length : 0, this.min);
			}
		},
		methods: {
			emitInternal(v) {
				this.internalInput = true;
				this.$emit('input', v);
			},
			updateItem(i, v) {
				if (this.disabled) return;
				let value = this.value ? [...this.value] : [];
				if (this.length && value.length !== this.length) {
					const newValue = [];
					for (let k = 0; k < this.length; ++k)
						newValue[i] = value[i] === undefined ? null : value[i];
					value = newValue;
				}
				else {
					while (value.length < this.min) value.push(null);
					if (value.length > this.max) value.length = this.max;
				}
				if (i < value.length) value[i] = v;
				this.emitInternal(value);
			},
			addItem() {
				if (this.disabled) return;
				const value = this.value ? [...this.value] : [];
				do {
					value.push(this.itemDefault === undefined ? null : this.itemDefault);
					this.keys.push(uid());
				}
				while (value.length <= this.min);
				this.emitInternal(value);
			},
			removeItem(i) {
				if (this.disabled) return;
				const value = [...this.value];
				value.splice(i, 1);
				this.emitInternal(value);
				this.keys.splice(i, 1);
			}
		},
		watch: {
			value: {
				immediate: true,
				handler() {
					if (!this.internalInput || !this.keys) {
						this.keys = [];
						while (this.keys.length !== this.valueLength) this.keys.push(uid());
					}
					this.internalInput = false;
				}
			}
		}
	};
</script>
<template lang="pug">
	.field-array
		table.table(v-if="keys && valueLength > 0"): tbody
			tr(v-for="num in valueLength" ':key'="keys[num - 1]")
				td.td-field
					field(v-bind="itemProps"
						':value'="value && value[num - 1] || null"
						':disabled'="disabled"
						':errors'="errors && errors[num - 1]"
						'@input'="updateItem(num - 1, $event)")
				td.td-actions(v-if="!length && valueLength > min")
					.btn.btn-xs.btn-danger('@click'="removeItem(num - 1)" ':disabled'="disabled"): i.fas.fa-trash
		.btn.btn-sm.btn-default(v-if="!length && valueLength < max" '@click'="addItem()" ':disabled'="disabled")
			i.fas.fa-plus
			!=' {{ addLabel }}'
</template>
<style lang="stylus">
	.field-array
		.help-block
			margin-bottom 0
		.table
			margin-bottom 5px
		.td-field
			padding-right 0
			padding-left 0
			> .form-group:last-child
				margin-bottom 0
		.td-actions
			text-align right
			width 29px
			padding 14px 0 0 0
		.field-array > .table
			margin-top -8px
		tr:first-child > td
			border-top none
		.table
			background none
</style>