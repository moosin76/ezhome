import Vue from "vue";
import vuetify from '../plugins/vuetify';
import ezNotify from './ezNotifyPlugin';

const option = {
	iconColor: 'red',
};

Vue.use(ezNotify, vuetify, option);