<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>회원 관리</v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :loading="loading"
    ></v-data-table>
  </v-container>
</template>

<script>
import qs from "qs";
export default {
  name: "AdmMember",
  data() {
    return {
      options: {},
      totalItems: 0,
      items: [],
      loading: false,
      headers: [
        {
          text: "아이디",
          value: "mb_id",
          align: "start",
        },
        {
          text: "이메일",
          value: "mb_email",
          align: "start",
        },
        {
          text: "연락처",
          value: "mb_phone",
          align: "start",
        },
        {
          text: "레벨",
          value: "mb_level",
          align: "start",
        },
        {
          text: "가입일",
          value: "mb_create_at",
          align: "start",
        },
        {
          text: "CMD",
          value: "cmd",
        },
      ],
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const payload = { ...this.options };
      const query = qs.stringify(payload);
      const data = await this.$axios.get(`/api/member?${query}`);
      this.loading = false;
      if (data) {
        this.items = data.items;
        this.totalItems = data.totalItems;
      }
    },
  },
};
</script>

<style>
</style>