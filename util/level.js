const level = {
	LV: {
		BLOCK: 0,
		AWAIT: 1,
		MEMBER: 2,
		VIP: 4,
		ADMIN: 6,
		SUPER: 10
	},
	LV_LABEL: (lv) => {
		if (lv >= level.LV.SUPER) {
			return '최고관리자';
		} else if (level.LV.ADMIN <= lv && lv < level.LV.SUPER) {
			return '관리자';
		} else if (level.LV.VIP <= lv && lv < level.LV.ADMIN) {
			return '우수회원';
		} else if (level.LV.MEMBER <= lv && lv < level.LV.VIP) {
			return '일반회원';
		} else if (level.LV.AWAIT == lv) {
			return '대기회원';
		} else {
			return '차단/비 회원';
		}
	},
	LV_COLOR: (lv) => {
		if (lv >= level.LV.SUPER) {
			return 'light-blue accent-4';
		} else if (level.LV.ADMIN <= lv && lv < level.LV.SUPER) {
			return 'green lighten-1';
		} else if (level.LV.VIP <= lv && lv < level.LV.ADMIN) {
			return 'green lighten-2';
		} else if (level.LV.MEMBER <= lv && lv < level.LV.VIP) {
			return 'lime lighten-3';
		} else if (level.LV.AWAIT == lv) {
			return 'red accent-2';
		} else {
			return 'red accent-4';
		}
	},
	isGrant(req, lv) {
		return req.user && req.user.mb_level >= lv ? true : false;
	}
};

module.exports = level;