export type Chapter = {
  id: string;
  num: number;
  title: string;
  difficulty: number;
  stage: string;
};

export const chapters: Chapter[] = [
  { id: '01', num: 1, title: 'Java 入门与环境', difficulty: 1, stage: '入门' },
  { id: '02', num: 2, title: '基本语法与数据类型', difficulty: 1, stage: '入门' },
  { id: '03', num: 3, title: '运算符与流程控制', difficulty: 1, stage: '入门' },
  { id: '04', num: 4, title: '数组', difficulty: 2, stage: '入门' },
  { id: '05', num: 5, title: '方法与参数', difficulty: 2, stage: '入门' },
  { id: '06', num: 6, title: '类与对象', difficulty: 2, stage: '面向对象' },
  { id: '07', num: 7, title: '封装、继承与多态', difficulty: 2, stage: '面向对象' },
  { id: '08', num: 8, title: '抽象类与接口', difficulty: 3, stage: '面向对象' },
  { id: '09', num: 9, title: '常用 API', difficulty: 3, stage: '核心 API' },
  { id: '10', num: 10, title: '异常处理', difficulty: 3, stage: '核心 API' },
  { id: '11', num: 11, title: '集合框架', difficulty: 3, stage: '核心 API' },
  { id: '12', num: 12, title: 'IO 与 NIO', difficulty: 3, stage: '核心 API' },
  { id: '13', num: 13, title: '多线程基础', difficulty: 4, stage: '并发与高级' },
  { id: '14', num: 14, title: '并发进阶', difficulty: 4, stage: '并发与高级' },
  { id: '15', num: 15, title: '泛型', difficulty: 4, stage: '并发与高级' },
  { id: '16', num: 16, title: '反射与注解', difficulty: 4, stage: '并发与高级' },
  { id: '17', num: 17, title: 'Lambda 与 Stream', difficulty: 4, stage: '并发与高级' },
  { id: '18', num: 18, title: 'JVM 原理', difficulty: 5, stage: '底层与架构' },
  { id: '19', num: 19, title: '设计模式', difficulty: 5, stage: '底层与架构' },
  { id: '20', num: 20, title: '框架与工程实践', difficulty: 5, stage: '底层与架构' },
];

export function getChapter(id: string) {
  return chapters.find((c) => c.id === id);
}
