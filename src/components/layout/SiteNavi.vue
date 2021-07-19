<template>
  <div>
		<v-app-bar v-if="!isLg" dark color="primary">
			<v-app-bar-title>
				<site-title />
			</v-app-bar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="$emit('close')">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-app-bar>
    <v-list>
      <nested-menu :items="items" />
    </v-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NestedMenu from "./NestedMenu.vue";
import { deepCopy } from "../../../util/lib";
import SiteTitle from './SiteTitle.vue';

export default {
  components: { NestedMenu, SiteTitle },
  name: "SiteNavi",
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapState({
      menu: (state) => state.config.menu,
    }),
		isLg() {
			const {lg, xl} = this.$vuetify.breakpoint;
			return lg || xl;
		}
  },
  created() {
    this.initMenu();
  },
  methods: {
    initMenu() {
      const items = deepCopy(this.menu);
      this.findActiveItem(items, null);
      this.items = items;
    },
    findActiveItem(items, parent) {
      if (parent) parent.active = false;
      for (const item of items) {
        if (item.subItems && item.subItems.length > 0) {
          this.findActiveItem(item.subItems, item);
        } else {
          if (parent && this.$route.path.startsWith(item.to)) {
            item.active = true;
          }
        }
        if (parent && item.active) {
          parent.active = true;
        }
      }
    },
  },
};
</script>

<style>
</style>