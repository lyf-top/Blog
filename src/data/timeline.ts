import type { TimelineItem } from "@/components/features/timeline/types";

export const timelineData: TimelineItem[] = [
	{
		id: "java-learning",
		title: "Java 后端学习",
		description: "系统学习 Java 后端开发，包括 Java 基础、Java Web、Spring Boot、数据库等核心技术栈。",
		type: "education",
		startDate: "2024-01-01",
		skills: ["Java", "Spring Boot", "MySQL", "MyBatis", "Maven"],
		achievements: ["完成苍穹外卖项目", "掌握三层架构与 IoC/DI"],
		icon: "material-symbols:school",
		color: "#f89820",
		featured: true,
	},
	{
		id: "agent-dev",
		title: "AI Agent 开发",
		description: "学习 AI Agent 开发技术，包括 FastAPI 后端、Python 数据处理、知识库构建等。",
		type: "project",
		startDate: "2025-01-01",
		skills: ["Python", "FastAPI", "Agent", "RAG"],
		icon: "material-symbols:psychology",
		color: "#6366f1",
	},
	{
		id: "frontend-learning",
		title: "前端开发学习",
		description: "学习 HTML、CSS、JavaScript 等前端基础技术，为全栈开发打下基础。",
		type: "education",
		startDate: "2024-06-01",
		endDate: "2024-12-31",
		skills: ["HTML", "CSS", "JavaScript", "Astro"],
		icon: "material-symbols:code",
		color: "#059669",
	},
];
