import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import { en, ko } from 'vuetify/es5/locale';

Vue.use(Vuetify);

export default new Vuetify({
	lang: {
		locales: { ko, en },
		current: 'ko'
	}
});
