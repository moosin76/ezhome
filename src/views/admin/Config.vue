<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>설정관리</v-toolbar-title>
      <v-spacer></v-spacer>
      <tooltip-btn
        fab
        small
        label="설정추가"
        color="primary"
        @click="addConfig"
      >
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>

      <tooltip-btn
        fab
        small
        label="서버재시작"
        color="error"
        @click="restartServer"
        childClass="ml-2"
        :loading="restart"
      >
        <v-icon>mdi-power</v-icon>
      </tooltip-btn>
    </v-toolbar>
    <v-row>
      <v-col>
        <v-tabs v-model="group" background-color="primary" dark>
          <v-tab v-for="item in groupItems" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <draggable
      tag="ul"
      :list="curItems"
      class="config-list-group"
      handle=".handle"
      @end="sortEnd"
    >
      <config-item
        class="list-group-item"
        v-for="item in curItems"
        :key="item.cf_key"
        :item="item"
        @update="updateConfig"
        @remove="removeConfig"
      />
    </draggable>

    <ez-dialog
      label="설정 추가"
      ref="dialog"
      max-width="500"
      dark
      color="primary"
      persistent
    >
      <config-form
        @save="save"
        :keyCheck="keyCheck"
        :item="item"
        :groupItems="groupItems"
      />
    </ez-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
import EzDialog from "../../components/etc/EzDialog.vue";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import ConfigForm from "./ConfigComponent/ConfigForm.vue";
import draggable from "vuedraggable";
import ConfigItem from "./ConfigComponent/ConfigItem.vue";

export default {
  components: { TooltipBtn, EzDialog, ConfigForm, draggable, ConfigItem },
  name: "AdmConfig",
  data() {
    return {
      items: [],
      group: -1,
      curItems: [],
      item: null,
      restart: false,
    };
  },
  computed: {
    ...mapState({
      online: (state) => state.socket.online,
    }),
    groupItems() {
      const sets = new Set();
      this.items.forEach((item) => {
        sets.add(item.cf_group);
      });
      return [...sets];
    },
    groupName() {
      return this.groupItems[this.group] || "";
    },
  },
  watch: {
    group() {
      this.setCurItems();
    },
    online() {
      if (this.online) {
        this.$toast.info("서버가 재시작 되었습니다.");
        this.restart = false;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["configDuplicate", "configSave"]),
    addConfig() {
      this.item = null;
      this.$refs.dialog.open();
    },
    updateConfig(item) {
      this.item = item;
      this.$refs.dialog.open();
    },
    async save(form) {
      const data = await this.configSave(form);

      if (data.cf_client) {
        this.$socket.emit("config:update", {
          key: data.cf_key,
          value: data.cf_val,
        });
      } else if (this.item && this.item.cf_client) {
        this.$socket.emit("config:remove", data.cf_key);
      }

      if (this.item) {
        this.$toast.info(`[${form.cf_name}] 수정 하였습니다.`);
        const idx = this.items.indexOf(this.item);
        this.items.splice(idx, 1, form);
      } else {
        this.$toast.info(`[${form.cf_name}] 추가 하였습니다.`);
        this.items.push(form);
      }
      this.setCurItems();
      this.$refs.dialog.close();
    },
    async removeConfig(item) {
      const result = await this.$ezNotify.confirm(
        `<b>[${item.cf_name}]</b> 삭제 하시겠습니까?`,
        "설정항목 삭제",
        { icon: "mdi-delete", iconColor: "red" }
      );
      if (!result) return;
      const data = await this.$axios.delete(`/api/config/${item.cf_key}`);
      if (data) {
        if (item.cf_client) {
          this.$socket.emit("config:remove", item.cf_key);
        }
        this.$toast.info(`[${item.cf_name}] 삭제 하였습니다.`);
        const idx = this.items.indexOf(item);
        this.items.splice(idx, 1);
        this.setCurItems();
      }
    },
    async keyCheck(value) {
      const payload = {
        field: "cf_key",
        value,
      };
      return await this.configDuplicate(payload);
    },
    async fetchData() {
      this.items = await this.$axios.get("/api/config?all=true");
    },
    sortEnd() {
      let i = 0;
      const payload = [];
      this.curItems.forEach((item) => {
        item.cf_sort = i++;
        payload.push({
          cf_key: item.cf_key,
          cf_sort: item.cf_sort,
        });
      });
      this.$axios.put("/api/config", payload);
    },
    setCurItems() {
      this.curItems = this.items
        .filter((item) => {
          return item.cf_group == this.groupName;
        })
        .sort((a, b) => {
          return a.cf_sort - b.cf_sort;
        });
    },
    async restartServer() {
      const result = await this.$ezNotify.confirm(
        "서버를 재시작 하시겠습니까?",
        "서버 재시작"
      );
      if (!result) return;
      this.restart = true;
      const data = await this.$axios.get("/api/config/restart");
      if (data) {
        this.$toast.error("서버 재시작을 요청하였습니다.");
      }
      setTimeout(() => {
        if (this.restart) {
          this.restart = false;
          this.$toast.error(
            "서버 재시작을 실패하였습니다.\n다시 시도해주세요."
          );
        }
      }, 20000);
    },
  },
};
</script>

<style>
</style>