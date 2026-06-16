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
  { id: '21', num: 21, title: '逆风守家决策', difficulty: 1, stage: 'MOBA 整合' },
  { id: '22', num: 22, title: '五杀榜与 MVP', difficulty: 2, stage: 'MOBA 整合' },
  { id: '23', num: 23, title: '技能冷却链', difficulty: 2, stage: 'MOBA 整合' },
  { id: '24', num: 24, title: '分身英雄实验室', difficulty: 3, stage: 'MOBA 整合' },
  { id: '25', num: 25, title: '排位队列网关', difficulty: 3, stage: 'MOBA 整合' },
  { id: '26', num: 26, title: '装备箱读档', difficulty: 3, stage: 'MOBA 整合' },
  { id: '27', num: 27, title: '抢龙协同一触即发', difficulty: 4, stage: 'MOBA 整合' },
  { id: '28', num: 28, title: '战术接口探测', difficulty: 4, stage: 'MOBA 整合' },
  { id: '29', num: 29, title: '野区战绩复盘', difficulty: 4, stage: 'MOBA 整合' },
  { id: '30', num: 30, title: '峡谷数据中心', difficulty: 5, stage: 'MOBA 整合' },
  { id: '31', num: 31, title: '团战集结系统', difficulty: 4, stage: 'MOBA 综合' },
  { id: '32', num: 32, title: '峡谷裁判计分板', difficulty: 4, stage: 'MOBA 综合' },
  { id: '33', num: 33, title: '战后档案流水线', difficulty: 5, stage: 'MOBA 综合' },
  { id: '34', num: 34, title: '三路分推调度中心', difficulty: 5, stage: 'MOBA 综合' },
  { id: '35', num: 35, title: '峡谷 API 网关', difficulty: 5, stage: 'MOBA 综合' },
];

export function getChapter(id: string) {
  return chapters.find((c) => c.id === id);
}

export const coreChapters = chapters.filter((c) => c.num <= 20);
export const mobaChapters = chapters.filter((c) => c.stage === 'MOBA 整合');
export const comprehensiveChapters = chapters.filter((c) => c.stage === 'MOBA 综合');
