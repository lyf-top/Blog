/**
 * 日历事件工具函数
 *
 * 基于 lunar-typescript 实现农历 → 公历换算，
 * 将 calendarConfig.builtinHolidays 展开为指定年份的公历日期列表。
 */

import { Lunar } from "lunar-typescript";
import type { HolidayDate, HolidayEntry } from "@/config/calendarConfig";

/**
 * 将公历日期格式化为 YYYY-MM-DD
 */
export function formatYmd(year: number, month: number, day: number): string {
	const y = String(year);
	const m = String(month).padStart(2, "0");
	const d = String(day).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

/**
 * 将 holiday 列表展开为指定年份的具体公历日期
 *
 * - solar 类型：直接用 year + 固定月日
 * - lunar 类型：通过 lunar-typescript 查找该农历月日对应的公历日期
 *   注意：农历可能有闰月，lunar-typescript 的 Lunar.fromYmd(year, month, day)
 *   会自动处理。对于除夕（腊月三十），部分年份腊月只有29天，此时自动使用腊月廿九。
 */
export function expandBuiltinHolidays(
	holidays: HolidayEntry[],
	years: number[],
): HolidayDate[] {
	const result: HolidayDate[] = [];

	for (const year of years) {
		for (const h of holidays) {
			try {
				if (h.type === "solar") {
					// 公历节日：直接拼接
					result.push({
						name: h.name,
						date: formatYmd(year, h.month, h.day),
					});
				} else {
					// 农历节日：通过 lunar-typescript 换算
					// 除夕特殊处理：取腊月最后一天
					if (h.name === "除夕") {
						// 先查下一年正月初一，再减一天即为除夕
						try {
							const nextYearFirstDay = Lunar.fromYmd(year + 1, 1, 1);
							const solar = nextYearFirstDay.getSolar();
							const prevDay = new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay() - 1);
							result.push({
								name: h.name,
								date: formatYmd(prevDay.getFullYear(), prevDay.getMonth() + 1, prevDay.getDate()),
							});
						} catch {
							// 回退：尝试腊月三十
							try {
								const lunar = Lunar.fromYmd(year, 12, 30);
								const solar = lunar.getSolar();
								result.push({
									name: h.name,
									date: formatYmd(solar.getYear(), solar.getMonth(), solar.getDay()),
								});
							} catch {
								// 腊月只有29天
								const lunar = Lunar.fromYmd(year, 12, 29);
								const solar = lunar.getSolar();
								result.push({
									name: h.name,
									date: formatYmd(solar.getYear(), solar.getMonth(), solar.getDay()),
								});
							}
						}
					} else {
						const lunar = Lunar.fromYmd(year, h.month, h.day);
						const solar = lunar.getSolar();
						result.push({
							name: h.name,
							date: formatYmd(solar.getYear(), solar.getMonth(), solar.getDay()),
						});
					}
				}
			} catch {
				// 某些年份可能没有该农历日期（如闰月问题），静默跳过
				console.warn(
					`[calendar-events] Skipped holiday "${h.name}" for year ${year}: unable to convert`,
				);
			}
		}
	}

	// 按日期排序
	result.sort((a, b) => a.date.localeCompare(b.date));

	return result;
}
