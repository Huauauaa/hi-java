import {
  BookOutlined,
  CodeOutlined,
  LockOutlined,
  PlayCircleOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { SchoolLayout } from '../components/SchoolLayout';
import { prefersReducedMotion } from '../lib/motion';

type Props = { navigate: (path: string) => void };

type Course = {
  title: string;
  desc: string;
  tag: string;
  tagClass: string;
  icon: ReactNode;
  path?: string;
  featured?: boolean;
  soon?: boolean;
};

const courses: Course[] = [
  {
    title: 'Java 学习路线',
    desc: '20 章由易到难，MOBA 场景答题闯关，LeetCode 式练习界面。',
    tag: '闯关',
    tagClass: 'bg-[rgba(255,161,22,0.14)] text-[var(--amber)]',
    icon: <ThunderboltOutlined />,
    path: '/java-route',
    featured: true,
  },
  {
    title: 'Java 基础',
    desc: '面向对象、集合、IO、多线程等核心语法与思想。',
    tag: '基础',
    tagClass: 'bg-[var(--teal-soft)] text-[var(--teal)]',
    icon: <BookOutlined />,
    path: '/java-route',
  },
  {
    title: 'Spring 生态',
    desc: 'Spring Boot、Web、Data 与企业级开发实践。',
    tag: '框架',
    tagClass: 'bg-[#edf3ff] text-[#3559a8]',
    icon: <RocketOutlined />,
    soon: true,
  },
  {
    title: '算法与数据结构',
    desc: '常见题型、复杂度分析与编码训练。',
    tag: '进阶',
    tagClass: 'bg-[#f3ebff] text-[#6b4bb3]',
    icon: <CodeOutlined />,
    soon: true,
  },
];

const docsUrl = import.meta.env.PROD ? 'https://huauauaa.github.io/hi-java/' : 'http://localhost:1313/hi-java/';

export const HomePage: FC<Props> = ({ navigate }) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.45 })
        .from('.hero-title', { y: 28, opacity: 0, duration: 0.6 }, '-=0.25')
        .from('.hero-lead', { y: 20, opacity: 0, duration: 0.5 }, '-=0.35')
        .from('.hero-actions > *', { y: 16, opacity: 0, stagger: 0.08, duration: 0.42 }, '-=0.2')
        .from('.section-heading, .section-sub', { y: 16, opacity: 0, stagger: 0.08, duration: 0.45 }, '-=0.05')
        .from('.course-card', { y: 34, opacity: 0, stagger: 0.07, duration: 0.5 }, '-=0.15');
    },
    { scope: pageRef },
  );

  return (
    <SchoolLayout>
      <div ref={pageRef} className="school-page mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <section className="hero-codex mb-12">
          <div className="hero-codex__orb" aria-hidden />
          <p className="hero-eyebrow">Summoner Codex · hi-java</p>
          <h1 className="hero-title">在峡谷里学会 Java</h1>
          <p className="hero-lead">
            School 把文档、闯关与代码练习串成一条路线。从环境搭建到框架实践，用 MOBA 场景把语法练到手上。
          </p>
          <div className="hero-actions">
            <Button type="primary" size="large" icon={<PlayCircleOutlined />} onClick={() => navigate('/java-route')}>
              开始 Java 学习路线
            </Button>
            <Button size="large" href={docsUrl} target="_blank" rel="noreferrer">
              进入 Java 文档
            </Button>
            <Button size="large" type="text" href="#courses">
              浏览课程
            </Button>
          </div>
        </section>

        <section id="courses">
          <h2 className="section-heading">课程模块</h2>
          <p className="section-sub mb-6">持续更新中的学习路线与练习入口</p>

          <div className="course-grid">
            {courses.map((course) => {
              const interactive = !!course.path && !course.soon;
              return (
                <article
                  key={course.title}
                  className={`course-card ${interactive ? 'course-card--interactive' : ''} ${
                    course.featured ? 'course-card--featured' : ''
                  }`}
                  onClick={interactive ? () => navigate(course.path!) : undefined}
                  onKeyDown={
                    interactive
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(course.path!);
                          }
                        }
                      : undefined
                  }
                  role={interactive ? 'button' : undefined}
                  tabIndex={interactive ? 0 : undefined}
                >
                  <span className={`course-card__tag ${course.tagClass}`}>{course.tag}</span>
                  <div className="course-card__icon">{course.icon}</div>
                  <h3 className="course-card__title">{course.title}</h3>
                  <p className="course-card__desc">{course.desc}</p>
                  {interactive ? (
                    <span className="course-card__cta">进入路线 →</span>
                  ) : (
                    <span className="course-card__cta inline-flex items-center gap-1 !text-[var(--ink-muted)]">
                      <LockOutlined /> 即将开放
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </SchoolLayout>
  );
};
