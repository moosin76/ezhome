<template>
  <v-text-field 
		:value="value" 
		@input="onInput" 
		v-bind="$attrs" 
		:maxlength="$attrs.counter" 
		/>
</template>

<script>
export default {
  name: "InputDuplicateCheck",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: String,
  },
  mounted() {
    // console.log(this.$attrs);
  },
  methods: {
    onInput(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style>
</style>