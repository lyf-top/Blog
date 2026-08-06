/**
 * 日历 & 节假日配置
 *
 * builtinHolidays 定义的节日会被 Schedule 组件（倒计时）和 /calendar/ 页面共同使用。
 * 支持公历（solar）和农历（lunar）两种类型，expandBuiltinHolidays() 会自动展开到指定年份。
 *
 * 修改节日：只改这里，两侧（侧边栏倒计时 + 站点日历页）会自动同步。
 */

export interface HolidayEntry {
	/** 节日名称 */
	name: string;
	/**
	 * 日期类型
	 * - "solar"：公历固定日期（如元旦 1月1日、国庆 10月1日）
	 * - "lunar"：农历固定日期（如中秋 八月十五、除夕 腊月三十）
	 */
	type: "solar" | "lunar";
	/** 月份（solar: 1-12, lunar: 1-12） */
	month: number;
	/** 日期（solar: 1-31, lunar: 1-30） */
	day: number;
}

export interface HolidayDate {
	name: string;
	/** ISO 日期字符串 YYYY-MM-DD */
	date: string;
}

export const calendarConfig = {
	/** 是否允许点击 Schedule 组件跳转到 /calendar/ 页面 */
	pages: {
		calendar: true,
	},

	/**
	 * 内置节日列表
	 *
	 * 农历节日的公历日期由 expandBuiltinHolidays() 在构建期通过天文算法换算，
	 * 每年自动更新，无需手动维护公历对照表。
	 */
	builtinHolidays: [
		// ---- 公历节日 ----
		{ name: "元旦",     type: "solar", month: 1,  day: 1 },
		{ name: "情人节",   type: "solar", month: 2,  day: 14 },
		{ name: "妇女节",   type: "solar", month: 3,  day: 8 },
		{ name: "植树节",   type: "solar", month: 3,  day: 12 },
		{ name: "愚人节",   type: "solar", month: 4,  day: 1 },
		{ name: "劳动节",   type: "solar", month: 5,  day: 1 },
		{ name: "青年节",   type: "solar", month: 5,  day: 4 },
		{ name: "儿童节",   type: "solar", month: 6,  day: 1 },
		{ name: "建党节",   type: "solar", month: 7,  day: 1 },
		{ name: "建军节",   type: "solar", month: 8,  day: 1 },
		{ name: "教师节",   type: "solar", month: 9,  day: 10 },
		{ name: "国庆节",   type: "solar", month: 10, day: 1 },
		{ name: "万圣节",   type: "solar", month: 10, day: 31 },
		{ name: "圣诞节",   type: "solar", month: 12, day: 25 },

		// ---- 农历节日 ----
		{ name: "春节",     type: "lunar", month: 1,  day: 1 },
		{ name: "元宵节",   type: "lunar", month: 1,  day: 15 },
		{ name: "端午节",   type: "lunar", month: 5,  day: 5 },
		{ name: "七夕",     type: "lunar", month: 7,  day: 7 },
		{ name: "中秋节",   type: "lunar", month: 8,  day: 15 },
		{ name: "重阳节",   type: "lunar", month: 9,  day: 9 },
		{ name: "除夕",     type: "lunar", month: 12, day: 30 },
	] as HolidayEntry[],
};
