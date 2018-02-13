<script>
	export default {
		name: 'Display',
		functional: true
	};
</script>
<template functional lang="pug">
	component(v-if="props.component" ':is'="component" v-bind="props")
	span(v-else-if!="props.type === 'int' || props.type === 'integer'") {{ props.value * 1 }}
	span(v-else-if!="props.type === 'float'") {{ (props.value || 0) | floatFormat(props.precision) }}
	span(v-else-if!="props.type === 'bool' || props.type === 'boolean'")
		field.readonly(v-if="props.value !== null" type="checkbox" disabled ':value'="props.value")
	span(v-else-if!="props.type === 'datetime'") {{ props.value | readableDatetime }}
	span(v-else-if!="props.type === 'date'") {{ props.value | readableDate }}
	span(v-else-if!="props.type === 'json'"): pre(v-if!="props.value !== null") {{ props.value | json }}
	span(v-else-if!="props.type === 'array'")
		div(v-if="props.value && props.value.length" v-for="(item, i) in props.value"): display(':value'="item" type="props.itemType")
	span(v-else-if="props.type === 'file'")
		a(v-if="props.value" target="_blank" ':href'="props.value"): i.fa.fa-download
	span(v-else-if="props.type === 'image'")
		a.img-thumbnail(v-if="props.value" target="_blank" ':href'="parent.$store.getters.imagePath + '/' + props.value")
			img(':src'!="parent.$store.getters.imagePath + '/' + (props.value.endsWith('.svg') ? '' : (props.pipe || 'admin-thumb')) + '/' + props.value")
	span(v-else-if="props.type === 'gallery'")
		a.img-thumbnail(v-for="item in props.value" target="_blank" ':href'="parent.$store.getters.imagePath + '/' + item.id")
			img(':src'!="parent.$store.getters.imagePath + '/' + (item.id.endsWith('.svg') ? '' : (props.pipe || 'admin-thumb')) + '/' + item.id")
	span(v-else-if="props.type === 'relation'")
		template(v-if="Array.isArray(props.value)")
			span(v-for="(item, i) in props.value")
				span(v-if="i !== 0")!='&nbsp; '
				span.label.label-info {{ (props.display || '\{\{ name \}\} [\{\{ id \}\}]') | placeholders(item) }}
		span(v-else-if="props.value") {{ (props.display || '\{\{ name \}\} [\{\{ id \}\}]') | placeholders(props.value) }}
	div(v-else-if="props.type === 'html'" v-html="props.value")
	span(v-else) {{ props.value }}
</template>