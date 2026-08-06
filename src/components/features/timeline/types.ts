export interface TimelineLink {
	name: string;
	url: string;
	type: "website" | "certificate" | "project" | "other";
}

export interface TimelineItem {
	id: string;
	title: string;
	description: string;
	type: "education" | "work" | "project" | "achievement";
	startDate: string;
	endDate?: string;
	location?: string;
	organization?: string;
	position?: string;
	skills?: string[];
	achievements?: string[];
	links?: TimelineLink[];
	/** 封面图 URL（卡片顶部横幅） */
	image?: string;
	/** 封面图 alt，默认使用 title */
	imageAlt?: string;
	/** 多图相册 URL 列表（显示在正文下方） */
	images?: string[];
	icon?: string;
	color?: string;
	featured?: boolean;
}

export interface TimelineCardProps {
	item: TimelineItem;
	maxSkills?: number;
}
