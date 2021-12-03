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
    >
			<v-btn @click="save">닫기</v-btn>
    </ez-dialog>
  </v-container>
</template>

<script>
import EzDialog from "../../components/etc/EzDialog.vue";
import TooltipBtn from "../../components/etc/TooltipBtn.vue";
export default {
  components: { TooltipBtn, EzDialog },
  name: "AdmConfig",
  methods: {
    addConfig() {
      this.$refs.dialog.open();
    },
		save() {
			this.$refs.dialog.close();
		}
  },
};
</script>

<style>
</style>