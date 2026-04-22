import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Modal, Popconfirm, Space, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

type TagFormValues = {
	name: string;
};

const AdminTagsPage = () => {
	const { tags, tagCountMap, loadBlogData, createTag, editTag, removeTag, isTagNameDuplicate } = useModel('blog');
	const [form] = Form.useForm<TagFormValues>();
	const [keyword, setKeyword] = useState<string>('');
	const [visible, setVisible] = useState<boolean>(false);
	const [editingTag, setEditingTag] = useState<Blog.TagItem | undefined>();

	useEffect(() => {
		loadBlogData();
	}, []);

	const filteredTags = useMemo(() => {
		if (!keyword.trim()) return tags;
		const normalized = keyword.trim().toLowerCase();
		return tags.filter((tag) => tag.name.toLowerCase().includes(normalized));
	}, [keyword, tags]);

	const openCreate = () => {
		setEditingTag(undefined);
		form.resetFields();
		setVisible(true);
	};

	const openEdit = (tag: Blog.TagItem) => {
		setEditingTag(tag);
		form.setFieldsValue({ name: tag.name });
		setVisible(true);
	};

	const submitForm = async (values: TagFormValues) => {
		if (isTagNameDuplicate(values.name, editingTag?.id)) {
			message.error('Tên thẻ đã tồn tại.');
			return;
		}

		if (editingTag) {
			editTag(editingTag.id, values);
			message.success('Cập nhật thẻ thành công.');
		} else {
			createTag(values);
			message.success('Thêm thẻ thành công.');
		}
		setVisible(false);
	};

	return (
		<Card
			title='Quản lý thẻ'
			extra={
				<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}>
					Thêm thẻ
				</Button>
			}
		>
			<Input
				placeholder='Tìm thẻ theo tên'
				value={keyword}
				onChange={(event) => setKeyword(event.target.value)}
				allowClear
				style={{ width: 320, marginBottom: 16 }}
			/>
			<Table
				rowKey='id'
				dataSource={filteredTags}
				pagination={{ pageSize: 10 }}
				columns={[
					{ title: 'Tên thẻ', dataIndex: 'name', key: 'name' },
					{
						title: 'Số bài viết đang dùng',
						key: 'count',
						render: (_: any, record: Blog.TagItem) => tagCountMap[record.id] || 0,
						width: 200,
					},
					{
						title: 'Thao tác',
						key: 'action',
						width: 180,
						render: (_: any, record: Blog.TagItem) => (
							<Space>
								<Button type='link' onClick={() => openEdit(record)}>
									Sửa
								</Button>
								<Popconfirm
									title='Xóa thẻ này? Thẻ sẽ bị gỡ khỏi các bài viết liên quan.'
									onConfirm={() => {
										removeTag(record.id);
										message.success('Đã xóa thẻ.');
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
				title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ'}
				onCancel={() => setVisible(false)}
				onOk={() => form.submit()}
			>
				<Form form={form} layout='vertical' onFinish={submitForm}>
					<Form.Item
						label='Tên thẻ'
						name='name'
						rules={[
							{ required: true, message: 'Vui lòng nhập tên thẻ.' },
							{ max: 30, message: 'Tên thẻ tối đa 30 ký tự.' },
						]}
					>
						<Input />
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default AdminTagsPage;