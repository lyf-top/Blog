---

title: Firefly 博客功能更新 — 2026年8月
description: 新增天气预报、时间问候、时间进度与节日倒计时、欢迎弹窗、时间线、项目展示六个功能模块，关闭侧边栏站点信息，页脚接入 ICP 备案号。
image: 'https://img.f3f3.top/img/2026/04/28/87ab7f6d31b8b767723c61db968f171c.webp'
tags:
  - Firefly
  - 博客功能
category: 博客导航
pinned: false
published: 2026-08-06 00:00:00
updated: 2026-08-06 00:00:00
---

本次更新围绕 **侧边栏小部件**、**独立展示页面** 和 **备案信息** 三大方向，共新增六个功能模块。

## 一、天气预报 <Weather/>

适用于希望访客看到 **真实所在地天气** 的个人博客。

### 数据来源（全部免费，无需 API Key）
| 接口 | 用途 | 免费 |
|---|---|---|
| Open-Meteo Forecast | 温度、湿度、风速、UV、日出日落、天气码等 | 是 |
| Open-Meteo Air Quality | AQI（欧洲标准）、PM2.5、PM10 等 | 是 |
| ipwho.is | IP 定位（回退方案） | 是 |
| BigDataCloud Reverse Geocoding | 坐标 → 中文城市名（browser 模式） | 是 |

### 定位策略
```
browser → navigator.geolocation → BigDataCloud 逆地理编码 → Open-Meteo
        ↘ 失败 → ipwho.is → Open-Meteo
                 ↘ 失败 → weatherConfig 固定坐标

ip      → ipwho.is → Open-Meteo
        ↘ 失败 → weatherConfig 固定坐标

fixed   → weatherConfig 固定坐标 → Open-Meteo
```

### 三种定位模式对比

| 模式 | 适用场景 | 注意 |
|---|---|---|
| `browser`（默认） | 希望访客看到真实所在地天气；博主开 VPN 调试 | 首次需浏览器授权；线上需 HTTPS |
| `ip` | 不想弹定位权限，接受 VPN 偏差 | 出口 IP = 定位结果 |
| `fixed` | 个人博客统一展示博主所在城市 | 所有访客看到同一套天气 |

### 配置
`src/config/weatherConfig.ts`：

```ts
export const weatherConfig = {
  locationMode: "browser" as "browser" | "ip" | "fixed",
  city: "北京",           // fixed 模式 / 最终回退城市
  district: "",
  latitude: 39.9042,
  longitude: 116.4074,
  timezone: "Asia/Shanghai",
  geolocationTimeoutMs: 10_000,
  cacheDurationMs: 5 * 60 * 1000,
};
```

### 启用与排错

在 `src/config/sidebarConfig.ts` 的右侧栏 `rightComponents` 中添加：

```ts
{
  type: "weather",
  enable: true,
  position: "top",
  showOnPostPage: false,
},
```

| 现象 | 可能原因 | 处理 |
|---|---|---|
| 弹出定位授权 | `locationMode: "browser"` 正常行为 | 点"允许" |
| 人在北京却显示香港 | 开了 VPN，走了 IP 回退 | 允许浏览器定位，或改 `fixed` |
| 一直"加载中" | 接口超时 / 被插件拦截 | 点重试；检查 Network |
| 显示旧城市天气 | localStorage 缓存 | 删 `weather_` 开头项，或点重试 |
| 能见度为 `--` | Open-Meteo 当前字段未接入 | 预期行为，不影响主功能 |

---

## 二、时间问候 <TimeGreeting/>

### 效果
| 区域 | 内容 |
|---|---|
| 顶部文字 | 根据当前小时显示问候语 |
| 中间 | 大号 `HH:mm` + 日期 / 星期 |
| 右侧图标 | 深夜 / 清晨 / 白天 / 傍晚 自动切换 |
| 底部图片 | 随机风景图（可自定义 API） |

### 问候语规则

```ts
0-5   → "夜深了，早点休息！"       深夜  night
6-8   → "早上好，新的一天！"         清晨  morning
9-11  → "上午好，充满活力！"         白天  noon
12-13 → "中午好，记得午休！"         白天  noon
14-17 → "下午好，继续加油！"         白天  noon
18-23 → "晚上好，放松一下！"         傍晚  evening
```

### 自定义底图 API

在页面或其他脚本中覆盖 `window.timeGreetingImage` 即可：

```ts
// 默认风景（带时间戳防缓存）
window.timeGreetingImage = `https://t.alcy.cc/fj?t=${Date.now()}`;

// 可改为手机竖版
window.timeGreetingImage = "https://t.alcy.cc/mp";
// 或必应竖版
window.timeGreetingImage = "https://bing.img.run/rand_m.php";
```

### 启用

在 `src/config/sidebarConfig.ts` 的 `rightComponents` 中添加：

```ts
{
  type: "timeGreeting",
  enable: true,
  position: "top",
  showOnPostPage: true,
},
```

---

## 三、时间进度与节日倒计时 <Schedule/>

### 效果
| 区域 | 内容 |
|---|---|
| 本年进度 | 百分比 + "本年还剩 N 天" + `<progress>` 进度条 |
| 本月进度 | 当月已过天数 / 剩余天数 |
| 本周进度 | 本周已过天数 / 剩余天数 |
| 节日倒计时 | "距离 ×× 节还有 N 天" + 日期 |

### 节假日来源

与 `/calendar/` 站点日历页 **同源**：`src/config/calendarConfig.ts` 的 `builtinHolidays`。

构建期用 `expandBuiltinHolidays()` + `lunar-typescript` 把公历和农历节日展开为当年与下一年公历日期，注入 `data-holidays` 属性：

```ts
// src/config/calendarConfig.ts
export const calendarConfig = {
  pages: { calendar: true },

  builtinHolidays: [
    // --- 公历 ---
    { name: "元旦",   type: "solar", month: 1,  day: 1 },
    { name: "国庆节", type: "solar", month: 10, day: 1 },
    // --- 农历 ---
    { name: "春节",   type: "lunar", month: 1,  day: 1 },
    { name: "中秋节", type: "lunar", month: 8,  day: 15 },
    { name: "除夕",   type: "lunar", month: 12, day: 30 },
    // ...更多节日见文件
  ] as HolidayEntry[],
};
```

### 农历换算

`src/utils/calendar-events.ts` 中的 `expandBuiltinHolidays()` 使用 `lunar-typescript`：

- `Lunar.fromYmd(year, month, day).getSolar()` 获取对应公历日期
- 除夕特殊处理：取次年正月初一前一天（部分年份腊月只有 29 天）
- 按日期排序后注入客户端

### 交互

- 点击卡片跳转到 `/calendar/` 站点日历页（由 `pages.calendar` 控制）
- 悬停抬升效果，同文章列表卡
- 每天 0 点自动重新计算（`setTimeout` 链式调度）
- 页面离开时 `pagehide` 清理定时器

### 启用

在 `src/config/sidebarConfig.ts` 的 `leftComponents` 中添加：

```ts
{
  type: "schedule",
  enable: true,
  position: "sticky",
  showOnPostPage: false,
},
```

### 改节日

**只改 `calendarConfig.builtinHolidays`**，Schedule 侧边栏与 `/calendar/` 页面会一起更新。

---

## 四、欢迎弹窗 <WelcomeToast/>

### 效果
| 行为 | 说明 |
|---|---|
| 出现位置 | 桌面端：右下角；移动端：底部居中 |
| 触发页面 | 仅首页（`/` 或 `/index.html`） |
| 问候文案 | 请求 IP API 显示地区名；失败则显示通用欢迎语 |
| 自动关闭 | 展示约 5 秒后滑出并移除 DOM |
| 会话限制 | 同一会话只弹一次（`sessionStorage` 标记） |

### 架构差异

与侧边栏组件不同，`WelcomeToast` **挂在 `MainGridLayout.astro` 主布局里**，不经过 `sidebarConfig`。因此在 `#navbar-wrapper` 内与 `<Navbar>` 同级渲染，不随 Swup 页面切换消失。

### IP 接口

```ts
const res = await fetch("https://v2.xxapi.cn/api/ip");
const data = await res.json();
// data.data.address → 城市名
```

失败时回退显示 **"你好，欢迎来到我的博客"**。可换成其他 IP 定位服务，改 `fetchLocation()` 即可。

### 自定义

- **每会话只弹一次**：`sessionStorage.setItem("blog_welcome_shown", "1")`，跨 Swup 导航不重复弹
- **每次从文章页回到首页再弹**：删除 `sessionStorage` 那行即可
- **每次刷新都弹**：同时删除 `sessionStorage` 检查和 `hasShownToast` 变量

---

## 五、时间线 <Timeline/>

### 效果
| 功能 | 说明 |
|---|---|
| 访问路径 | `/timeline/` |
| 导航入口 | 导航栏「我的」→「时间线」（番组计划下方） |
| 分类筛选 | 全部 / 教育经历 / 工作经历 / 项目经历 / 成就荣誉 |
| 卡片内容 | 标题、描述、机构/职位、技能标签、成就列表、外链、时间跨度 |
| 封面图 / 相册 | `image` 单张横幅封面；`images` 多图网格 |
| 进行中 | 不写 `endDate` 的条目显示"至今" + 绿色脉冲节点 |
| 精选 | `featured: true` 的条目标题旁显示星标 |

### 日常维护

数据在 `src/data/timeline.ts`，**数组顺序即页面展示顺序**（建议从新到旧排列）。改完后 `pnpm build` 即可生效，无需数据库。

#### 最小示例

```ts
import type { TimelineItem } from "@/components/features/timeline/types";

export const timelineData: TimelineItem[] = [
  // 进行中的工作（不写 endDate → 显示"至今"）
  {
    id: "work-2024",
    title: "后端开发工程师",
    description: "从事后端服务开发与维护。",
    type: "work",
    startDate: "2024-07-01",
    organization: "某互联网公司",
    position: "后端开发",
    skills: ["Go", "MySQL"],
    featured: true,
  },
  // 已完成的项目
  {
    id: "project-blog",
    title: "个人博客",
    description: "Astro + Firefly 主题搭建的个人博客。",
    type: "project",
    startDate: "2026-03-01",
    endDate: "2026-06-01",
    skills: ["Astro", "TypeScript"],
    links: [{ name: "GitHub", url: "https://github.com/...", type: "project" }],
  },
];
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✅ | 唯一标识，英文/连字符 |
| `title` / `description` | ✅ | 标题与描述 |
| `type` | ✅ | `education` / `work` / `project` / `achievement` |
| `startDate` | ✅ | `YYYY-MM-DD` |
| `endDate` | | 不填 = 进行中，显示"至今" |
| `organization` | | 机构名称 |
| `position` | | 职位 |
| `location` | | 地点 |
| `skills` | | 技能标签数组 |
| `achievements` | | 成就列表 |
| `links` | | `{ name, url, type }`，type 为 `website` / `certificate` / `project` / `other` |
| `image` | | 封面图 HTTPS URL |
| `images` | | 多图相册 URL 数组 |
| `featured` | | `true` 显示星标 |
| `color` | | 十六进制主题色 |
| `icon` | | Material Symbols 图标名（如 `material-symbols:school`） |

### 开关

在 `src/config/siteConfig.ts` 的 `pages` 中：

```ts
pages: {
  timeline: true,  // 设为 false → /timeline/ 返回 404，导航栏隐藏入口
}
```

### 运行机制

`Navbar.astro` 中通过 `pageKey: "timeline"` 检查 `siteConfig.pages.timeline !== false`，决定是否在导航栏渲染入口。`timeline.astro` 页面自身也检查 `siteConfig.pages.timeline`，为 `false` 时直接 `Astro.redirect("/404/")`。

---

## 六、项目展示 <Projects/>

### 效果
| 功能 | 说明 |
|---|---|
| 访问路径 | `/projects/` |
| 导航入口 | 导航栏「我的」→「项目展示」（时间线下方） |
| 分类筛选 | 全部 / 网页应用 / 移动应用 / 桌面应用 / 课程设计 / 其他 |
| 卡片内容 | 封面图或 B 站视频、标题、状态标签、描述、技术栈标签、访问链接、GitHub |
| B 站视频 | `bilibiliId` 填 BV 号，卡片顶部嵌入 iframe 播放器（**优先于封面图**） |
| 精选 | `featured: true` 的封面右上角显示星标 |
| 隐藏封面 | `showImage: false` 时不显示封面区（有视频时通常一并关闭） |
| 网格布局 | 桌面端 2 列，移动端 1 列，hover 抬升 + 阴影 |

### 日常维护

数据在 `src/data/projects.ts`。页面展示顺序 = 数组顺序。

#### 最小示例

```ts
import type { Project } from "@/components/features/projects/types";

export const projectsData: Project[] = [
  {
    id: "my-blog",
    title: "个人博客",
    description: "基于 Astro + Firefly 主题搭建的个人博客。",
    category: "web",
    techStack: ["Astro", "TypeScript", "Tailwind CSS"],
    status: "in-progress",
    visitUrl: "https://blog.example.com/",
    sourceCode: "https://github.com/yourname/blog",
    startDate: "2026-03-01",
    featured: true,
    showImage: false,
  },
  // 带 B 站视频的课程设计
  {
    id: "course-demo",
    title: "课程设计演示",
    description: "单片机课程设计录屏讲解。",
    category: "course",
    techStack: ["C51", "Proteus"],
    status: "completed",
    bilibiliId: "BV1Hg41137fw",  // 只填 BV 号
    visitUrl: "https://www.bilibili.com/video/BV1Hg41137fw/",
    startDate: "2024-03-01",
    endDate: "2024-06-01",
    showImage: false,
  },
];
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | ✅ | 唯一标识，英文/连字符 |
| `title` / `description` | ✅ | 标题与描述（描述最多显示两行） |
| `category` | ✅ | `web` / `mobile` / `desktop` / `course` / `other` |
| `techStack` | ✅ | 技术栈标签数组（最多显示 4 个，超出显示 +N） |
| `status` | ✅ | `completed` / `in-progress` / `planned` |
| `startDate` | ✅ | `YYYY-MM-DD` |
| `image` | | 封面图 HTTPS URL |
| `bilibiliId` | | B 站 BV 号（如 `BV1Hg41137fw`），顶部嵌入播放器 |
| `visitUrl` | | 访问/演示链接，显示"前往"按钮 |
| `sourceCode` | | GitHub 源链接，显示图标按钮 |
| `featured` | | `true` 时右上角显示星标 |
| `showImage` | | `false` 时不显示封面区 |

### 封面与视频优先级

```txt
bilibiliId 有值 → 展示 B 站 iframe 播放器
             ↓ (image + showImage !== false) → 展示封面图
             ↓ 以上条件都不满足 → 仅显示文字卡片
```

视频播放器地址格式（组件内已拼接）：
```txt
//player.bilibili.com/player.html?bvid=BV1Hg41137fw&p=1&autoplay=0&high_quality=1
```

若播放器空白，检查 CSP / `siteConfig.imgDomains` 是否放行 `*.bilibili.com`。

### 分类

| 值 | 筛选标签 | 适用场景 |
|---|---|---|
| `web` | 网页应用 | 网站、博客、后台管理系统 |
| `mobile` | 移动应用 | 小程序、App |
| `desktop` | 桌面应用 | 桌面客户端、Electron |
| `course` | 课程设计 | 课设、实训、答辩录屏、硬件实验等 |
| `other` | 其他 | 工具库、开源索引、游戏服务端等 |

---

## 七、备案号与页脚信息

### 修改内容

1. `src/config/FooterConfig.html` — 写入 ICP + 公网安备链接
2. `src/config/footerConfig.ts` — `enable: true`
3. `src/config/sidebarConfig.ts` — 右侧栏站点信息 `enable: false`，`unknownBuildPlatform` 改为 `"EdgeOne"`（需恢复时改回 `true` 即可）

```html
<!-- FooterConfig.html -->
<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
  冀ICP备2026020095号
</a>
<a href="https://beian.mps.gov.cn/" target="_blank" rel="noopener noreferrer">
  冀公网安备13032202000220号
</a>
```

### 恢复侧边栏站点信息

SideBar 注册和组件本身仍保留。把 `sidebarConfig` 右侧 `siteInfo` 的 `enable` 改回 `true` 即可与页脚同时出现。

---

## 涉及文件一览

### 新增

| 文件 | 功能 |
|---|---|
| `src/config/weatherConfig.ts` | 天气预报配置 |
| `src/components/widget/Weather.astro` | 天气预报组件 |
| `src/components/widget/TimeGreeting.astro` | 时间问候组件 |
| `src/config/calendarConfig.ts` | 节假日配置 |
| `src/utils/calendar-events.ts` | 农历 → 公历换算工具 |
| `src/components/widget/Schedule.astro` | 时间进度 + 节日倒计时组件 |
| `src/components/widget/WelcomeToast.astro` | 首页欢迎弹窗 |
| `src/data/timeline.ts` | 时间线数据 |
| `src/components/features/timeline/types.ts` | 时间线类型定义 |
| `src/components/features/timeline/TimelineCard.astro` | 时间线条目卡片 |
| `src/components/features/timeline/index.ts` | 时间线组件导出 |
| `src/components/features/page-header/types.ts` | 页头类型定义 |
| `src/components/features/page-header/PageHeader.astro` | 页面标题组件 |
| `src/components/features/page-header/index.ts` | 页头组件导出 |
| `src/components/atoms/FilterTabs.astro` | 筛选标签组件 |
| `src/components/atoms/index.ts` | atoms 组件导出 |
| `public/js/filter-tabs-handler.js` | 筛选交互脚本 |
| `src/pages/timeline.astro` | 时间线页面 |
| `src/data/projects.ts` | 项目数据 |
| `src/components/features/projects/types.ts` | 项目类型定义 |
| `src/components/features/projects/ProjectCard.astro` | 项目卡片组件 |
| `src/components/features/projects/index.ts` | 项目组件导出 |
| `src/pages/projects.astro` | 项目展示页面 |

### 修改

| 文件 | 变更 |
|---|---|
| `src/types/sidebarConfig.ts` | `WidgetComponentType` 增加 `weather`、`timeGreeting`、`schedule` |
| `src/types/siteConfig.ts` | `pages` 增加 `timeline`、`projects` |
| `src/config/index.ts` | 导出 `weatherConfig`、`calendarConfig` |
| `src/config/siteConfig.ts` | 开启 `timeline: true`、`projects: true` |
| `src/config/sidebarConfig.ts` | 启用 weather / timeGreeting / schedule；关闭 siteInfo |
| `src/config/footerConfig.ts` | 启用 `enable: true` |
| `src/config/FooterConfig.html` | ICP + 公网安备备案号 |
| `src/config/navBarConfig.ts` | 导航栏「我的」增加时间线、项目展示入口 |
| `src/components/layout/SideBar.astro` | 注册 Weather、TimeGreeting、Schedule |
| `src/components/layout/Navbar.astro` | 通过 `pageKey` 过滤开关页面 |
| `src/layouts/MainGridLayout.astro` | 引入 WelcomeToast |
| `src/i18n/i18nKey.ts` | 增加天气、时间线、项目展示 i18n key |
| `src/i18n/languages/*.ts` (6个) | 增加对应翻译文案 |
| `package.json` | 新依赖 `lunar-typescript` |

---

## 运行验证

```bash
pnpm check     # 类型检查 → 0 errors, 0 warnings
pnpm build     # 生产构建 → Complete!
pnpm dev       # 本地预览 http://localhost:4321
```

各页面访问：
- `/timeline/` — 时间线
- `/projects/` — 项目展示
- `/calendar/` — 站点日历（与 Schedule 同源节日列表）
- 首页右侧栏 — Weather + TimeGreeting
- 首页左侧栏 — Schedule（时间进度 + 节日倒计时）
- 首页右下角 — WelcomeToast 欢迎弹窗
- 页脚 — ICP 备案号、公网安备号
