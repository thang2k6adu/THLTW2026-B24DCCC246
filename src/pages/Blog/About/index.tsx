import { GithubOutlined, GlobalOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Avatar, Card, Tag, Typography } from 'antd';
import '../style.less';

const skills = ['React', 'TypeScript', 'Ant Design', 'Node.js', 'System Design'];

const BlogAboutPage = () => {
	return (
		<div className='blog-about'>
			<Card>
				<div className='blog-about-header'>
					<Avatar
						size={96}
						src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80'
					/>
					<div>
						<div className='blog-about-name'>Nguyen Van A</div>
						<Typography.Text type='secondary'>Frontend Developer · Technical Writer</Typography.Text>
					</div>
				</div>

				<div className='blog-about-bio'>
					Mình viết blog để chia sẻ quá trình học lập trình, kinh nghiệm xây dựng sản phẩm và các ghi chép thực chiến
					trong công việc hằng ngày.
				</div>

				<div style={{ marginBottom: 12 }}>
					{skills.map((skill) => (
						<Tag color='blue' key={skill}>
							{skill}
						</Tag>
					))}
				</div>

				<div className='blog-about-links'>
					<a href='https://github.com' target='_blank' rel='noreferrer'>
						<GithubOutlined /> Github
					</a>
					<a href='https://linkedin.com' target='_blank' rel='noreferrer'>
						<LinkedinOutlined /> LinkedIn
					</a>
					<a href='https://your-portfolio.example.com' target='_blank' rel='noreferrer'>
						<GlobalOutlined /> Portfolio
					</a>
				</div>
			</Card>
		</div>
	);
};

export default BlogAboutPage;