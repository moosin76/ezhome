<template>
  <div v-if="fieldType == 'String'">
    <v-text-field
      label="Value"
      :value="value"
      @input="onInput"
      :readonly="readonly"
      :hide-details="readonly"
    />
  </div>
  <div v-else-if="fieldType == 'Number'">
    <v-text-field
      label="Value"
      type="number"
      :value="value"
      @input="onInput"
      :readonly="readonly"
      :hide-details="readonly"
    />
  </div>
  <div v-else-if="fieldType == 'Json'">
    <template v-if="readonly">
      <v-btn @click="$refs.dialog.open()" color="primary">JSON 보기</v-btn>
      <ez-dialog ref="dialog" label="JSON 값 보기" max-width="500">
        <pre class="mt-4">{{ stringify() }}</pre>
      </ez-dialog>
    </template>
    <v-textarea v-else label="Value" :value="value" @input="onInput" />
  </div>
  <div v-else-if="fieldType == 'Secret'">
    <input-password
      label="Sercet Value"
      :value="value"
      @input="onInput"
      :readonly="readonly"
      :hide-details="readonly"
    />
  </div>
  <div v-else>
    <div>선택한 타입 입력필드가 없습니다.</div>
  </div>
</template>

<script>
import EzDialog from "../../../components/etc/EzDialog.vue";
import InputPassword from "../../../components/InputForms/InputPassword.vue";
import jsonStringify from "json-stable-stringify";

export default {
  components: { InputPassword, EzDialog },
  name: "TypeValue",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: {
      type: String,
    },
    fieldType: {
      type: String,
      default: "String",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onInput(val) {
      this.$emit("input", val);
    },
    stringify() {
      const obj = JSON.parse(this.value);
      const str = jsonStringify(obj, { space: "  " });
      return str;
    },
  },
};
</script>

<style>
</style>