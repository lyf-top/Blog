export interface Project {
	id: string;
	title: string;
	description: string;
	image?: string;
	/** B 站视频 BV 号，如 BV1Hg41137fw，卡片顶部嵌入播放器 */
	bilibiliId?: string;
	category: "web" | "mobile" | "desktop" | "course" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export interface ProjectCardProps {
	project: Project;
	maxTechStack?: number;
}
