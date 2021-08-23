<template>
	<div>
		<v-card-actions>
      <v-btn color="primary" block>회원정보수정</v-btn>
    </v-card-actions>
    <v-card-actions>
      <v-btn color="secondary" block>로그아웃</v-btn>
    </v-card-actions>
	</div>
</template>

<script>
export default {
	name : "MemberMenu",
	props : {
		member : {
			type: Object,
			default : null,
		}
	}
}
</script>

<style>

</style>