<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>회원 관리</v-toolbar-title>
      <search-field :items="searchItems" :options.sync="options" class="ml-4" />
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="items"
      :options.sync="options"
      :server-items-length="totalItems"
      :loading="loading"
    >
      <template v-slot:item.cmd="{ item }">
        <tooltip-btn icon label="수정" @click="openDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </tooltip-btn>
      </template>
    </v-data-table>

    <ez-dialog
      label="회원 수정"
      ref="dialog"
      width="500"
      persistent
      @onClose="closeDialog"
    >
      <user-update-form
        v-if="curMember"
        :member="curMember"
        :isLoading="loading"
        :admMode="true"
        @onSave="saveMember"
        @onLeave="leaveMember"
      />
    </ez-dialog>
  </v-container>
</template>

<script>
import qs from "qs";
import SearchField from "../../components/layout/SearchField.vue";
import axios from "axios";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import EzDialog from "../../components/etc/EzDialog.vue";
import UserUpdateForm from "../../components/auth/UserUpdateForm.vue";

export default {
  components: { SearchField, TooltipBtn, EzDialog, UserUpdateForm },
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
      pageReady: false,
      pageRouting: false,
      axiosSource: null,
      curMember: null,
    };
  },
  watch: {
    options: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
    // "$route.query": {
    //   handler() {
    //     this.pageRouting = true;
    //     this.options = this.initOptions();
    //   },
    //   deep: true,
    // },
  },
  computed: {
    searchItems() {
      return this.headers.filter((item) => item.searchable);
    },
  },
  created() {
    this.options = this.initOptions();
  },
  mounted() {
    window.addEventListener("popstate", this.routeChange);
  },
  destroyed() {
    window.removeEventListener("popstate", this.routeChange);
  },
  methods: {
    initOptions() {
      const { query } = this.$route;
      const options = {
        page: Number(query.page) || 1,
        itemsPerPage: Number(query.itemsPerPage) || 10,
        sortBy: [query.sortBy || "mb_create_at"],
        sortDesc: [query.sortDesc ? query.sortDesc == "true" : false],
        stf: [query.stf || ""],
        stx: [query.stx || ""],
        stc: [query.stc || ""],
      };
      return options;
    },
    routeChange() {
      this.pageRouting = true;
      this.options = this.initOptions();
    },
    pushState() {
      if (!this.pageRouting) {
        const opt = {
          page: this.options.page,
          itemsPerPage: this.options.itemsPerPage,
          sortBy: this.options.sortBy[0],
          sortDesc: this.options.sortDesc[0],
          stf: this.options.stf[0] || undefined,
          stx: this.options.stx[0] || undefined,
          stc: this.options.stc[0] || undefined,
        };
        const query = qs.stringify(opt);
        if (this.pageReady) {
          history.pushState(null, null, `${this.$route.path}?${query}`);
        } else {
          history.replaceState(null, null, `${this.$route.path}?${query}`);
        }
      }
    },
    async fetchData() {
      if (this.axiosSource) {
        this.axiosSource.cancel("fetch Data 취소");
      }
      this.loading = true;
      console.log("fetchData");
      const payload = { ...this.options };
      const query = qs.stringify(payload);
      this.axiosSource = axios.CancelToken.source();
      try {
        const data = await this.$axios.get(`/api/member?${query}`, {
          cancelToken: this.axiosSource.token,
        });
        this.pushState();
        this.loading = false;
        this.pageReady = true;
        this.pageRouting = false;
        if (data) {
          this.items = data.items;
          this.totalItems = data.totalItems;
        }
      } catch (e) {
        // console.log("request 취소", e.message);
      }
    },
    openDialog(item) {
      this.curMember = item;
      this.$refs.dialog.open();
    },
    closeDialog() {
      this.curMember = null;
    },
    async saveMember(form) {
      this.loading = true;
      const data = await this.$axios.patch("/api/member", form);
      this.loading = false;
      if (data) {
        const idx = this.items.indexOf(this.curMember);
        this.items.splice(idx, 1, data);
        this.$toast.info(`${data.mb_name} 정보 수정하였습니다.`);
        this.$refs.dialog.close();
      }
    },
    async leaveMember() {
      const result = await this.$ezNotify.confirm(
        `${this.curMember.mb_name}님 탈퇴 처리 하시겠습니까?`,
        "회원 탈퇴 처리",
        { icon: "mdi-alert" }
      );
			if(!result) return;
			this.loading = true;
			const form = {
				mb_id : this.curMember.mb_id,
				mb_leave_at : this.$moment().format('LT'),
			};
			const data = await this.$axios.patch('/api/member', form);
			this.loading = false;
			if(data) {
				this.$toast.info(`${this.curMember.mb_name}님 탈퇴 처리 하였습니다.`);
				this.$refs.dialog.close();
				this.pageRouting = true;
				this.fetchData();
			}
    },
  },
};
</script>

<style>
</style>