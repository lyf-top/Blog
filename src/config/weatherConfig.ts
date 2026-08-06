/**
 * 天气预报组件配置
 *
 * 天气数据来源：
 * - Open-Meteo Forecast API（温度、湿度、风速、UV、日出日落等）— 免费，无需 API Key
 * - Open-Meteo Air Quality API（AQI、PM2.5 等）— 免费，无需 API Key
 * - ipwho.is（IP 定位回退）— 免费
 * - BigDataCloud Reverse Geocoding（坐标 → 中文地名）— 免费
 *
 * 定位模式：
 * - browser：优先浏览器 GPS/WiFi 定位（不受 VPN 影响，需用户授权），失败则回退到 IP 定位，再失败则用 fixed 坐标
 * - ip：按访客 IP 定位（开 VPN 会偏），失败则回退到 fixed 坐标
 * - fixed：所有访客看到同一城市天气
 */
export const weatherConfig = {
	/**
	 * 定位方式
	 * - "browser"：浏览器 Geolocation API（需用户授权，线上需 HTTPS）
	 * - "ip"：按访客出口 IP 定位（无需授权，但 VPN 会影响结果）
	 * - "fixed"：使用下方固定的城市坐标
	 */
	locationMode: "browser" as "browser" | "ip" | "fixed",

	/** 固定城市名（fixed 模式 / 最终回退显示） */
	city: "北京",
	/** 固定区县名（可选，用于更精确的显示） */
	district: "",
	/** 固定纬度（WGS84） */
	latitude: 39.9042,
	/** 固定经度（WGS84） */
	longitude: 116.4074,
	/** 时区标识（如 Asia/Shanghai） */
	timezone: "Asia/Shanghai",

	/** 浏览器定位超时时间（毫秒） */
	geolocationTimeoutMs: 10_000,

	/** 天气数据缓存时长（毫秒），默认 5 分钟 */
	cacheDurationMs: 5 * 60 * 1000,
};
