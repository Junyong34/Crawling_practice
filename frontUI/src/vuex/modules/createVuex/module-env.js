import nameGetters from './getters-name';
import nameActions from './actions-name';
import nameMutation from './mutation-name';

const nameModule = {
	namespaced: true,
	state: {},
	mutations: nameMutation,
	actions: nameActions,
	getters: nameGetters,
};
export default nameModule;
