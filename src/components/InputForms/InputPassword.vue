<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    @input="onInput"
    :type="type ? 'password' : 'text'"
  >
    <template v-slot:append>
      <v-btn icon small tabindex="-1" @click="type = !type">
        <v-icon>{{ type ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: "InputPassword",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: String,
  },
  data() {
    return {
      type: true,
    };
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