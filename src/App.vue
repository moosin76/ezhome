<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

     <v-btn to="/">Home</v-btn>
		 <v-btn to="/about">About</v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>

		<vue-progress-bar></vue-progress-bar>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
	beforeCreate() {
		console.log('App.vue beforeCreate');
	},
	created() {
		console.log('App.vue created', this.$ssrContext);
	},
	beforeMount() {
		console.log('App.vue beforeMount');
	},
	mounted() {
		console.log('App.vue mounted');
	},
	serverPrefetch() {
		console.log('App.vue serverPrefetch');
		return new Promise((resolve, reject)=> {
			console.log('App.vue serverPrefetch Promise');
			resolve();
		})
	}
};
</script>
