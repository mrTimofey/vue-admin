import { requireAll } from 'src/utils';
import { typeAliases } from 'src/utils/fields';

const components = {};
requireAll([
	require.context('src/components/displays', true, /\.(vue|js)$/),
	require.context('_local/src/components/displays', true, /\.(vue|js)$/)
], (comp, name) => {
	components[name.substr(2).replace(/\.(vue|js)$/, '')] = comp;
	if (comp.props) {
		if (Array.isArray(comp.props)) {
			if (comp.props.indexOf('title') === -1) comp.props.push('title');
			if (comp.props.indexOf('type') === -1) comp.props.push('type');
			if (comp.props.indexOf('object') === -1) comp.props.push('object');
		}
		else {
			if (!comp.props.title) comp.props.title = String;
			if (!comp.props.type) comp.props.type = String;
			if (!comp.props.object) comp.props.object = Object;
		}
	}
	// remove title tooltip on hover and add value for no-script functional components
	else comp.props = ['title', 'type', 'value', 'object'];
});

export default {
	name: 'Display',
	functional: true,
	render(h, c) {
		const comp = c.props.type && components[typeAliases[c.props.type] || c.props.type];
		return comp ?
			h(comp, c.data, c.children) :
			h('div', c.props.value === null || c.props.value === undefined ? '' : c.props.value.toString(), c.children);
	}
};
