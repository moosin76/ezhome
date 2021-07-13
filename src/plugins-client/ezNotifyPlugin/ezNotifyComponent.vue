<template>
  <v-dialog v-model="dialog" :max-width="options.width" persistent>
    <v-card>
      <v-toolbar v-if="title" color="primary" dark>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="pt-4">
        <v-icon
          v-if="options.icon"
          large
          :color="options.iconColor"
          class="mr-4"
        >
          {{ options.icon }}
        </v-icon>
        {{ content }}
        <v-form
          v-if="options.type === 'prompt'"
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="text"
            :rules="[(v) => !!v || '필수 입력입니다.']"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn v-if="options.type !== 'alert'" @click="cancle">취소</v-btn>
        <v-btn color="primary" @click="ok">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ezNotifyComponent",
  props: ["opt"],
  data() {
    return {
      dialog: false,
      title: "",
      content: "",
      text: "",
      valid: true,
      options: this.opt,
			promise : null,
    };
  },
  methods: {
    show(content, title, option) {
      return new Promise((resolve, reject) => {
        if (this.dialog) this.close();
        this.$nextTick(() => {
					this.promise = {resolve, reject};
          this.content = content;
          this.title = title;
          this.options = option;
					this.text = option.text;
          this.dialog = true;
        });
      });
    },
    close(result) {
			this.promise.resolve(result);
      this.dialog = false;
			this.promise = null;
			this.content = "";
			this.title = "";
			this.text = "";
			this.valid = true;
			this.options = this.opt;
    },
    ok() {
			if(this.options.type === 'prompt') {
				this.$refs.form.validate();
				this.$nextTick(()=>{
					if(!this.valid) return;
					this.close(this.text);
				});
			}else {
				this.close(true);
			}
      
    },
    cancle() {
      this.close(false);
    },
  },
};
</script>

<style>
</style>