<template>
  <v-avatar color="accent" size="32">
		<template v-if="member">
			<v-img 
				v-if="hasImage"
				:src="memberPhoto"
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
	computed: {
		memberPhoto() {
			return this.member.mb_photo || `/upload/memberPhoto/${this.member.mb_id}.jpg?w=32&h=32`;
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