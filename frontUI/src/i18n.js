import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '@/common/lang/en.json';
import ko from '@/common/lang/ko.json';

Vue.use(VueI18n);

const messages = {
	en,
	ko,
};

const i18n = new VueI18n({
	locale: 'en', // set locale
	messages, // set locale messages
});

export default i18n;
