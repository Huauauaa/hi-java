import {
  BookOutlined,
  CodeOutlined,
  GithubOutlined,
  ReadOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Layout, Row, Space, Tag, Typography } from 'antd';
import type { FC } from 'react';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const courses = [
  {
    title: 'Java 基础',
    desc: '面向对象、集合、IO、多线程等核心语法与思想。',
    tag: '基础',
    color: 'blue',
    icon: <BookOutlined />,
  },
  {
    title: 'Spring 生态',
    desc: 'Spring Boot、Web、Data 与企业级开发实践。',
    tag: '框架',
    color: 'green',
    icon: <RocketOutlined />,
  },
  {
    title: '算法与数据结构',
    desc: '常见题型、复杂度分析与编码训练。',
    tag: '进阶',
    color: 'purple',
    icon: <CodeOutlined />,
  },
];

const App: FC = () => {
  const docsUrl = import.meta.env.PROD
    ? 'https://huauauaa.github.io/hi-java/'
    : 'http://localhost:1313/';

  return (
    <Layout className="min-h-screen bg-slate-50">
      <Header className="flex items-center justify-between border-b border-slate-200 bg-white px-6">
        <Space align="center" size="middle">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg text-white">
            <ReadOutlined />
          </div>
          <div>
            <Title level={4} className="!mb-0">
              School
            </Title>
            <Text type="secondary" className="text-xs">
              hi-java 学习门户
            </Text>
          </div>
        </Space>
        <Space>
          <Button type="link" href={docsUrl} target="_blank" rel="noreferrer">
            Java 文档
          </Button>
          <Button
            type="primary"
            icon={<GithubOutlined />}
            href="https://github.com/Huauauaa/hi-java"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Button>
        </Space>
      </Header>

      <Content className="mx-auto w-full max-w-6xl px-6 py-10">
        <section className="mb-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-12 text-white shadow-lg">
          <Tag color="gold" className="mb-4">
            React + Ant Design + Tailwind CSS
          </Tag>
          <Title level={1} className="!text-white">
            欢迎来到 School
          </Title>
          <Paragraph className="max-w-2xl text-base !text-blue-50">
            这是 hi-java 的 Web 学习入口，聚合课程导航与文档站点。本地开发使用 Vite，
            生产环境部署在 GitHub Pages 的 <Text code>/hi-java/school/</Text> 路径下。
          </Paragraph>
          <Space wrap>
            <Button type="primary" size="large" ghost href={docsUrl} target="_blank" rel="noreferrer">
              进入 Java 文档
            </Button>
            <Button size="large" className="border-white text-white" href="#courses">
              浏览课程
            </Button>
          </Space>
        </section>

        <section id="courses">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <Title level={3} className="!mb-1">
                课程模块
              </Title>
              <Text type="secondary">持续更新中的学习路线</Text>
            </div>
          </div>

          <Row gutter={[20, 20]}>
            {courses.map((course) => (
              <Col xs={24} md={8} key={course.title}>
                <Card
                  hoverable
                  className="h-full border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  title={
                    <Space>
                      <span className="text-blue-600">{course.icon}</span>
                      {course.title}
                    </Space>
                  }
                  extra={<Tag color={course.color}>{course.tag}</Tag>}
                >
                  <Paragraph className="!mb-0 text-slate-600">{course.desc}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Content>

      <Footer className="border-t border-slate-200 bg-white text-center text-slate-500">
        hi-java School · Built with React, Ant Design & Tailwind CSS
      </Footer>
    </Layout>
  );
};

export default App;
