<template>
  <v-text-field
    :value="value"
    v-bind="$attrs"
    @keyup="onInput"
    :maxlength="max"
  />
</template>

<script>
export default {
  name: "InputPhone",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: String,
  },
  data() {
    return {
      max: 13,
    };
  },
  methods: {
    onInput(event) {
			console.log("event val", event.target.value);
			const val = this.authDash(event.target.value);
      this.$emit("input", val);
    },
    authDash(val) {
      val = val.replace(/[^\d]/g, "");
      let pattern = null;
      if (val[0] != 0) {
        if (val.length < 8) {
          pattern = /([\d]{0,3})([\d]{0,4})/;
        } else {
          pattern = /([\d]{0,4})([\d]{0,4})/;
        }
				this.max = 9;
      } else if (val[1] == 2) {
        // 02 시작
        if (val.length < 10) {
          pattern = /([\d]{0,2})([\d]{0,3})([\d]{0,4})/;
        } else {
          pattern = /([\d]{0,2})([\d]{0,4})([\d]{0,4})/;
        }
				this.max = 12; 
      } else {
        // 010 070 시작
        if (val.length < 11) {
          pattern = /([\d]{0,3})([\d]{0,3})([\d]{0,4})/;
        } else {
          pattern = /([\d]{0,3})([\d]{0,4})([\d]{0,4})/;
        }
				this.max = 13; 
      }
			const matchs = pattern.exec(val);
			let rVal = matchs[1];
			rVal += matchs[2] ? '-'+ matchs[2] : "";
			rVal += matchs[3] ? '-'+ matchs[3] : "";
			return rVal;
    },
  },
};
</script>

<style>
</style>