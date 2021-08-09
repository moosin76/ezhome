<template>
  <v-dialog v-model="modal" persistent max-width="290">
    <template v-slot:activator="{ attrs }">
      <v-text-field
        v-bind="{ ...$attrs, ...attrs }"
        :value="value"
        @input="onInput"
      >
        <template v-slot:append>
          <v-btn icon small tabindex="-1" @click="open">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-toolbar>
				<v-toolbar-title>{{ $attrs.label }}</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon plain @click="close">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>
			<v-date-picker
				v-model="date"
				no-title
				@input="picker"
				:day-format="dayFormat"
			/>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "InputDate",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: String,
  },
  data() {
    return {
      modal: false,
			date : "",
    };
  },
  methods: {
    onInput(val) {
      this.$emit("input", val);
    },
		open() {
			const pattern = /^\d{4}-\d{2}-\d{2}$/;
			this.date = pattern.test(this.value) ? this.value : this.date;
			this.modal = true;
		},
		close() {
			this.modal = false;
		},
		picker() {
			this.onInput(this.date);
			this.close();
		},
		dayFormat(day) {
			if(!this.modal) return;
			const arr = day.split('-');
			return Number(arr[arr.length-1]);
		}
  },
};
</script>

<style>
</style>