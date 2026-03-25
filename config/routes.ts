export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// QUẢN LÝ VĂN BẰNG
	{
		name: 'Quản Lý Văn Bằng',
		path: '/quan-ly-van-bang',
		icon: 'SolutionOutlined',
		routes: [
			{
				name: 'Sổ Văn Bằng',
				path: 'so-van-bang',
				component: './QuanLyVanBang/SoVanBang',
			},
			{
				name: 'Quyết Định Tốt Nghiệp',
				path: 'quyet-dinh',
				component: './QuanLyVanBang/QuyetDinh',
			},
			{
				name: 'Cấu Hình Biểu Mẫu',
				path: 'bieu-mau',
				component: './QuanLyVanBang/BieuMau',
			},
			{
				name: 'Thông Tin Văn Bằng',
				path: 'thong-tin',
				component: './QuanLyVanBang/ThongTinVanBang',
			},
			{
				name: 'Tra Cứu',
				path: 'tra-cuu',
				component: './QuanLyVanBang/TraCuu',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
