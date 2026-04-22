import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Input, Pagination, Row, Tag, Typography } from 'antd';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { history, useModel } from 'umi';
import './style.less';

const PAGE_SIZE = 9;

const BlogPage = () => {
	const { posts, tags, loadBlogData, tagCountMap } = useModel('blog');
	const [keywordInput, setKeywordInput] = useState<string>('');
	const [keyword, setKeyword] = useState<string>('');
	const [activeTagId, setActiveTagId] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState<number>(1);

	useEffect(() => {
		loadBlogData();
	}, []);

	const updateKeyword = useMemo(
		() =>
			debounce((value: string) => {
				setKeyword(value.trim().toLowerCase());
			}, 300),
		[],
	);

	useEffect(() => {
		return () => updateKeyword.cancel();
	}, [updateKeyword]);

	useEffect(() => {
		setCurrentPage(1);
	}, [activeTagId, keyword]);

	const publishedPosts = useMemo(() => posts.filter((post) => post.status === 'published'), [posts]);

	const filteredPosts = useMemo(() => {
		return publishedPosts.filter((post) => {
			const matchTag = activeTagId === 'all' || post.tagIds.includes(activeTagId);
			if (!matchTag) return false;

			if (!keyword) return true;
			const source = `${post.title} ${post.summary} ${post.author}`.toLowerCase();
			return source.includes(keyword);
		});
	}, [activeTagId, keyword, publishedPosts]);

	const total = filteredPosts.length;
	const list = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const getTagName = (tagId: string) => tags.find((tag) => tag.id === tagId)?.name || tagId;

	return (
		<div className='blog-page'>
			<Card title='Blog cá nhân'>
				<div className='blog-toolbar'>
					<Input
						prefix={<SearchOutlined />}
						placeholder='Tìm theo tiêu đề, tóm tắt, tác giả...'
						value={keywordInput}
						onChange={(event) => {
							const value = event.target.value;
							setKeywordInput(value);
							updateKeyword(value);
						}}
						allowClear
						style={{ maxWidth: 420 }}
					/>
					<Button onClick={() => history.push('/blog/about')}>Giới thiệu tác giả</Button>
				</div>

				<div className='blog-tags-filter'>
					<Tag color={activeTagId === 'all' ? 'blue' : 'default'} onClick={() => setActiveTagId('all')}>
						Tất cả ({publishedPosts.length})
					</Tag>
					{tags.map((tag) => (
						<Tag
							key={tag.id}
							color={activeTagId === tag.id ? 'blue' : 'default'}
							onClick={() => setActiveTagId(tag.id)}
						>
							{tag.name} ({tagCountMap[tag.id] || 0})
						</Tag>
					))}
				</div>

				{list.length === 0 ? (
					<Empty description='Không tìm thấy bài viết phù hợp' />
				) : (
					<Row gutter={[16, 16]}>
						{list.map((post) => (
							<Col xs={24} sm={12} lg={8} key={post.id}>
								<Card className='blog-card' cover={<img src={post.coverImage} alt={post.title} />} hoverable>
									<Typography.Title level={4}>{post.title}</Typography.Title>
									<div className='blog-card-meta'>
										{moment(post.createdAt).format('DD/MM/YYYY')} · {post.author}
									</div>
									<div className='blog-card-summary'>{post.summary}</div>
									<div style={{ marginBottom: 12 }}>
										{post.tagIds.map((tagId) => (
											<Tag key={tagId}>{getTagName(tagId)}</Tag>
										))}
									</div>
									<Button type='link' onClick={() => history.push(`/blog/${post.slug}`)}>
										Đọc bài viết
									</Button>
								</Card>
							</Col>
						))}
					</Row>
				)}

				{total > PAGE_SIZE ? (
					<div className='blog-pagination'>
						<Pagination
							pageSize={PAGE_SIZE}
							current={currentPage}
							total={total}
							onChange={(page) => setCurrentPage(page)}
						/>
					</div>
				) : null}
			</Card>
		</div>
	);
};

export default BlogPage;