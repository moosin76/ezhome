<template>
  <div class="d-flex justify-center align-center" style="height: 100%">
    <v-card max-width="400" width="100%" elevation="10">
      <v-toolbar>
        <site-title />
      </v-toolbar>
      <v-tabs v-model="tabs" background-color="primary" dark>
        <v-tab v-for="item in items" :key="item" style="flex:1">
          {{ item }}
        </v-tab>
      </v-tabs>
      <v-card-text>
				<v-tabs-items v-model="tabs">
					<v-tab-item>
						<sign-in-form @save="loginLocal" :isLoading="isLoading"/>
					</v-tab-item>
					<v-tab-item>{{tabs}} 아이디</v-tab-item>
					<v-tab-item>{{tabs}} 비밀번호</v-tab-item>
				</v-tabs-items>
			</v-card-text>
			<v-card-text class="mt-n4">
				<v-btn to="/join" block >회원가입</v-btn>
			</v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SignInForm from '../../components/auth/SignInForm.vue';
import SiteTitle from "../../components/layout/SiteTitle.vue";
export default {
  components: { SiteTitle, SignInForm },
  name: "Login",
  data() {
    return {
      tabs: 0,
      items: ["로그인", "아이디 찾기", "비밀번호 찾기"],
			isLoading : false
    };
  },
	methods : {
		...mapActions('user', ['signInLocal']),
		async loginLocal(form) {
			this.isLoading = true;
			const data = await this.signInLocal(form);
			this.isLoading = false;
			if(data) {
				const mb_name = this.$store.state.user.member.mb_name;
				this.$toast.info(`${mb_name}님 환영합니다.`);
				this.$router.push('/');
			}
		}
	}
};
</script>

<style>
</style>