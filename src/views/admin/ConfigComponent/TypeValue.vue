<template>
	<div v-if="fieldType == 'String'">
		<v-text-field label="Value" :value="value" @input="onInput" />
	</div>
	<div v-else-if="fieldType == 'Number'">
		<v-text-field label="Value" type="number" :value="value" @input="onInput" />
	</div>
	<div v-else-if="fieldType == 'Json'">
		<v-textarea label="Value" :value="value" @input="onInput"/>
	</div>
	<div v-else-if="fieldType == 'Secret'">
		<input-password label="Sercet Value" :value="value" @input="onInput" />
	</div>
	<div v-else>
		<div>선택한 타입 입력필드가 없습니다.</div>
	</div>
</template>

<script>
import InputPassword from '../../../components/InputForms/InputPassword.vue';
export default {
  components: { InputPassword },
	name : 'TypeValue',
	model : {
		prop : 'value',
		event : 'input'
	},
	props : {
		value : {
			type : String,
		},
		fieldType : {
			type : String,
			default : 'String'
		}
	},
	methods : {
		onInput(val) {
			this.$emit('input', val);
		}
	}
}
</script>

<style>

</style>