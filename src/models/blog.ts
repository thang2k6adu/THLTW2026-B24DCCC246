import {
	addBlogPost,
	addBlogTag,
	deleteBlogPost,
	deleteBlogTag,
	getBlogPosts,
	getBlogTags,
	getNormalizedSlug,
	increasePostView,
	initializeBlogData,
	isSlugDuplicate,
	isTagNameDuplicate,
	updateBlogPost,
	updateBlogTag,
} from '@/services/Blog';
import { useCallback, useMemo, useState } from 'react';

export default () => {
	const [posts, setPosts] = useState<Blog.PostItem[]>([]);
	const [tags, setTags] = useState<Blog.TagItem[]>([]);

	const loadBlogData = useCallback(() => {
		initializeBlogData();
		setPosts(getBlogPosts());
		setTags(getBlogTags());
	}, []);

	const createPost = useCallback(
		(payload: Blog.PostPayload) => {
			addBlogPost(payload);
			loadBlogData();
		},
		[loadBlogData],
	);

	const editPost = useCallback(
		(id: string, payload: Blog.PostPayload) => {
			updateBlogPost(id, payload);
			loadBlogData();
		},
		[loadBlogData],
	);

	const removePost = useCallback(
		(id: string) => {
			deleteBlogPost(id);
			loadBlogData();
		},
		[loadBlogData],
	);

	const createTag = useCallback(
		(payload: Blog.TagPayload) => {
			addBlogTag(payload);
			loadBlogData();
		},
		[loadBlogData],
	);

	const editTag = useCallback(
		(id: string, payload: Blog.TagPayload) => {
			updateBlogTag(id, payload);
			loadBlogData();
		},
		[loadBlogData],
	);

	const removeTag = useCallback(
		(id: string) => {
			deleteBlogTag(id);
			loadBlogData();
		},
		[loadBlogData],
	);

	const increaseView = useCallback(
		(id: string) => {
			increasePostView(id);
			loadBlogData();
		},
		[loadBlogData],
	);

	const tagCountMap = useMemo(() => {
		return posts.reduce<Record<string, number>>((acc, post) => {
			post.tagIds.forEach((tagId) => {
				acc[tagId] = (acc[tagId] || 0) + 1;
			});
			return acc;
		}, {});
	}, [posts]);

	return {
		posts,
		tags,
		tagCountMap,
		loadBlogData,
		createPost,
		editPost,
		removePost,
		createTag,
		editTag,
		removeTag,
		increaseView,
		isSlugDuplicate,
		isTagNameDuplicate,
		getNormalizedSlug,
	};
};