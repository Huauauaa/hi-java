export type QuizExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type Quiz = {
  chapterId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  story: string;
  examples: QuizExample[];
  constraints: string[];
  starterCode: string;
  hint: string;
  validate: (code: string) => { pass: boolean; message: string };
};

function norm(code: string) {
  return code.replace(/\s+/g, ' ').trim();
}

function hasAll(code: string, parts: string[]) {
  const n = norm(code);
  return parts.every((p) => n.includes(p));
}

export const quizzes: Record<string, Quiz> = {
  '01': {
    chapterId: '01',
    title: '召唤师入职',
    difficulty: 'Easy',
    tags: ['入门', 'main', '输出'],
    story: `你刚被召入**峡谷学院**。教官要求用 Java 编写第一个**战报脚本**：在控制台打印欢迎语，证明你已接入战场终端。

敌方无关，本关只验你的「Hello World」级仪式。`,
    examples: [
      { input: '运行 main', output: 'Hello, Summoner!', explanation: '精确输出这一行' },
    ],
    constraints: ['类名必须为 Solution', '使用 System.out.println'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // TODO: 输出 Hello, Summoner!
        
    }
}`,
    hint: 'System.out.println("Hello, Summoner!");',
    validate: (code) =>
      hasAll(code, ['System.out.println', 'Hello, Summoner'])
        ? { pass: true, message: 'Accepted — 欢迎加入峡谷！' }
        : { pass: false, message: '需要 println 输出 Hello, Summoner!' },
  },
  '02': {
    chapterId: '02',
    title: '英雄面板初始化',
    difficulty: 'Easy',
    tags: ['基本类型', '变量'],
    story: `对线前，系统要加载你的**英雄面板**：当前金币 \`320\`，是否携带**闪现**（true），最大生命 \`620.0\`（双精度）。

请声明三个变量：\`gold\`（int）、\`hasFlash\`（boolean）、\`maxHp\`（double），并赋上述初值。`,
    examples: [
      { input: 'gold', output: '320' },
      { input: 'hasFlash', output: 'true' },
      { input: 'maxHp', output: '620.0' },
    ],
    constraints: ['使用 int、boolean、double', '变量名必须为 gold、hasFlash、maxHp'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // TODO: 声明并初始化 gold, hasFlash, maxHp
        
    }
}`,
    hint: 'int gold = 320; boolean hasFlash = true; double maxHp = 620.0;',
    validate: (code) =>
      hasAll(code, ['int gold = 320', 'boolean hasFlash = true', 'double maxHp = 620.0']) ||
      hasAll(code, ['int gold=320', 'boolean hasFlash=true', 'double maxHp=620.0'])
        ? { pass: true, message: 'Accepted — 面板加载完成' }
        : { pass: false, message: '检查三个变量的类型、名称与初值' },
  },
  '03': {
    chapterId: '03',
    title: '低血量回城判定',
    difficulty: 'Easy',
    tags: ['if-else', '流程控制'],
    story: `你的英雄当前血量 \`hp = 180\`，回城阈值 \`RECALL_THRESHOLD = 200\`。

若 \`hp < RECALL_THRESHOLD\`，打印 \`"Recall now!"\`；否则打印 \`"Keep farming"\`。`,
    examples: [
      { input: 'hp=180, threshold=200', output: 'Recall now!' },
      { input: 'hp=450, threshold=200', output: 'Keep farming' },
    ],
    constraints: ['使用 if-else', '阈值用 final int RECALL_THRESHOLD = 200'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        int hp = 180;
        final int RECALL_THRESHOLD = 200;
        // TODO: 根据 hp 打印 Recall now! 或 Keep farming
        
    }
}`,
    hint: 'if (hp < RECALL_THRESHOLD) { ... } else { ... }',
    validate: (code) =>
      hasAll(code, ['if', 'hp', 'RECALL_THRESHOLD', 'Recall now!', 'Keep farming'])
        ? { pass: true, message: 'Accepted — 回城逻辑正确' }
        : { pass: false, message: '需要 if-else 比较 hp 与阈值并打印两种文案' },
  },
  '04': {
    chapterId: '04',
    title: '补刀金币统计',
    difficulty: 'Easy',
    tags: ['数组', '遍历'],
    story: `一波小兵倒下，每只提供金币数记录在数组 \`{21, 21, 14, 21, 21}\`。

声明该 int 数组，并用**增强 for** 循环累加，打印总金币（应为 \`98\`）。`,
    examples: [
      { input: 'minionGold[]', output: '98' },
    ],
    constraints: ['数组字面量初始化', '使用 for (... : ...) 累加'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // TODO: int[] minionGold = {21, 21, 14, 21, 21}; 累加并打印
        
    }
}`,
    hint: 'int sum = 0; for (int g : minionGold) sum += g;',
    validate: (code) =>
      hasAll(code, ['int[]', '21', '14', 'for', ':']) && hasAll(code, ['sum', 'System.out.println'])
        ? { pass: true, message: 'Accepted — 98 金币入账' }
        : { pass: false, message: '需要数组、增强 for 与 println 输出总和' },
  },
  '05': {
    chapterId: '05',
    title: '物理伤害公式',
    difficulty: 'Medium',
    tags: ['方法', '返回值'],
    story: `编写静态方法 \`calcDamage(int ad, int armor)\`：实际伤害 = \`ad - armor / 2\`（整数除法），返回 int。

在 main 中调用 \`calcDamage(120, 40)\` 并打印结果（应为 \`100\`）。`,
    examples: [
      { input: 'calcDamage(120, 40)', output: '100' },
      { input: 'calcDamage(80, 30)', output: '65' },
    ],
    constraints: ['public static int calcDamage', 'armor 先整除 2'],
    starterCode: `public class Solution {
    // TODO: calcDamage 方法
    
    public static void main(String[] args) {
        System.out.println(calcDamage(120, 40));
    }
}`,
    hint: 'return ad - armor / 2;',
    validate: (code) =>
      hasAll(code, ['static int calcDamage', 'return', 'armor / 2']) ||
      hasAll(code, ['static int calcDamage', 'return', 'armor/2'])
        ? { pass: true, message: 'Accepted — 伤害计算正确' }
        : { pass: false, message: '实现 calcDamage：ad - armor/2' },
  },
  '06': {
    chapterId: '06',
    title: '英雄实体类',
    difficulty: 'Medium',
    tags: ['类', '对象', '构造方法'],
    story: `定义类 \`Hero\`：字段 \`String name\`、\`int level\`；构造方法传入二者；方法 \`void rankUp()\` 使 level + 1。

main 中 \`new Hero("Garen", 1)\`，调用 rankUp() 后打印 level（应为 \`2\`）。`,
    examples: [
      { input: 'Garen rankUp once', output: '2' },
    ],
    constraints: ['独立 class Hero', '构造方法赋值 name 与 level'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Hero garen = new Hero("Garen", 1);
        garen.rankUp();
        System.out.println(garen.level);
    }
}

// TODO: class Hero { ... }`,
    hint: 'this.name = name; this.level = level; level++;',
    validate: (code) =>
      hasAll(code, ['class Hero', 'String name', 'int level', 'rankUp', 'level']) &&
      (code.includes('level++') || code.includes('level += 1') || code.includes('level = level + 1'))
        ? { pass: true, message: 'Accepted — 英雄已升级' }
        : { pass: false, message: '定义 Hero 类、构造方法与 rankUp' },
  },
  '07': {
    chapterId: '07',
    title: '终极技能多态',
    difficulty: 'Medium',
    tags: ['继承', '多态', '重写'],
    story: `抽象父类 \`Champion\`，方法 \`String ultName()\`。子类 \`Yasuo\` 返回 \`"Last Breath"\`，\`Ahri\` 返回 \`"Spirit Rush"\`。

main 中：\`Champion c = new Yasuo();\` 打印 \`c.ultName()\`（应为 Last Breath）。`,
    examples: [
      { input: 'Champion c = new Yasuo()', output: 'Last Breath' },
    ],
    constraints: ['Yasuo extends Champion', '@Override ultName'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Champion c = new Yasuo();
        System.out.println(c.ultName());
    }
}

// TODO: Champion, Yasuo, Ahri`,
    hint: 'class Yasuo extends Champion { @Override String ultName() { return "Last Breath"; } }',
    validate: (code) =>
      hasAll(code, ['class Champion', 'class Yasuo', 'extends Champion', 'Last Breath', 'ultName'])
        ? { pass: true, message: 'Accepted — 多态施放成功' }
        : { pass: false, message: '需要继承 + 重写 ultName' },
  },
  '08': {
    chapterId: '08',
    title: '技能接口契约',
    difficulty: 'Medium',
    tags: ['接口', '实现'],
    story: `接口 \`Skill\` 含 \`void cast()\`。类 \`Flash\` 实现 Skill，cast 中打印 \`"Blink!"\`。

main 创建 Flash 实例，以 Skill 类型引用并调用 cast()。`,
    examples: [
      { input: 'flash.cast()', output: 'Blink!' },
    ],
    constraints: ['interface Skill', 'implements Skill'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Skill flash = new Flash();
        flash.cast();
    }
}

// TODO: interface Skill, class Flash`,
    hint: 'class Flash implements Skill { public void cast() { System.out.println("Blink!"); } }',
    validate: (code) =>
      hasAll(code, ['interface Skill', 'implements Skill', 'void cast', 'Blink!'])
        ? { pass: true, message: 'Accepted — 闪现到位' }
        : { pass: false, message: '定义 Skill 接口与 Flash 实现' },
  },
  '09': {
    chapterId: '09',
    title: '召唤师名称校验',
    difficulty: 'Medium',
    tags: ['String', 'equals'],
    story: `匹配确认：当前召唤师名 \`name = "Faker"\`。若与目标 \`"Faker"\` **内容相等**（忽略引用），打印 \`"Same summoner"\`。

禁止使用 \`==\` 比较字符串内容。`,
    examples: [
      { input: 'name equals "Faker"', output: 'Same summoner' },
    ],
    constraints: ['使用 equals', '禁止 name == "Faker" 作为唯一判断'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        String name = "Faker";
        String target = "Faker";
        // TODO: 内容相等则打印 Same summoner
        
    }
}`,
    hint: 'if (name.equals(target)) { ... }',
    validate: (code) =>
      hasAll(code, ['equals', 'Same summoner']) && !norm(code).includes('name == target')
        ? { pass: true, message: 'Accepted — 同名确认' }
        : { pass: false, message: '用 equals 比较字符串' },
  },
  '10': {
    chapterId: '10',
    title: '技能冷却异常',
    difficulty: 'Medium',
    tags: ['异常', 'try-catch'],
    story: `方法 \`void useSkill(boolean onCooldown)\`：若 onCooldown 为 true，抛出 \`IllegalStateException("Skill on cooldown")\`。

main 中 try 调用 \`useSkill(true)\`，catch 后打印 \`"Wait for CD"\`。`,
    examples: [
      { input: 'useSkill(true)', output: 'Wait for CD' },
    ],
    constraints: ['throw new IllegalStateException', 'try-catch'],
    starterCode: `public class Solution {
    static void useSkill(boolean onCooldown) {
        // TODO: 冷却中则抛异常
        
    }

    public static void main(String[] args) {
        // TODO: try-catch 打印 Wait for CD
        
    }
}`,
    hint: 'if (onCooldown) throw new IllegalStateException("Skill on cooldown");',
    validate: (code) =>
      hasAll(code, ['IllegalStateException', 'try', 'catch', 'Wait for CD'])
        ? { pass: true, message: 'Accepted — 异常处理正确' }
        : { pass: false, message: '抛出 IllegalStateException 并用 try-catch 处理' },
  },
  '11': {
    chapterId: '11',
    title: '六神装背包',
    difficulty: 'Medium',
    tags: ['ArrayList', '集合'],
    story: `用 \`ArrayList<String>\` 依次添加装备：\`"Boots"\`, \`"Infinity Edge"\`, \`"Lord Dominik\'s"\`。

打印 size()，应为 \`3\`。`,
    examples: [
      { input: '3 items', output: '3' },
    ],
    constraints: ['ArrayList<String>', 'add 三次', 'println(list.size())'],
    starterCode: `import java.util.ArrayList;

public class Solution {
    public static void main(String[] args) {
        // TODO: ArrayList 添加三件装备并打印 size
        
    }
}`,
    hint: 'ArrayList<String> items = new ArrayList<>(); items.add("Boots"); ...',
    validate: (code) =>
      hasAll(code, ['ArrayList', 'add', 'Boots', 'Infinity Edge', 'size()'])
        ? { pass: true, message: 'Accepted — 背包已满' }
        : { pass: false, message: '使用 ArrayList 添加三件装备并打印 size' },
  },
  '12': {
    chapterId: '12',
    title: '战报文件读取',
    difficulty: 'Medium',
    tags: ['IO', 'try-with-resources'],
    story: `使用 **try-with-resources** 打开 \`BufferedReader\`，读取一行战报（假设已绑定 \`reader\`），打印该行。

模板中已声明 \`BufferedReader reader\`，你只需写 try (...) { ... } 块。`,
    examples: [
      { input: 'reader.readLine()', output: '第一行战报内容' },
    ],
    constraints: ['try (BufferedReader', 'readLine()', 'try-with-resources'],
    starterCode: `import java.io.BufferedReader;

public class Solution {
    public static void report(BufferedReader reader) throws Exception {
        // TODO: try-with-resources 读取并打印一行
        
    }
}`,
    hint: 'try (BufferedReader br = reader) { System.out.println(br.readLine()); }',
    validate: (code) =>
      hasAll(code, ['try (', 'readLine', 'System.out.println'])
        ? { pass: true, message: 'Accepted — 战报已读' }
        : { pass: false, message: '使用 try-with-resources 与 readLine' },
  },
  '13': {
    chapterId: '13',
    title: '分带推进线程',
    difficulty: 'Hard',
    tags: ['Thread', 'Runnable'],
    story: `创建线程打印 \`"Push top lane"\`：使用 \`new Thread(() -> ...).start()\` 或 Runnable。

main 中启动线程并打印该消息（Lambda 体内需 println）。`,
    examples: [
      { input: 'thread start', output: 'Push top lane' },
    ],
    constraints: ['new Thread', 'start()', 'Push top lane'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        // TODO: 新线程打印 Push top lane
        
    }
}`,
    hint: 'new Thread(() -> System.out.println("Push top lane")).start();',
    validate: (code) =>
      hasAll(code, ['Thread', 'start', 'Push top lane'])
        ? { pass: true, message: 'Accepted — 分带上路' }
        : { pass: false, message: '创建 Thread 并 start，打印 Push top lane' },
  },
  '14': {
    chapterId: '14',
    title: '大龙坑互斥锁',
    difficulty: 'Hard',
    tags: ['synchronized', '并发'],
    story: `对象 \`dragonPit\` 作为锁，在 \`synchronized (dragonPit) { ... }\` 中打印 \`"Secured Baron"\`。

模拟仅一个队伍能拿下 Baron。`,
    examples: [
      { input: 'enter pit', output: 'Secured Baron' },
    ],
    constraints: ['synchronized (dragonPit)', '同一对象锁'],
    starterCode: `public class Solution {
    private static final Object dragonPit = new Object();

    public static void main(String[] args) {
        // TODO: synchronized 块内打印 Secured Baron
        
    }
}`,
    hint: 'synchronized (dragonPit) { System.out.println("Secured Baron"); }',
    validate: (code) =>
      hasAll(code, ['synchronized', 'dragonPit', 'Secured Baron'])
        ? { pass: true, message: 'Accepted — Baron 已拿下' }
        : { pass: false, message: 'synchronized (dragonPit) { println ... }' },
  },
  '15': {
    chapterId: '15',
    title: '通用装备箱',
    difficulty: 'Hard',
    tags: ['泛型', '类'],
    story: `泛型类 \`Chest<T>\` 有字段 \`T item\` 与 \`void store(T item)\`。

main：\`Chest<String> c = new Chest<>();\` 存入 \`"Control Ward"\` 并打印 item。`,
    examples: [
      { input: 'store Control Ward', output: 'Control Ward' },
    ],
    constraints: ['class Chest<T>', 'store 方法'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Chest<String> c = new Chest<>();
        c.store("Control Ward");
        System.out.println(c.item);
    }
}

// TODO: class Chest<T>`,
    hint: 'class Chest<T> { T item; void store(T item) { this.item = item; } }',
    validate: (code) =>
      hasAll(code, ['class Chest<T>', 'store', 'T item'])
        ? { pass: true, message: 'Accepted — 物品已存放' }
        : { pass: false, message: '定义泛型类 Chest<T> 与 store' },
  },
  '16': {
    chapterId: '16',
    title: '技能反射探测',
    difficulty: 'Hard',
    tags: ['反射', 'Class'],
    story: `在 main 中获取 \`Hero.class\`，调用 \`getSimpleName()\` 打印类名 \`"Hero"\`。

禁止使用字符串字面量直接 println("Hero") 作为唯一方案——须通过 Class 获取。`,
    examples: [
      { input: 'Hero.class', output: 'Hero' },
    ],
    constraints: ['Hero.class', 'getSimpleName()'],
    starterCode: `class Hero {}

public class Solution {
    public static void main(String[] args) {
        // TODO: 反射获取类名并打印 Hero
        
    }
}`,
    hint: 'System.out.println(Hero.class.getSimpleName());',
    validate: (code) =>
      hasAll(code, ['Hero.class', 'getSimpleName'])
        ? { pass: true, message: 'Accepted — 反射成功' }
        : { pass: false, message: '使用 Hero.class.getSimpleName()' },
  },
  '17': {
    chapterId: '17',
    title: '击杀流过滤',
    difficulty: 'Hard',
    tags: ['Stream', 'filter'],
    story: `列表 \`kills = Arrays.asList(2, 5, 8, 11, 15)\`。用 Stream 过滤 **≥ 10** 的元素，collect 到 List 并打印 size（应为 \`2\`）。`,
    examples: [
      { input: 'kills >= 10', output: '2' },
    ],
    constraints: ['stream()', 'filter', 'collect'],
    starterCode: `import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Solution {
    public static void main(String[] args) {
        List<Integer> kills = Arrays.asList(2, 5, 8, 11, 15);
        // TODO: filter >= 10, collect, print size
        
    }
}`,
    hint: 'kills.stream().filter(k -> k >= 10).collect(Collectors.toList())',
    validate: (code) =>
      hasAll(code, ['stream', 'filter', 'collect', '10'])
        ? { pass: true, message: 'Accepted — 高光时刻已筛选' }
        : { pass: false, message: 'stream + filter(>=10) + collect' },
  },
  '18': {
    chapterId: '18',
    title: '野区内存分配',
    difficulty: 'Hard',
    tags: ['JVM', '堆'],
    story: `在新手教程注释中回答（代码内用注释写出答案即可）：

**问题**：\`new Hero()\` 创建的对象实例主要分配在 JVM 哪一块内存区域？

答案关键词：\`堆\` 或 \`Heap\`（写在注释 \`// ANSWER: ...\` 中）。`,
    examples: [
      { input: 'new Hero()', output: '堆 / Heap' },
    ],
    constraints: ['注释 // ANSWER:', '包含 堆 或 Heap'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Object hero = new Hero();
        // ANSWER: 
        
    }
}

class Hero {}`,
    hint: '// ANSWER: 堆（Heap）',
    validate: (code) => {
      const m = code.match(/\/\/\s*ANSWER:\s*(.+)/i);
      if (!m) return { pass: false, message: '在 // ANSWER: 后写出答案' };
      const a = m[1];
      if (a.includes('堆') || /heap/i.test(a))
        return { pass: true, message: 'Accepted — 对象在堆上' };
      return { pass: false, message: '对象实例在堆（Heap）' };
    },
  },
  '19': {
    chapterId: '19',
    title: '单例基地核心',
    difficulty: 'Hard',
    tags: ['设计模式', '单例'],
    story: `实现**静态内部类**单例 \`Nexus\`，私有构造，\`getInstance()\` 返回同一实例。

main 中连续两次 getInstance()，用 \`==\` 比较并打印 \`true\`。`,
    examples: [
      { input: 'getInstance() twice', output: 'true' },
    ],
    constraints: ['static class Holder', 'getInstance', '私有构造'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Nexus a = Nexus.getInstance();
        Nexus b = Nexus.getInstance();
        System.out.println(a == b);
    }
}

// TODO: class Nexus 单例`,
    hint: 'private static class Holder { static final Nexus INSTANCE = new Nexus(); }',
    validate: (code) =>
      hasAll(code, ['class Nexus', 'getInstance', 'Holder']) &&
      (code.includes('INSTANCE') || code.includes('Instance'))
        ? { pass: true, message: 'Accepted — 基地唯一' }
        : { pass: false, message: '静态内部类单例 + getInstance' },
  },
  '20': {
    chapterId: '20',
    title: 'REST 战报接口',
    difficulty: 'Hard',
    tags: ['Spring', '注解'],
    story: `在注释中写出：Spring Boot 里声明 REST 控制器、映射 GET \`/match/score\` 需要哪两个注解？

格式：\`// ANSWER: @XXX 与 @YYY\`（含 RestController 与 GetMapping）。`,
    examples: [
      { input: 'GET /match/score', output: '@RestController + @GetMapping' },
    ],
    constraints: ['// ANSWER:', 'RestController', 'GetMapping'],
    starterCode: `// 战报 API 草稿
public class MatchScoreApi {
    // ANSWER: 
    
    // public Score getScore() { ... }
}`,
    hint: '// ANSWER: @RestController 与 @GetMapping("/match/score")',
    validate: (code) => {
      const n = norm(code);
      if (!n.includes('ANSWER'))
        return { pass: false, message: '在 // ANSWER: 行填写注解' };
      if (n.includes('RestController') && n.includes('GetMapping'))
        return { pass: true, message: 'Accepted — 接口定义正确' };
      return { pass: false, message: '需要 @RestController 与 @GetMapping' };
    },
  },
};

export function getQuiz(chapterId: string) {
  return quizzes[chapterId];
}

export function getAdjacentChapter(id: string): { prev?: string; next?: string } {
  const ids = Object.keys(quizzes).sort();
  const i = ids.indexOf(id);
  return { prev: i > 0 ? ids[i - 1] : undefined, next: i < ids.length - 1 ? ids[i + 1] : undefined };
}
