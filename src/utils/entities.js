import { requireAll, filenameToCamelCase } from 'src/utils';

export function guessEntityName(path) {
	return path.split('/')[2];
}

export function guessApiPath(path) {
	return 'entity/' + guessEntityName(path);
}

export function guessMetaData(store, path) {
	return store.getters.metaData[guessEntityName(path)];
}

export const components = {};
requireAll([
	require.context('src/components/entity', true, /\.(vue|js)$/),
	require.context('_local/src/components/entity', true, /\.(vue|js)$/)
], (comp, name) => {
	components['Entity' + filenameToCamelCase(name)] = comp;
});
