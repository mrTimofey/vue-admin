<script>
	import { requireAll, filenameToCamelCase } from 'src/utils';

	const components = {},
		fieldsProps = {};
	requireAll(require.context('src/components/fields', true, /\.(vue|js)$/), (comp, name) => {
		components['Field' + filenameToCamelCase(name)] = comp;
		if (comp.props) {
			if (Array.isArray(comp.props)) {
				for (let name of comp.props) fieldsProps[name] = null;
				// remove title tooltip on hover
				if (comp.props.indexOf('title') === -1) comp.props.push('title');
				if (comp.props.indexOf('type') === -1) comp.props.push('type');
			}
			else {
				for (let name of Object.keys(comp.props)) fieldsProps[name] = null;
				// remove title tooltip on hover
				if (!comp.props.title) comp.props.title = String;
				if (!comp.props.type) comp.props.type = String;
			}
		}
		// remove title tooltip on hover
		else comp.props = ['title', 'type'];
	});

	export default {
		name: 'Field',
		components,
		props: {
			...fieldsProps,
			type: {
				type: String,
				default: 'text'
			},
			errors: [String, Array],
			title: String
		},
		data: () => ({
			aliases: {
				boolean: 'checkbox',
				string: 'text',
				integer: 'number',
				int: 'number'
			}
		}),
		computed: {
			errorsText() {
				return Array.isArray(this.errors) ? this.errors.join(', ') : this.errors;
			}
		}
	};
</script>
<template lang="pug">
	.form-group(':class'="{ 'has-error': errors }")
		.field-title(v-if="title" v-html="title" ':class'="{ 'text-danger': errors }")
		!=' '
		component.field(':is'="'field-' + (aliases[type] || type)" v-bind="$props" '@input'="$emit('input', $event)")
		!=' '
		span.help-block(v-if="errors") {{ errorsText }}
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