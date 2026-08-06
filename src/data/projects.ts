import type { Project } from "@/components/features/projects/types";

export const projectsData: Project[] = [
	{
		id: "astroblog",
		title: "个人博客",
		description: "基于 Astro + Firefly 主题搭建的个人博客，支持评论、统计与多页面扩展。",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS"],
		status: "in-progress",
		visitUrl: "https://blog.f3f3.top/",
		startDate: "2026-01-01",
		featured: true,
		tags: ["Blog"],
	},
	{
		id: "cangqiong-waimai",
		title: "苍穹外卖",
		description: "Java Spring Boot 后端外卖管理系统，涵盖三层架构、MyBatis、IoC/DI 等企业级技术栈。",
		category: "web",
		techStack: ["Java", "Spring Boot", "MySQL", "MyBatis"],
		status: "completed",
		startDate: "2024-06-01",
		endDate: "2024-09-30",
		tags: ["后端", "课程设计"],
	},
	{
		id: "agent-knowledge-base",
		title: "AI Agent 知识库",
		description: "基于 Python + FastAPI 构建的 AI Agent 知识库系统，支持 RAG 检索与对话。",
		category: "web",
		techStack: ["Python", "FastAPI", "RAG"],
		status: "in-progress",
		startDate: "2025-01-01",
		tags: ["AI", "Agent"],
	},
];
