const now = new Date();

const daysAgo = (days: number) => {
	const value = new Date(now);
	value.setDate(value.getDate() - days);
	return value.toISOString();
};

const defaultTags: Blog.TagItem[] = [
	{ id: 'tag-react', name: 'React', createdAt: daysAgo(20) },
	{ id: 'tag-typescript', name: 'TypeScript', createdAt: daysAgo(19) },
	{ id: 'tag-frontend', name: 'Frontend', createdAt: daysAgo(18) },
	{ id: 'tag-productivity', name: 'Productivity', createdAt: daysAgo(17) },
	{ id: 'tag-learning', name: 'Learning', createdAt: daysAgo(16) },
	{ id: 'tag-life', name: 'Life', createdAt: daysAgo(15) },
];

const markdownTemplate = (title: string, topic: string) => `# ${title}

Trong bài viết này, mình chia sẻ góc nhìn cá nhân về **${topic}** sau quá trình học và làm dự án thực tế.

## Những điều rút ra

- Luôn bắt đầu từ bài toán người dùng.
- Giữ cấu trúc code rõ ràng, dễ mở rộng.
- Đo lường bằng dữ liệu thay vì cảm giác.

## Cách áp dụng

1. Viết checklist ngắn trước khi code.
2. Chia task thành phần nhỏ để dễ review.
3. Tổng kết sau mỗi sprint để cải tiến.

> Kiên trì cải thiện 1% mỗi ngày sẽ tạo ra khác biệt lớn.

## Kết luận

Hy vọng bài viết giúp bạn có thêm ý tưởng để nâng cấp workflow của mình.
`;

const defaultPosts: Blog.PostItem[] = [
	{
		id: 'post-1',
		title: 'Bắt đầu Blog cá nhân với React',
		slug: 'bat-dau-blog-ca-nhan-voi-react',
		summary: 'Lộ trình ngắn để dựng blog cá nhân bằng React theo hướng dễ bảo trì.',
		content: markdownTemplate('Bắt đầu Blog cá nhân với React', 'React'),
		coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-react', 'tag-frontend'],
		status: 'published',
		views: 13,
		author: 'Nguyen Van A',
		createdAt: daysAgo(14),
		updatedAt: daysAgo(14),
	},
	{
		id: 'post-2',
		title: 'TypeScript giúp code an toàn hơn ra sao?',
		slug: 'typescript-giup-code-an-toan-hon-ra-sao',
		summary: 'Kinh nghiệm dùng TypeScript để giảm lỗi runtime trong dự án lớn.',
		content: markdownTemplate('TypeScript giúp code an toàn hơn ra sao?', 'TypeScript'),
		coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-typescript', 'tag-learning'],
		status: 'published',
		views: 27,
		author: 'Nguyen Van A',
		createdAt: daysAgo(13),
		updatedAt: daysAgo(12),
	},
	{
		id: 'post-3',
		title: 'Checklist trước khi release frontend',
		slug: 'checklist-truoc-khi-release-frontend',
		summary: 'Các bước kiểm tra nhanh giúp hạn chế lỗi khi đưa tính năng lên production.',
		content: markdownTemplate('Checklist trước khi release frontend', 'Frontend'),
		coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-frontend', 'tag-productivity'],
		status: 'published',
		views: 41,
		author: 'Nguyen Van A',
		createdAt: daysAgo(11),
		updatedAt: daysAgo(11),
	},
	{
		id: 'post-4',
		title: 'Tối ưu thói quen học lập trình mỗi ngày',
		slug: 'toi-uu-thoi-quen-hoc-lap-trinh-moi-ngay',
		summary: 'Một vài cách duy trì nhịp học đều đặn mà không bị quá tải.',
		content: markdownTemplate('Tối ưu thói quen học lập trình mỗi ngày', 'Learning'),
		coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-learning', 'tag-life'],
		status: 'published',
		views: 18,
		author: 'Nguyen Van A',
		createdAt: daysAgo(10),
		updatedAt: daysAgo(9),
	},
	{
		id: 'post-5',
		title: 'Quản lý thời gian cho dev bận rộn',
		slug: 'quan-ly-thoi-gian-cho-dev-ban-ron',
		summary: 'Khung làm việc đơn giản để xử lý cả deadline và việc học cá nhân.',
		content: markdownTemplate('Quản lý thời gian cho dev bận rộn', 'Productivity'),
		coverImage: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-productivity', 'tag-life'],
		status: 'published',
		views: 22,
		author: 'Nguyen Van A',
		createdAt: daysAgo(8),
		updatedAt: daysAgo(8),
	},
	{
		id: 'post-6',
		title: 'Nháp: Ý tưởng series về clean code',
		slug: 'nhap-y-tuong-series-ve-clean-code',
		summary: 'Tổng hợp dàn ý cho series viết về clean code trong dự án thực tế.',
		content: markdownTemplate('Nháp: Ý tưởng series về clean code', 'Learning'),
		coverImage: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-learning', 'tag-typescript'],
		status: 'draft',
		views: 3,
		author: 'Nguyen Van A',
		createdAt: daysAgo(7),
		updatedAt: daysAgo(5),
	},
	{
		id: 'post-7',
		title: 'Thiết kế card blog dễ đọc trên mobile',
		slug: 'thiet-ke-card-blog-de-doc-tren-mobile',
		summary: 'Gợi ý bố cục card blog gọn, rõ và tối ưu trải nghiệm đọc trên điện thoại.',
		content: markdownTemplate('Thiết kế card blog dễ đọc trên mobile', 'Frontend'),
		coverImage: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-frontend', 'tag-react'],
		status: 'published',
		views: 11,
		author: 'Nguyen Van A',
		createdAt: daysAgo(6),
		updatedAt: daysAgo(6),
	},
	{
		id: 'post-8',
		title: 'Từ ghi chú rời rạc đến bài viết hoàn chỉnh',
		slug: 'tu-ghi-chu-roi-rac-den-bai-viet-hoan-chinh',
		summary: 'Quy trình biến ghi chú hằng ngày thành bài blog có cấu trúc rõ ràng.',
		content: markdownTemplate('Từ ghi chú rời rạc đến bài viết hoàn chỉnh', 'Life'),
		coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-life', 'tag-productivity'],
		status: 'published',
		views: 16,
		author: 'Nguyen Van A',
		createdAt: daysAgo(5),
		updatedAt: daysAgo(4),
	},
	{
		id: 'post-9',
		title: 'Những lỗi state phổ biến trong React',
		slug: 'nhung-loi-state-pho-bien-trong-react',
		summary: 'Tổng hợp lỗi state thường gặp và cách xử lý để tránh bug khó truy vết.',
		content: markdownTemplate('Những lỗi state phổ biến trong React', 'React'),
		coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-react', 'tag-typescript'],
		status: 'published',
		views: 39,
		author: 'Nguyen Van A',
		createdAt: daysAgo(4),
		updatedAt: daysAgo(3),
	},
	{
		id: 'post-10',
		title: 'Nháp: Ghi nhanh retrospective tuần',
		slug: 'nhap-ghi-nhanh-retrospective-tuan',
		summary: 'Mẫu retrospective ngắn để theo dõi tiến độ và tâm trạng làm việc.',
		content: markdownTemplate('Nháp: Ghi nhanh retrospective tuần', 'Productivity'),
		coverImage: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-productivity'],
		status: 'draft',
		views: 1,
		author: 'Nguyen Van A',
		createdAt: daysAgo(3),
		updatedAt: daysAgo(2),
	},
	{
		id: 'post-11',
		title: 'Learning log: Mình học từ bug production như thế nào',
		slug: 'learning-log-minh-hoc-tu-bug-production-nhu-the-nao',
		summary: 'Một case study ngắn về việc xử lý bug production và cải thiện quy trình.',
		content: markdownTemplate('Learning log: Mình học từ bug production như thế nào', 'Learning'),
		coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-learning', 'tag-life'],
		status: 'published',
		views: 24,
		author: 'Nguyen Van A',
		createdAt: daysAgo(2),
		updatedAt: daysAgo(2),
	},
	{
		id: 'post-12',
		title: 'Xây dựng thói quen viết kỹ thuật đều đặn',
		slug: 'xay-dung-thoi-quen-viet-ky-thuat-deu-dan',
		summary: 'Cách duy trì lịch viết tuần để vừa học sâu vừa chia sẻ được nhiều hơn.',
		content: markdownTemplate('Xây dựng thói quen viết kỹ thuật đều đặn', 'Life'),
		coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-life', 'tag-learning'],
		status: 'published',
		views: 20,
		author: 'Nguyen Van A',
		createdAt: daysAgo(1),
		updatedAt: daysAgo(1),
	},
];

export const defaultBlogData: Blog.BlogStorageData = {
	posts: defaultPosts,
	tags: defaultTags,
};