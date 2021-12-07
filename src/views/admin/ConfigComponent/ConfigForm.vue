<template>
  <v-form @submit.prevent="save" ref="form" v-model="valid" lazy-validation>
    <v-combobox
      v-model="form.cf_group"
      :items="groupItems"
      label="그룹"
      :rules="[rules.require({ label: '그룹' })]"
    ></v-combobox>
    <div class="d-flex">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span v-on="on" v-bind="attrs" class="mr-2">
            <v-checkbox
              v-model="form.cf_client"
              :true-value="1"
              :false-value="0"
            ></v-checkbox>
          </span>
        </template>
        <span>클라이언트</span>
      </v-tooltip>
      <input-duplicate-check
        ref="cfKey"
        label="키"
        v-model="form.cf_key"
        :cbCheck="keyCheck"
        :origin="originKey"
        :readonly="!!item"
        :rules="[rules.require({ label: '키' }), rules.alphaNum()]"
      />
    </div>
    <v-text-field label="이름" v-model="form.cf_name" :rules="rules.name()" />
    <v-select label="값 타입" v-model="form.cf_type" :items="typeItems" />
    <type-value v-model="form.cf_val" :fieldType="form.cf_type" />
    <v-slider
      :label="`접근레벨 (${form.cf_level})`"
      v-model="form.cf_level"
      :min="LV.ADMIN"
      :max="LV.SUPER"
      thumb-color="primary"
      thumb-label
    />
    <v-textarea label="설명" v-model="form.cf_comment" />
    <v-btn type="submit" block>저장</v-btn>
  </v-form>
</template>

<script>
import validateRules from "../../../../util/validateRules";
import InputDuplicateCheck from "../../../components/InputForms/InputDuplicateCheck.vue";
import { LV } from "../../../../util/level";
import TypeValue from "./TypeValue.vue";
import { deepCopy, findParentVm } from "../../../../util/lib";
import jsonStringify from "json-stable-stringify";

export default {
  components: { InputDuplicateCheck, TypeValue },
  name: "ConfigForm",
  props: {
    keyCheck: {
      type: Function,
      default: null,
    },
    groupItems: {
      type: Array,
      default: [],
    },
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      valid: true,
      form: {
        cf_key: "",
        cf_val: "",
        cf_name: "",
        cf_group: "",
        cf_level: "",
        cf_type: "String",
        cf_comment: "",
        cf_client: 0,
      },
      typeItems: ["String", "Number", "Json", "Secret"],
    };
  },
  computed: {
    rules: () => validateRules,
    LV: () => LV,
    originKey() {
      return this.item ? this.item.cf_key : "";
    },
  },
  watch: {
    item() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.item) {
        this.form = deepCopy(this.item);
        if (this.form.cf_type == "Json") {
          const obj = JSON.parse(this.form.cf_val);
          this.form.cf_val = jsonStringify(obj, { space: "  " });
        }
      } else {
        this.form = {
          cf_key: "",
          cf_val: "",
          cf_name: "",
          cf_group: "",
          cf_level: "",
          cf_type: "String",
          cf_comment: "",
          cf_client: 0,
        };
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    async save() {
      this.$refs.form.validate();
      await this.$nextTick();
      if (!this.valid) return;
      if (!this.$refs.cfKey.validate()) return;
      if (!this.item) {
        let i = 0;
        const parent = findParentVm(this, "AdmConfig");
        parent.items.forEach((item) => {
          if (item.cf_group == this.form.cf_group) {
            i++;
          }
        });
        this.form.cf_sort = i;
      }
      try {
        if (this.form.cf_type == "Json") {
          const obj = JSON.parse(this.form.cf_val);
          this.form.cf_val = JSON.stringify(obj);
        }
        this.$emit("save", this.form);
        this.init();
      } catch (e) {
        this.$toast.error("JSON 형식이 올바르지 않습니다.");
      }
    },
  },
};
</script>

<style>
</style>