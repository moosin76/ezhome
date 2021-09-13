<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <v-text-field label="아이디" v-model="form.mb_id" :rules="rules.id()" />
    <v-text-field
      label="이메일"
      v-model="form.mb_email"
      :rules="rules.email()"
    />
    <v-btn block color="primary" type="submit" :loading="isLoading">
      비밀번호 찾기
    </v-btn>
  </v-form>
</template>

<script>
import validateRules from "../../../util/validateRules";
export default {
  name: "FindPwForm",
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
        mb_id: "",
        mb_email: "",
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
      if (!this.valid) return;
      this.$emit("save", this.form);
    },
  },
};
</script>

<style>
</style>