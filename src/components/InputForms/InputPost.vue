<template>
  <div>
    <v-sheet max-width="200">
      <v-text-field
        label="우편번호"
        :value="zipcode"
        readonly
        prepend-icon="mdi-map-marker"
        :rules="required ? [rules.require({ label: '주소' })] : []"
      >
        <template v-slot:append>
          <v-btn icon small tabindex="-1" @click="open">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-sheet>
    <v-text-field label="주소" :value="addr1" readonly></v-text-field>
    <v-text-field
      label="상세주소"
      :value="addr2"
      @input="updateAddr2"
    ></v-text-field>
		<v-dialog v-model="dialog" max-width="500" persistent>
			<v-toolbar>
				<v-toolbar-title>주소검색</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon plain @click="close">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>
			<daum-postcode 
				v-if="themeChange"
				:on-complete="handleAddress"
				:theme="isDark ? darkStyle : lightStyle"
				:animation="true"
			/>
		</v-dialog>
  </div>
</template>

<script>
import validateRules from "../../../util/validateRules";
import DaumPostcode from "vuejs-daum-postcode";

export default {
  name: "InputPost",
  components: { DaumPostcode },
  props: {
    zipcode: String,
    addr1: String,
    addr2: String,
    required: {
      type: Boolean,
      default: true,
    },
  },
	data() {
		return {
			dialog : false,
			darkStyle : {
				bgColor : '#121212',
				searchBgColor : '#131313',
				contentBgColor : '#272727',
				pageBgColor : '#121212',
				textColor : '#FFFFFF',
				queryTextColor : '#FFFFFF',
				outlineColor : '#444444'
			},
			lightStyle : {
				searchBgColor : '#ECECEC'
			},
			themeChange : true,
		}
	},
  computed: {
    rules: () => validateRules,
		isDark() {
			this.themeChange = false;
			this.$nextTick(()=>{
				this.themeChange = true;
			});
			return this.$vuetify.theme.isDark;
		},
  },
  methods: {
    open() {
			this.dialog = true;
		},
		close() {
			this.dialog = false;
		},
    updateAddr2(val) {
      this.$emit("update:addr2", val);
    },
		handleAddress(data) {
			let fullAddress = data.address
			let extraAddress = ''
			if (data.addressType === 'R') {
				if (data.bname !== '') {
					extraAddress += data.bname
				}
				if (data.buildingName !== '') {
					extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName)
				}
				fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '')
			}
		
			this.$emit('update:zipcode', data.zonecode);
			this.$emit('update:addr1', fullAddress);
			this.close();
		}
  },
};
</script>

<style>
</style>