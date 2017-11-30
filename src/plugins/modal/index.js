import MasterComponent from './master';
const $modal = {
	open(name, props, size) {
		return this._masterComponent.openModal(name, props, size);
	},
	close(result) {
		this._masterComponent.close(result);
	}
};

Object.defineProperty($modal, 'masterComponent', {
	set(comp) {
		if (this._masterComponent)
			throw new Error('Vue modal plugin: there must only one modal instance (trying to create a second instance)');
		this._masterComponent = comp;
	},
	get() {
		return this._masterComponent;
	}
});

export { MasterComponent };
export default {
	install(Vue) {
		Vue.prototype.$modal = $modal;
	}
};
