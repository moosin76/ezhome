<template>
  <v-avatar color="accent" size="32">
		<template v-if="member">
			<v-img 
				v-if="hasImage"
				:src="`/upload/memberPhoto/${member.mb_id}.jpg?w=32&h=32`"
				@error="imageError"
			/>
			<div v-else>{{ member.mb_name[0] }}</div>
		</template>
    <v-icon v-else>mdi-account</v-icon>
  </v-avatar>
</template>

<script>
export default {
  name: "DisplayAvatar",
	props : {
		member : {
			type : Object,
			default : null,
		}
	},
	data() {
		return {
			hasImage : true,
		}
	},
	methods : {
		imageError() {
			this.hasImage = false;
		}
	}
};
</script>

<style>
</style>