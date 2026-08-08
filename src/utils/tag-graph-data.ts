export interface TagGraphNode {
	name: string;
	value: number;
	url?: string;
}

export interface TagGraphLink {
	source: string;
	target: string;
	value: number;
}

export interface TagGraphData {
	nodes: TagGraphNode[];
	links: TagGraphLink[];
	threshold: number;
}

export interface TagGraphInputPost {
	tags: string[];
}

/**
 * 构建标签力导向图数据
 * 遍历所有文章,统计每个标签的引用次数（节点 value）
 * 同一篇文章内的标签两两组合,累加共现次数（边 value）
 * 仅保留共现次数 >= threshold 的边
 */
export function buildTagGraphData(
	posts: TagGraphInputPost[],
	threshold = 2,
): TagGraphData {
	const tagCountMap = new Map<string, number>();
	const cooccurMap = new Map<string, number>();

	for (const post of posts) {
		const tags = post.tags.filter((t) => t && t.trim());
		if (tags.length === 0) continue;

		// 统计标签频率
		for (const tag of tags) {
			tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
		}

		// 共现统计
		for (let i = 0; i < tags.length; i++) {
			for (let j = i + 1; j < tags.length; j++) {
				const [a, b] =
					tags[i] < tags[j] ? [tags[i], tags[j]] : [tags[j], tags[i]];
				const key = `${a}|||${b}`;
				cooccurMap.set(key, (cooccurMap.get(key) || 0) + 1);
			}
		}
	}

	// 构建节点
	const nodes: TagGraphNode[] = [];
	const nodeNameSet = new Set<string>();
	for (const [name, count] of tagCountMap) {
		nodeNameSet.add(name);
		nodes.push({
			name,
			value: count,
		});
	}

	// 构建边（过滤低于阈值的）
	const links: TagGraphLink[] = [];
	for (const [key, count] of cooccurMap) {
		if (count < threshold) continue;
		const [source, target] = key.split("|||");
		if (nodeNameSet.has(source) && nodeNameSet.has(target)) {
			links.push({ source, target, value: count });
		}
	}

	return { nodes, links, threshold };
}
