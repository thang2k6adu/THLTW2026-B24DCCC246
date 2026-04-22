declare module Blog {
	export type PostStatus = 'draft' | 'published';

	export interface TagItem {
		id: string;
		name: string;
		createdAt: string;
	}

	export interface PostItem {
		id: string;
		title: string;
		slug: string;
		summary: string;
		content: string;
		coverImage: string;
		tagIds: string[];
		status: PostStatus;
		views: number;
		author: string;
		createdAt: string;
		updatedAt: string;
	}

	export interface BlogStorageData {
		posts: PostItem[];
		tags: TagItem[];
	}

	export interface PostPayload {
		title: string;
		slug: string;
		summary: string;
		content: string;
		coverImage: string;
		tagIds: string[];
		status: PostStatus;
		author: string;
	}

	export interface TagPayload {
		name: string;
	}
}