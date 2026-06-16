const chapterPaths: Record<string, string> = {
  '01': 'Java学习路线/01-Java入门与环境',
  '02': 'Java学习路线/02-基本语法与数据类型',
  '03': 'Java学习路线/03-运算符与流程控制',
  '04': 'Java学习路线/04-数组',
  '05': 'Java学习路线/05-方法与参数',
  '06': 'Java学习路线/06-类与对象',
  '07': 'Java学习路线/07-封装继承与多态',
  '08': 'Java学习路线/08-抽象类与接口',
  '09': 'Java学习路线/09-常用API',
  '10': 'Java学习路线/10-异常处理',
  '11': 'Java学习路线/11-集合框架',
  '12': 'Java学习路线/12-IO与NIO',
  '13': 'Java学习路线/13-多线程基础',
  '14': 'Java学习路线/14-并发进阶',
  '15': 'Java学习路线/15-泛型',
  '16': 'Java学习路线/16-反射与注解',
  '17': 'Java学习路线/17-Lambda与Stream',
  '18': 'Java学习路线/18-JVM原理',
  '19': 'Java学习路线/19-设计模式',
  '20': 'Java学习路线/20-框架与工程实践',
};

/** MOBA 题（21–35）→ 文档锚点 */
const mobaDocAnchors: Record<string, string> = {
  '21': '关-01',
  '22': '关-02',
  '23': '关-03',
  '24': '关-04',
  '25': '关-05',
  '26': '关-06',
  '27': '关-07',
  '28': '关-08',
  '29': '关-09',
  '30': '关-10',
  '31': '关-11',
  '32': '关-12',
  '33': '关-13',
  '34': '关-14',
  '35': '关-15',
};

/** Unambiguous tag → chapter; others fall back to current chapterId */
const tagChapter: Record<string, string> = {
  入门: '01',
  main: '01',
  输出: '01',
  基本类型: '02',
  变量: '02',
  'if-else': '03',
  流程控制: '03',
  数组: '04',
  遍历: '04',
  方法: '05',
  返回值: '05',
  类: '06',
  对象: '06',
  构造方法: '06',
  继承: '07',
  多态: '07',
  重写: '07',
  接口: '08',
  实现: '08',
  String: '09',
  equals: '09',
  异常: '10',
  'try-catch': '10',
  ArrayList: '11',
  HashMap: '11',
  集合: '11',
  IO: '12',
  'try-with-resources': '12',
  Thread: '13',
  Runnable: '13',
  synchronized: '14',
  并发: '14',
  泛型: '15',
  反射: '16',
  Class: '16',
  Stream: '17',
  filter: '17',
  JVM: '18',
  堆: '18',
  设计模式: '19',
  单例: '19',
  Spring: '20',
};

export const siteBase = import.meta.env.PROD ? 'https://huauauaa.github.io/hi-java' : 'http://localhost:1313/hi-java';

export function chapterSiteUrl(chapterId: string): string {
  const anchor = mobaDocAnchors[chapterId];
  if (anchor) return `${siteBase}/Java学习路线/MOBA闯关题目/#${anchor}`;
  const path = chapterPaths[chapterId];
  return path ? `${siteBase}/${path}/` : `${siteBase}/`;
}

export function tagSiteUrl(tag: string, chapterId: string): string {
  const id = tagChapter[tag] ?? chapterId;
  return chapterSiteUrl(id);
}
