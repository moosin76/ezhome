<template>
  <div class="d-flex justify-center align-center" style="height:100%">
    <v-card max-width="400" width="100%" elevation="10">
      <v-toolbar>
        <v-toolbar-title>회원가입</v-toolbar-title>
      </v-toolbar>
      <v-card-text> 
				<sing-up-form :cbCheckId="checkId"/> 
			</v-card-text>
    </v-card>
  </div>
</template>

<script>
import SingUpForm from "../../components/auth/SingUpForm.vue";
export default {
  components: { SingUpForm },
  name: "Join",
	methods : {
		async checkId(id) {
			console.log(id) 
			return {cnt : 0};
		}
	}
};
</script>

<style>
</style>