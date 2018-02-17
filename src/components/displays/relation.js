import parsePlaceholders from 'src/filters/placeholders';

export default {
	functional: true,
	props: {
		value: [Object, Array],
		display: [String, Function],
		entity: String,
		color: {
			type: String,
			default: 'default'
		},
		noLink: {
			type: Boolean,
			default: false
		}
	},
	render(h, { props, parent }) {
		if (!props.value || Array.isArray(props.value) && !props.value.length) return
		const primaryKey = props.entity && parent.$store.getters.entitiesData[props.entity].primary || 'id',
			editAllowed = !parent.$store.getters.entitiesData[props.entity].permissions ||
				parent.$store.getters.entitiesData[props.entity].permissions.update !== false,
			makeTitle = item => {
				if (!props.display) {
					const title = item.title || item.name || item.label,
						key = item[primaryKey];
					return key ? (`${title} [${key}]`) : title;
				}
				if (typeof props.display === 'string') return parsePlaceholders(props.display, item);
				return props.display(item);
			},
			renderItem = (props.noLink || !props.entity || !editAllowed) ?
				item => h('span', {
					class: ['label', 'label-' + props.color],
					domProps: {
						innerHTML: makeTitle(item)
					}
				}) :
				item => h('router-link', {
					class: ['btn', 'btn-xs', 'btn-' + props.color],
					props: {
						to: `/entity/${props.entity}/item/${item[primaryKey]}`
					}
				}, [makeTitle(item)]);
		if (Array.isArray(props.value)) {
			const rendered = [];
			for (let i in props.value) {
				rendered.push(renderItem(props.value[i]));
				// divider
				if (i < props.value.length - 1) rendered.push(' ');
			}
			return h('span', {}, rendered);
		}
		return renderItem(props.value);
	}
};