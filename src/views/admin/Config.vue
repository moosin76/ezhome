<template>
  <v-container fluid>
    <v-toolbar>
      <v-toolbar-title>설정관리</v-toolbar-title>
      <v-spacer></v-spacer>
      <tooltip-btn fab small label="설정추가" @click="addConfig">
        <v-icon>mdi-plus</v-icon>
      </tooltip-btn>
    </v-toolbar>

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
import { mapActions } from 'vuex';
import EzDialog from "../../components/etc/EzDialog.vue";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
import ConfigForm from './ConfigComponent/ConfigForm.vue';
export default {
  components: { TooltipBtn, EzDialog, ConfigForm },
  name: "AdmConfig",
  methods: {
		...mapActions(['configDuplicate', 'configSave']),
    addConfig() {
      this.$refs.dialog.open();
    },
		async save(form) {
			const data = this.configSave(form);
			this.$refs.dialog.close();
		},
		async keyCheck(value) {
			const payload = {
				field : 'cf_key',
				value,
			}
			return await this.configDuplicate(payload);
		}
  },
};
</script>

<style>
</style>