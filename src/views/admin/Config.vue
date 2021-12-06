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

		<draggable tag="ul" :list="curItems" class="config-list-group" handle=".handle" @end="sortEnd">
			<config-item 
				class="list-group-item"
				v-for="item in curItems"
				:key="item.cf_key"
				:item="item"
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
      <config-form @save="save" :keyCheck="keyCheck" />
    </ez-dialog>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import EzDialog from "../../components/etc/EzDialog.vue";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import ConfigForm from "./ConfigComponent/ConfigForm.vue";
import draggable from 'vuedraggable';
import ConfigItem from './ConfigComponent/ConfigItem.vue';

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
      this.curItems = this.items.filter((item) => {
        return item.cf_group == this.groupName;
      });
      console.log(this.curItems);
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["configDuplicate", "configSave"]),
    addConfig() {
      this.$refs.dialog.open();
    },
    async save(form) {
      const data = this.configSave(form);
      this.$refs.dialog.close();
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
      console.log(this.groupItems);
    },
		sortEnd() {
			let i =0;
			const payload = [];
			this.curItems.forEach((item)=>{
				item.cf_sort = i++;
				payload.push({
					cf_key : item.cf_key,
					cf_sort : item.cf_sort
				})
			});
			this.$axios.put('/api/config', payload);
		}
  },
};
</script>

<style>
</style>