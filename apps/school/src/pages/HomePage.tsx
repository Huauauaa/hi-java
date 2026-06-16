import {
  BookOutlined,
  CodeOutlined,
  PlayCircleOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import type { FC } from 'react';
import { SchoolLayout } from '../components/SchoolLayout';

const { Title, Paragraph, Text } = Typography;

type Props = { navigate: (path: string) => void };

const courses = [
  {
    title: 'Java 学习路线',
    desc: '20 章由易到难，MOBA 场景答题闯关，LeetCode 式练习界面。',
    tag: '闯关',
    color: 'gold',
    icon: <ThunderboltOutlined />,
    path: '/java-route',
    featured: true,
  },
  {
    title: 'Java 基础',
    desc: '面向对象、集合、IO、多线程等核心语法与思想。',
    tag: '基础',
    color: 'blue',
    icon: <BookOutlined />,
    path: '/java-route',
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

const docsUrl = import.meta.env.PROD
  ? 'https://huauauaa.github.io/hi-java/'
  : 'http://localhost:1313/';

export const HomePage: FC<Props> = ({ navigate }) => (
  <SchoolLayout>
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-12 text-white shadow-lg">
        <Tag color="gold" className="mb-4">
          React + Ant Design + Tailwind CSS
        </Tag>
        <Title level={1} className="!text-white">
          欢迎来到 School
        </Title>
        <Paragraph className="max-w-2xl text-base !text-blue-50">
          这是 hi-java 的 Web 学习入口，聚合课程导航与文档站点。从 Java 学习路线开始，
          在召唤师峡谷风格的题面中答题练手。
        </Paragraph>
        <Space wrap>
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={() => navigate('/java-route')}
          >
            开始 Java 学习路线
          </Button>
          <Button type="primary" size="large" ghost href={docsUrl} target="_blank" rel="noreferrer">
            进入 Java 文档
          </Button>
          <Button size="large" className="border-white text-white" href="#courses">
            浏览课程
          </Button>
        </Space>
      </section>

      <section id="courses">
        <div className="mb-6">
          <Title level={3} className="!mb-1">
            课程模块
          </Title>
          <Text type="secondary">持续更新中的学习路线</Text>
        </div>

        <Row gutter={[20, 20]}>
          {courses.map((course) => (
            <Col xs={24} md={12} lg={6} key={course.title}>
              <Card
                hoverable={!!course.path}
                className={`h-full border-slate-200 shadow-sm transition ${
                  course.path ? 'hover:-translate-y-1 hover:shadow-md' : ''
                } ${course.featured ? 'ring-2 ring-amber-400' : ''}`}
                onClick={course.path ? () => navigate(course.path!) : undefined}
                title={
                  <Space>
                    <span className="text-blue-600">{course.icon}</span>
                    {course.title}
                  </Space>
                }
                extra={<Tag color={course.color}>{course.tag}</Tag>}
              >
                <Paragraph className="!mb-0 text-slate-600">{course.desc}</Paragraph>
                {course.path && (
                  <Button type="link" className="mt-2 px-0" onClick={() => navigate(course.path!)}>
                    进入 →
                  </Button>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  </SchoolLayout>
);
