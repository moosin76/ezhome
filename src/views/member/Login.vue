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
					<v-tab-item>
						<find-id-form @save="findId" :isLoading="isLoading"/>
					</v-tab-item>
					<v-tab-item>
						<find-pw-form @save="findPw" :isLoading="isLoading"/>
					</v-tab-item>
				</v-tabs-items>
			</v-card-text>
			<v-card-text class="mt-n4">
				<v-btn @click="loginGoogle" block >구글 로그인</v-btn>
			</v-card-text>
			<v-card-text class="mt-n4">
				<v-btn to="/join" block >회원가입</v-btn>
			</v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import FindIdForm from '../../components/auth/FindIdForm.vue';
import FindPwForm from '../../components/auth/FindPwForm.vue';
import SignInForm from '../../components/auth/SignInForm.vue';
import SiteTitle from "../../components/layout/SiteTitle.vue";
export default {
  components: { SiteTitle, SignInForm, FindIdForm, FindPwForm },
  name: "Login",
  data() {
    return {
      tabs: parseInt(this.$route.query.tabs) || 0,
      items: ["로그인", "아이디 찾기", "비밀번호 찾기"],
			isLoading : false
    };
  },
	methods : {
		...mapActions('user', ['signInLocal', 'findIdLocal', 'findPwLocal']),
		...mapMutations('user', ['SET_MEMBER', 'SET_TOKEN']),
		async loginLocal(form) {
			this.isLoading = true;
			const data = await this.signInLocal(form);
			this.isLoading = false;
			if(data) {
				const mb_name = this.$store.state.user.member.mb_name;
				this.$toast.info(`${mb_name}님 환영합니다.`);
				this.$router.push('/');
			}
		},
		async findId(form) {
			this.isLoading = true;
			const data = await this.findIdLocal(form);
			this.isLoading = false;
			if(data && data.mb_id) {
				await this.$ezNotify.alert(
					`<span style="font-size:1.5em">회원 아이디 : [ <b>${data.mb_id}</b> ]</span>`,
					'아이디 찾기 결과'
				);
				this.tabs = 0;
			}
		},
		async findPw(form) {
			this.isLoading = true;
			const data = await this.findPwLocal(form);
			this.isLoading = false;
			if(data) {
				await this.$ezNotify.alert(
					`${data.mb_name}님<br><b>${form.mb_email}</b>로 이메일 발송하였습니다.`,
					'이메일 발송 성공'
				);
				this.tabs = 0;
			}
		},
		async loginGoogle() {
			window.open(
				'/api/member/loginGoogle',
				'googleAuth',
				"top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizeable=no"
			);
			if(!window.onGoogleCallback) {
				window.onGoogleCallback = this.googleLoginCallback;
			}
		},
		googleLoginCallback(payload) {
			if(payload.err) {
				this.$toast.error(payload.err);
			} else {
				this.SET_MEMBER(payload.member);
				this.SET_TOKEN(payload.token);
				this.$router.push('/');
				this.$toast.info(`${this.$store.state.user.member.mb_name}님 환영합니다.`);
			}
		}
	}
};
</script>

<style>
</style>