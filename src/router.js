import Vue from 'vue';
import Router from 'vue-router';
import qs from 'qs';

import { filenameToCamelCase, requireAll } from 'src/utils';

import EntityGenericIndex from 'src/pages/entity/_generic/index.vue';
import EntityGenericItem from 'src/pages/entity/_generic/item.vue';

Vue.use(Router);

const routes = [];
let route404, pathMap;

if (process.env.NODE_ENV !== 'production') pathMap = {};

// register all components in directory as routes (excepting files/folders starting from "_")
requireAll(require.context('src/pages/', true, /^(?:(?!\/?_).)+\.(vue|js)$/), (component, name) => {
	/** @namespace component.routeMeta */
	/** @namespace component.routeProps */
	const route = {
		component,
		// generate route path based on file path
		// remove file extension and '/index'
		path: name.substr(1).replace(/(\/index)?\.[a-zA-Z0-9]+$/, '') +
			// allow components adding their own route parameters
			(component.routePath ? ('/' + component.routePath) : ''),
		// add meta fields if there are any
		meta: component.routeMeta
	};

	if (route.path === '/404') {
		// generate component name automatically
		if (!component.name) component.name = 'NotFoundPage';

		route.path = '*';
		if (!route.meta) route.meta = { statusCode: 404 };
		else if (!route.meta.statusCode) route.meta.statusCode = 404;
		route404 = route;
	}
	else {
		if (route.path === '') route.path = '/';
		// generate component name automatically
		if (!component.name) component.name = filenameToCamelCase(name) + 'Page';

		// let components create their own sub routes
		if (component.routes) route.children = component.routes;
		// map route parameters to component props by default
		route.props = component.routeProps === undefined ? true : component.routeProps;

		if (process.env.NODE_ENV !== 'production') {
			if (pathMap[route.path])
				throw new Error(`Duplicate path in vue router: ${route.path}, components are: ${pathMap[route.path]}, ${name}`);
			pathMap[route.path] = name;
		}
		routes.push(route);
	}
});

// catch-all route (404)
if (route404) routes.push(route404);

// register generic entity routes
routes.push({
	component: EntityGenericIndex,
	path: '/entity/:entity',
	props: true
});
routes.push({
	component: EntityGenericItem,
	path: '/entity/:entity/item/:id',
	props: true
});

// noinspection JSUnresolvedVariable
export default new Router({
	routes,
	base: routerBasePath,
	mode: 'history',
	linkActiveClass: 'active',
	linkExactActiveClass: 'exact-active',
	scrollBehavior(to, from, saved) {
		return to.path === from.path ? saved : { x: 0, y: 0 };
	},
	parseQuery: q => qs.parse(q),
	stringifyQuery: q => {
		const result = qs.stringify(q);
		return result ? ('?' + result) : '';
	}
});
