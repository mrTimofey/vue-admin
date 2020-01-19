import MasterComponent from './master.vue';

function $notify(message, opts) {
	// eslint-disable-next-line
	return $notify._masterComponent.pushMessage(message, opts);
}

$notify.setMasterComponent = function(comp) {
	if (this._masterComponent)
		throw new Error('Vue notifications plugin: there must only one notifications instance (trying to create a second instance)');
	this._masterComponent = comp;
};

export { MasterComponent };
export default {
	install(Vue) {
		Vue.prototype.$notify = $notify;
	},
};
