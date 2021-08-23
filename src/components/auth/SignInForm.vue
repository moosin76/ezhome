<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <v-text-field label="아이디" v-model="form.mb_id" :rules="rules.id()" />
    <input-password
      label="비밀번호"
      v-model="form.mb_password"
      :rules="rules.password()"
    />
    <v-btn block color="primary" type="submit" :loading="isLoading">
      로그인
    </v-btn>
  </v-form>
</template>

<script>
import validateRules from "../../../util/validateRules";
import InputPassword from "../InputForms/InputPassword.vue";
export default {
  components: { InputPassword },
  name: "SignInForm",
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      form: {
        mb_id: "test4",
        mb_password: "abcd1234",
      },
    };
  },
  computed: {
    rules: () => validateRules,
  },
  methods: {
    async save() {
			this.$refs.form.validate();
			await this.$nextTick();
			if(!this.valid) return;
			this.$emit('save', this.form);
		},
  },
};
</script>

<style>
</style>