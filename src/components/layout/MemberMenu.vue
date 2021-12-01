<template>
  <div>
    <v-card-actions>
      <v-btn color="primary" @click="$emit('open')" block>회원정보수정</v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn color="secondary" @click="logout" block>로그아웃</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "MemberMenu",
	computed : {
		...mapState({
			member : state => state.user.member,
		})
	},
  methods: {
    ...mapActions("user", ["signOut"]),
    async logout() {
      const mb_name = await this.signOut();
      if (mb_name) {
        this.$toast.info(`${mb_name}님 로그아웃 하였습니다.`);
        if (this.$route.name != "Home") {
          this.$router.push("/");
        }
      }
    },
  },
};
</script>

<style>
</style>