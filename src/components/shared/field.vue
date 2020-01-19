<script>
	import { requireAll, filenameToCamelCase } from 'src/utils';
	import { typeAliases } from 'src/utils/fields';

	const components = {},
		fieldsProps = {},
		autoProps = ['title', 'type', 'object'];
	requireAll([
		require.context('src/components/fields', true, /\.(vue|js)$/),
		require.context('_local/src/components/fields', true, /\.(vue|js)$/),
	], (comp, name) => {
		components['Field' + filenameToCamelCase(name)] = comp;
		if (comp.props) {
			if (Array.isArray(comp.props)) {
				for (let name of comp.props) fieldsProps[name] = null;
				for (const prop of autoProps) if (comp.props.indexOf(prop) === -1) comp.props.push(prop);
			}
			else {
				for (let name of Object.keys(comp.props)) fieldsProps[name] = null;
				for (const prop of autoProps) if (!comp.props.hasOwnProperty(prop)) comp.props[prop] = {};
			}
		}
		// remove title tooltip on hover
		else comp.props = ['title', 'type'];
	});

	// noinspection JSUnusedGlobalSymbols
	export default {
		name: 'Field',
		components,
		props: {
			...fieldsProps,
			type: {
				type: String,
				default: 'text',
			},
			object: Object,
			errors: [String, Array, Object],
			title: String,
			stagger: Number,
		},
		data: () => ({
			typeAliases,
		}),
		computed: {
			errorsText() {
				if (!this.errors) return null;
				if (Array.isArray(this.errors)) return this.errors.join(', ');
				if (typeof this.errors === 'string') return this.errors;
				return null;
			},
		},
		methods: {
			update(value) {
				if (this.stagger) {
					clearTimeout(this.staggerTimeout);
					this.staggerTimeout = setTimeout(() => {
						if (this.value !== value) this.$emit('input', value);
					}, this.stagger);
				}
				else this.$emit('input', value);
			},
		},
	};
</script>
<template lang="pug">
	.form-group(:class="{ 'has-error': errorsText !== null }")
		.field-title(v-if="title" v-html="title" :class="{ 'text-danger': errors }")
		!=' '
		component.field(:is="'field-' + (typeAliases[type] || type)" v-bind="$props" @input="update($event)")
		!=' '
		span.help-block(v-if="errorsText") {{ errorsText }}
</template>
<style lang="stylus">
	.field-title
		font-weight 700
		margin-bottom 5px
	.form-group.inline
		display inline-block
		.field-title, .field
			display inline-block
			vertical-align middle
			margin 0
		.form-control
			width auto
	.form-group .form-group.inline
		margin-bottom 0
</style>