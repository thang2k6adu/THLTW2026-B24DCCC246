import { defaultBlogData } from './data';

const BLOG_STORAGE_KEY = 'blog_personal_app_data';

const normalizeSlug = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');

const buildId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const sortPostsDesc = (posts: Blog.PostItem[]) =>
	[...posts].sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());

const sortTagsAsc = (tags: Blog.TagItem[]) => [...tags].sort((a, b) => a.name.localeCompare(b.name));

const writeBlogData = (data: Blog.BlogStorageData) => {
	localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(data));
};

export const initializeBlogData = () => {
	const raw = localStorage.getItem(BLOG_STORAGE_KEY);
	if (!raw) {
		writeBlogData(defaultBlogData);
		return defaultBlogData;
	}

	try {
		const parsed = JSON.parse(raw) as Blog.BlogStorageData;
		if (!Array.isArray(parsed.posts) || !Array.isArray(parsed.tags)) {
			writeBlogData(defaultBlogData);
			return defaultBlogData;
		}
		return parsed;
	} catch (error) {
		writeBlogData(defaultBlogData);
		return defaultBlogData;
	}
};

export const getBlogData = (): Blog.BlogStorageData => initializeBlogData();

export const getBlogPosts = () => sortPostsDesc(getBlogData().posts);

export const getBlogTags = () => sortTagsAsc(getBlogData().tags);

export const addBlogPost = (payload: Blog.PostPayload) => {
	const data = getBlogData();
	const now = new Date().toISOString();
	const nextSlug = normalizeSlug(payload.slug || payload.title);
	const post: Blog.PostItem = {
		id: buildId(),
		title: payload.title.trim(),
		slug: nextSlug,
		summary: payload.summary.trim(),
		content: payload.content,
		coverImage: payload.coverImage.trim(),
		tagIds: payload.tagIds,
		status: payload.status,
		views: 0,
		author: payload.author.trim(),
		createdAt: now,
		updatedAt: now,
	};
	const nextData = {
		...data,
		posts: [post, ...data.posts],
	};
	writeBlogData(nextData);
	return post;
};

export const updateBlogPost = (id: string, payload: Blog.PostPayload) => {
	const data = getBlogData();
	const nextSlug = normalizeSlug(payload.slug || payload.title);
	const nextPosts = data.posts.map((post) =>
		post.id === id
			? {
					...post,
					title: payload.title.trim(),
					slug: nextSlug,
					summary: payload.summary.trim(),
					content: payload.content,
					coverImage: payload.coverImage.trim(),
					tagIds: payload.tagIds,
					status: payload.status,
					author: payload.author.trim(),
					updatedAt: new Date().toISOString(),
			  }
			: post,
	);
	writeBlogData({
		...data,
		posts: nextPosts,
	});
};

export const deleteBlogPost = (id: string) => {
	const data = getBlogData();
	writeBlogData({
		...data,
		posts: data.posts.filter((post) => post.id !== id),
	});
};

export const increasePostView = (id: string) => {
	const data = getBlogData();
	const nextPosts = data.posts.map((post) => (post.id === id ? { ...post, views: post.views + 1 } : post));
	writeBlogData({
		...data,
		posts: nextPosts,
	});
};

export const addBlogTag = (payload: Blog.TagPayload) => {
	const data = getBlogData();
	const now = new Date().toISOString();
	const tag: Blog.TagItem = {
		id: buildId(),
		name: payload.name.trim(),
		createdAt: now,
	};
	writeBlogData({
		...data,
		tags: [...data.tags, tag],
	});
	return tag;
};

export const updateBlogTag = (id: string, payload: Blog.TagPayload) => {
	const data = getBlogData();
	writeBlogData({
		...data,
		tags: data.tags.map((tag) => (tag.id === id ? { ...tag, name: payload.name.trim() } : tag)),
	});
};

export const deleteBlogTag = (id: string) => {
	const data = getBlogData();
	writeBlogData({
		posts: data.posts.map((post) => ({
			...post,
			tagIds: post.tagIds.filter((tagId) => tagId !== id),
		})),
		tags: data.tags.filter((tag) => tag.id !== id),
	});
};

export const isSlugDuplicate = (slug: string, editingPostId?: string) => {
	const nextSlug = normalizeSlug(slug);
	return getBlogData().posts.some((post) => post.slug === nextSlug && post.id !== editingPostId);
};

export const isTagNameDuplicate = (name: string, editingTagId?: string) => {
	const normalized = name.trim().toLowerCase();
	return getBlogData().tags.some((tag) => tag.name.trim().toLowerCase() === normalized && tag.id !== editingTagId);
};

export const getNormalizedSlug = normalizeSlug;
