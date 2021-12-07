<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>설정관리</v-toolbar-title>
      <v-spacer></v-spacer>
      <tooltip-btn fab small label="설정추가" @click="addConfig">
        <v-icon>mdi-plus</v-icon>
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
import { mapActions } from "vuex";
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
    };
  },
  computed: {
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
			if(this.item) {
				this.$toast.info(`[${form.cf_name}] 수정 하였습니다.`);
				const idx = this.items.indexOf(this.item);
				this.items.splice(idx, 1, data);
			} else {
				this.$toast.info(`[${form.cf_name}] 추가 하였습니다.`);
				this.items.push(data);
			}
			this.setCurItems();
      this.$refs.dialog.close();
    },
		async removeConfig(item) {
			const result = await this.$ezNotify.confirm(
				`<b>[${item.cf_name}]</b> 삭제 하시겠습니까?`,
				'설정항목 삭제',
				{icon : 'mdi-delete', iconColor: 'red'}
			);
			if(!result) return;
			const data = await this.$axios.delete(`/api/config/${item.cf_key}`);
			if(data) {
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
			this.curItems = this.items.filter((item) => {
        return item.cf_group == this.groupName;
      });
		}
  },
};
</script>

<style>
</style>