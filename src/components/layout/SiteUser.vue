<template>
  <div>
    <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
    <v-menu v-else offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-on="on" v-bind="attrs">
          <display-avatar :member="member" />
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-switch
            label="Dark Theme"
            :input-value="darkMode"
            @change="setDarkMode($event)"
          ></v-switch>
        </v-card-text>
        <template>
          <member-menu v-if="member" @open="openDialog" />
          <no-member-menu v-else />
        </template>
      </v-card>
    </v-menu>
    <v-dialog v-if="member" v-model="dialog" persistent max-width="500">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>회원정보수정</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DisplayAvatar from "./DisplayAvatar.vue";
import MemberMenu from "./MemberMenu.vue";
import NoMemberMenu from "./NoMemberMenu.vue";
export default {
  components: { DisplayAvatar, NoMemberMenu, MemberMenu },
  name: "SiteUser",
  data() {
    return {
      isLoading: false,
      dialog: false,
    };
  },
  computed: {
    ...mapState({
      member: (state) => state.user.member,
    }),
    darkMode() {
      return this.$vuetify.theme.dark;
    },
  },
  mounted() {
    this.getDarkMode();
  },
  methods: {
		...mapActions('user', ['checkPassword']),
    setDarkMode(mode) {
      this.$vuetify.theme.dark = mode;
      localStorage.setItem("darkMode", mode ? "dark" : "light");
    },
    getDarkMode() {
      const mode = localStorage.getItem("darkMode") === "dark" ? true : false;
      this.$vuetify.theme.dark = mode;
    },
    async openDialog() {
      // this.dialog = true;
			// 소셜로그인 아니면 비밀번호를 확인
			if(this.member.mb_provider) {
				this.dialog = true;
			} else {
				const mb_password = await this.$ezNotify.prompt(
					"비밀번호를 입력하세요.",
					"회원정보 수정",
					{icon : "mdi-alert", formType : 'password'}
				);
				this.dialog = await this.checkPassword({mb_password});
			}
    },
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>

<style>
</style>