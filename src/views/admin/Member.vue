<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>회원 관리</v-toolbar-title>
      <search-field
        :items="searchItems"
        :stf.sync="options.stf[0]"
        :stx.sync="options.stx[0]"
        :stc.sync="options.stc[0]"
				class="ml-4"
      />
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
import SearchField from "../../components/layout/SearchField.vue";
export default {
  components: { SearchField },
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
          searchable: true,
        },
        {
          text: "이메일",
          value: "mb_email",
          align: "start",
          searchable: true,
        },
        {
          text: "연락처",
          value: "mb_phone",
          align: "start",
          searchable: true,
        },
        {
          text: "레벨",
          value: "mb_level",
          align: "start",
          searchable: true,
        },
        {
          text: "가입일",
          value: "mb_create_at",
          align: "start",
          searchable: true,
        },
        {
          text: "CMD",
          value: "cmd",
          sortable: false,
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
  computed: {
    searchItems() {
      return this.headers.filter((item) => item.searchable);
    },
  },
  created() {
    this.options = this.initOptions();
  },
  methods: {
    initOptions() {
      const options = {
        page: 1,
        itemsPerPage: 10,
        sortBy: ["mb_create_at"],
        sortDesc: [false],
        stf: [""],
        stx: [""],
        stc: [""],
      };
      return options;
    },
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