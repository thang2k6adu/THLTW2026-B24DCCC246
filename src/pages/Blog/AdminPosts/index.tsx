import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

type PostFormValues = {
	title: string;
	slug: string;
	summary: string;
	content: string;
	coverImage: string;
	tagIds: string[];
	status: Blog.PostStatus;
	author: string;
};

const AdminPostsPage = () => {
	const {
		posts,
		tags,
		loadBlogData,
		createPost,
		editPost,
		removePost,
		isSlugDuplicate,
		getNormalizedSlug,
	} = useModel('blog');
	const [form] = Form.useForm<PostFormValues>();
	const [keyword, setKeyword] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<'all' | Blog.PostStatus>('all');
	const [visible, setVisible] = useState<boolean>(false);
	const [editingPost, setEditingPost] = useState<Blog.PostItem | undefined>();

	useEffect(() => {
		loadBlogData();
	}, []);

	const getTagName = (tagId: string) => tags.find((tag) => tag.id === tagId)?.name || tagId;

	const filteredPosts = useMemo(() => {
		return posts.filter((post) => {
			const matchKeyword = post.title.toLowerCase().includes(keyword.trim().toLowerCase());
			const matchStatus = statusFilter === 'all' || post.status === statusFilter;
			return matchKeyword && matchStatus;
		});
	}, [keyword, posts, statusFilter]);

	const openCreate = () => {
		setEditingPost(undefined);
		form.resetFields();
		form.setFieldsValue({
			status: 'draft',
			tagIds: [],
			author: 'Nguyen Van A',
		});
		setVisible(true);
	};

	const openEdit = (post: Blog.PostItem) => {
		setEditingPost(post);
		form.setFieldsValue({
			title: post.title,
			slug: post.slug,
			summary: post.summary,
			content: post.content,
			coverImage: post.coverImage,
			tagIds: post.tagIds,
			status: post.status,
			author: post.author,
		});
		setVisible(true);
	};

	const submitForm = async (values: PostFormValues) => {
		const nextSlug = getNormalizedSlug(values.slug || values.title);
		if (!nextSlug) {
			message.error('Slug không hợp lệ.');
			return;
		}

		if (isSlugDuplicate(nextSlug, editingPost?.id)) {
			message.error('Slug đã tồn tại, vui lòng chọn slug khác.');
			return;
		}

		const payload: Blog.PostPayload = {
			...values,
			slug: nextSlug,
		};

		if (editingPost) {
			editPost(editingPost.id, payload);
			message.success('Cập nhật bài viết thành công.');
		} else {
			createPost(payload);
			message.success('Thêm bài viết mới thành công.');
		}
		setVisible(false);
	};

	return (
		<Card
			title='Quản lý bài viết'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
					Thêm bài viết
				</Button>
			}
		>
			<Space style={{ marginBottom: 16 }} wrap>
				<Input
					placeholder='Tìm theo tiêu đề'
					value={keyword}
					onChange={(event) => setKeyword(event.target.value)}
					allowClear
					style={{ width: 260 }}
				/>
				<Select
					value={statusFilter}
					onChange={(value) => setStatusFilter(value)}
					style={{ width: 180 }}
					options={[
						{ label: 'Tất cả trạng thái', value: 'all' },
						{ label: 'Nháp', value: 'draft' },
						{ label: 'Đã đăng', value: 'published' },
					]}
				/>
			</Space>

			<Table
				rowKey='id'
				dataSource={filteredPosts}
				pagination={{ pageSize: 10 }}
				columns={[
					{
						title: 'Tiêu đề',
						dataIndex: 'title',
						key: 'title',
						width: 260,
					},
					{
						title: 'Trạng thái',
						dataIndex: 'status',
						key: 'status',
						render: (value: Blog.PostStatus) => (
							<Tag color={value === 'published' ? 'green' : 'orange'}>{value === 'published' ? 'Đã đăng' : 'Nháp'}</Tag>
						),
					},
					{
						title: 'Thẻ',
						dataIndex: 'tagIds',
						key: 'tagIds',
						render: (value: string[]) => value.map((tagId) => <Tag key={tagId}>{getTagName(tagId)}</Tag>),
					},
					{
						title: 'Lượt xem',
						dataIndex: 'views',
						key: 'views',
						width: 100,
					},
					{
						title: 'Ngày tạo',
						dataIndex: 'createdAt',
						key: 'createdAt',
						width: 140,
						render: (value: string) => moment(value).format('DD/MM/YYYY'),
					},
					{
						title: 'Thao tác',
						key: 'action',
						width: 160,
						render: (_: any, record: Blog.PostItem) => (
							<Space>
								<Button type='link' onClick={() => openEdit(record)}>
									Sửa
								</Button>
								<Popconfirm
									title='Bạn chắc chắn muốn xóa bài viết này?'
									onConfirm={() => {
										removePost(record.id);
										message.success('Đã xóa bài viết.');
									}}
								>
									<Button type='link' danger>
										Xóa
									</Button>
								</Popconfirm>
							</Space>
						),
					},
				]}
			/>

			<Modal
				destroyOnClose
				visible={visible}
				title={editingPost ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}
				onCancel={() => setVisible(false)}
				onOk={() => form.submit()}
				width={900}
			>
				<Form form={form} layout='vertical' onFinish={submitForm}>
					<Form.Item label='Tiêu đề' name='title' rules={[{ required: true, message: 'Vui lòng nhập tiêu đề.' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label='Slug'
						name='slug'
						extra='Có thể để trống, hệ thống tự sinh theo tiêu đề.'
						rules={[{ required: true, message: 'Vui lòng nhập slug.' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Tóm tắt'
						name='summary'
						rules={[{ required: true, message: 'Vui lòng nhập tóm tắt bài viết.' }]}
					>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item
						label='Ảnh đại diện (URL)'
						name='coverImage'
						rules={[
							{ required: true, message: 'Vui lòng nhập URL ảnh đại diện.' },
							{ type: 'url', message: 'URL ảnh không hợp lệ.' },
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Thẻ'
						name='tagIds'
						rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 thẻ.' }]}
					>
						<Select
							mode='multiple'
							options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
							placeholder='Chọn thẻ'
						/>
					</Form.Item>
					<Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Vui lòng chọn trạng thái.' }]}>
						<Select
							options={[
								{ label: 'Nháp', value: 'draft' },
								{ label: 'Đã đăng', value: 'published' },
							]}
						/>
					</Form.Item>
					<Form.Item label='Tác giả' name='author' rules={[{ required: true, message: 'Vui lòng nhập tên tác giả.' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label='Nội dung (Markdown)'
						name='content'
						rules={[{ required: true, message: 'Vui lòng nhập nội dung.' }]}
					>
						<Input.TextArea rows={10} />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default AdminPostsPage;