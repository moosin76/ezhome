<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <input-duplicate-check
      ref="id"
      v-model="form.mb_id"
      label="아이디"
      prepend-icon="mdi-account"
      counter="30"
      :rules="rules.id()"
      :cbCheck="cbCheckId"
    />

    <v-text-field
      label="이름"
      v-model="form.mb_name"
      prepend-icon="mdi-card-account-details-outline"
      :rules="rules.name()"
    />

    <input-password
      label="비밀번호"
      v-model="form.mb_password"
      prepend-icon="mdi-lock"
      :rules="rules.password()"
    />

    <input-password
      label="비밀번호 확인"
      v-model="confirmPw"
      prepend-icon="mdi-lock"
      :rules="[rules.matchValue(form.mb_password)]"
    />

    <input-duplicate-check
      ref="email"
      v-model="form.mb_email"
      label="이메일"
      prepend-icon="mdi-email"
      :rules="rules.email()"
      :cbCheck="cbCheckEmail"
    />

    <input-date
      v-model="form.mb_birth"
      label="생년월일"
      prepend-icon="mdi-calendar"
      :rules="rules.date({ label: '생년월일' })"
    />

		<v-file-input 
			label="회원이미지"
			v-model="form.mb_image"
			prepend-icon="mdi-account-box"
			accept="image/jpg,image/png"
		/>

    <input-radio
      v-model="form.mb_gender"
      :items="genderItems"
      row
      prepend-icon="mdi-gender-male-female"
      :rules="[rules.require({ label: '성별' })]"
    />

    <input-phone
      v-model="form.mb_phone"
      label="전화번호"
      prepend-icon="mdi-phone"
			:rules="rules.phone()"
    />

		<input-post 
			:zipcode.sync="form.mb_zip"
			:addr1.sync="form.mb_addr1"
			:addr2.sync="form.mb_addr2"
		/>

    <v-btn type="submit" block color="primary" :loading="isLoading">회원가입</v-btn>
  </v-form>
</template>

<script>
import validateRules from "../../../util/validateRules";
import InputDate from "../InputForms/InputDate.vue";
import InputDuplicateCheck from "../InputForms/InputDuplicateCheck.vue";
import InputPassword from "../InputForms/InputPassword.vue";
import InputPhone from "../InputForms/InputPhone.vue";
import InputPost from '../InputForms/InputPost.vue';
import InputRadio from "../InputForms/InputRadio.vue";

export default {
  components: {
    InputDuplicateCheck,
    InputPassword,
    InputDate,
    InputRadio,
    InputPhone,
    InputPost,
  },
  name: "SignUpForm",
  props: {
    cbCheckId: {
      type: Function,
      default: null,
    },
    cbCheckEmail: {
      type: Function,
      default: null,
    },
		isLoading : Boolean,
  },
  data() {
    return {
      valid: true,
      form: {
        mb_id: "test1",
        mb_password: "abcd1234",
        mb_name: "테스트",
        mb_birth: "2000-10-01",
        mb_gender: "M",
        mb_email: "test@test.com",
        mb_phone: "010-1111-1111",
        mb_zip: "06302",
        mb_addr1: "서울 강남구 양재천로 163 (도곡동, 바디프랜드 도곡타워)",
        mb_addr2: "3층",
				mb_image : null,
      },
      confirmPw: "abcd1234",
      genderItems: [
        { label: "남자", value: "M" },
        { label: "여자", value: "F" },
      ],
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
      if (!this.$refs.id.validate()) return;
      if (!this.$refs.email.validate()) return;

      // this.$emit('onSave', this.form);
			const formData = new FormData();
			const keys = Object.keys(this.form);
			for(const key of keys) {
				formData.append(key, this.form[key]);
			}
			this.$emit('onSave', formData);
    },
  },
};
</script>

<style>
</style>