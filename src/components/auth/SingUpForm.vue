<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <v-btn type="submit" block color="primary">회원가입</v-btn>
  </v-form>
</template>

<script>
export default {
  name: "SignUpForm",
  data() {
    return {
      valid: true,
      form: {
        mb_id: "",
        mb_password: "",
        mb_name: "",
        mb_birth: "",
        mb_gender: "",
        mb_email: "",
        mb_phone: "",
        mb_zip: "",
        mb_addr1: "",
        mb_addr2: "",
      },
    };
  },
  methods: {
    save() {
      console.log(this.form);
    },
  },
};
</script>

<style>
</style>