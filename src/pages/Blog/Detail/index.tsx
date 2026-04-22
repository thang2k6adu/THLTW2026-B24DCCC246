import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Tag, Typography } from 'antd';
import { marked } from 'marked';
import moment from 'moment';
import { useEffect, useMemo, useRef } from 'react';
import { history, useModel } from 'umi';
import '../style.less';

type DetailProps = {
	match: {
		params: {
			slug: string;
		};
	};
};

const BlogDetailPage = (props: DetailProps) => {
	const {
		match: {
			params: { slug },
		},
	} = props;
	const { posts, tags, loadBlogData, increaseView } = useModel('blog');
	const viewedSlugRef = useRef<string>('');

	useEffect(() => {
		loadBlogData();
	}, []);

	const post = useMemo(
		() => posts.find((item) => item.slug === slug && item.status === 'published'),
		[posts, slug],
	);

	useEffect(() => {
		if (post && viewedSlugRef.current !== slug) {
			viewedSlugRef.current = slug;
			increaseView(post.id);
		}
	}, [increaseView, post, slug]);

	const htmlContent = useMemo(() => {
		if (!post) return '';
		return marked.parse(post.content, { breaks: true, gfm: true }) as string;
	}, [post]);

	const getTagName = (tagId: string) => tags.find((tag) => tag.id === tagId)?.name || tagId;

	const relatedPosts = useMemo(() => {
		if (!post) return [];
		return posts
			.filter(
				item =>
					item.id !== post.id &&
					item.status === 'published' &&
					item.tagIds.some((tagId) => post.tagIds.includes(tagId)),
			)
			.slice(0, 3);
	}, [post, posts]);

	if (!post) {
		return (
			<Card>
				<Empty description='Không tìm thấy bài viết' />
				<Button type='link' onClick={() => history.push('/blog')} icon={<ArrowLeftOutlined />}>
					Quay lại danh sách
				</Button>
			</Card>
		);
	}

	return (
		<div className='blog-detail'>
			<Card>
				<Button type='link' icon={<ArrowLeftOutlined />} onClick={() => history.push('/blog')}>
					Quay lại danh sách
				</Button>
				<Typography.Title>{post.title}</Typography.Title>
				<img src={post.coverImage} alt={post.title} className='blog-detail-cover' />
				<div className='blog-detail-meta'>
					Tác giả: {post.author} · Ngày đăng: {moment(post.createdAt).format('DD/MM/YYYY')} · Lượt xem: {post.views}
				</div>
				<div style={{ marginBottom: 16 }}>
					{post.tagIds.map((tagId) => (
						<Tag key={tagId}>{getTagName(tagId)}</Tag>
					))}
				</div>
				<div className='blog-markdown' dangerouslySetInnerHTML={{ __html: htmlContent }} />
			</Card>

			<Card title='Bài viết liên quan' style={{ marginTop: 16 }}>
				{relatedPosts.length === 0 ? (
					<Empty description='Chưa có bài viết liên quan' />
				) : (
					<Row gutter={[16, 16]}>
						{relatedPosts.map((item) => (
							<Col span={24} key={item.id}>
								<Card size='small' hoverable onClick={() => history.push(`/blog/${item.slug}`)}>
									<Typography.Text strong>{item.title}</Typography.Text>
									<div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
										{moment(item.createdAt).format('DD/MM/YYYY')} · {item.author}
									</div>
								</Card>
							</Col>
						))}
					</Row>
				)}
			</Card>
		</div>
	);
};

export default BlogDetailPage;