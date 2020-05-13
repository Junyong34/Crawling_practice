import _ from 'lodash-es';
import Component from './loadingComp.vue';

const Api = (Vue, globalProps = {}, globalSlots = {}) => {
	return {
		create(id = 'full', props = globalProps, slots = globalSlots) {
			const forceProps = {
				programmatic: true,
				id: id,
			};
			const propsData = Object.assign({}, globalProps, props, forceProps);
			const instance = new (Vue.extend(Component))({
				el: document.createElement('div'),
				propsData,
			});

			const mergedSlots = Object.assign({}, globalSlots, slots);
			Object.keys(mergedSlots).map(name => {
				instance.$slots[name] = mergedSlots[name];
			});

			this.list[id] = instance;
			return instance;
		},
		list: {},
		show(key) {
			// console.log(`hide=${key}`, this.list[key]);
			this.list[key]?.show();
		},
		hide(key) {
			// console.log(`hide=${key}`, this.list[key]);
			this.list[key]?.hide();
		},
		removeAll() {
			// console.log('removeAll');
			_.forEach(this.list, (value, key) => {
				value.remove();
				delete this.list[key];
			});
		},
	};
};

export default Api;
