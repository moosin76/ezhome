<template>
	<v-footer app dark class="justify-center" absolute>
		&copy; {{ new Date().getFullYear() }} {{ footer }}
	</v-footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name : "SiteFooter",
	computed :{
		...mapState({
			footer : state => state.config.footer
		})
	}
}
</script>

<style>

</style>