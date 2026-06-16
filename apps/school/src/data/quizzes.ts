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

function fnBody(code: string, name: string) {
  const m = code.match(new RegExp(`(?:static\\s+\\w+\\s+)?${name}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\s*\\}`, 'm'));
  return m?.[1] ?? '';
}

/** ponytail: static keyword scan, not a Java parser — catches missing *2 / loop / null-guard */
function hasBonusDouble(code: string) {
  const body = fnBody(code, 'bonus');
  return /\*\s*2|\*\s*2\b|<<\s*1/.test(body);
}

function hasMaxIndexScan(code: string) {
  const body = fnBody(code, 'maxLane');
  return (body.includes('for') || body.includes('while')) && />|<|Math\.max/.test(body);
}

function hasReadyFilter(code: string) {
  const n = norm(code);
  return n.includes('filter') && /\.ready\s*\(\)|ready\s*\(\)/.test(n);
}

function hasEngageThreshold(code: string) {
  const n = norm(code);
  return />=\s*2|>\s*1|count\s*\(\)\s*>=\s*2/.test(n) && n.includes('Engage');
}

function hasScoreCompare(code: string) {
  const n = norm(code);
  return /bonus\s*\(/.test(n) && />/.test(n) && n.includes('Blue wins');
}

function hasNonEmptySplitFilter(code: string) {
  const n = norm(code);
  return n.includes('split') && n.includes('filter') && /!.*isEmpty|length\s*\(\s*\)\s*>\s*0|!=\s*""/.test(n);
}

function hasNullGuardThrow(code: string) {
  return /null/.test(code) && /throw\s+new\s+IllegalArgumentException/.test(code);
}

function usesMaxLaneResult(code: string) {
  return /maxLane\s*\(/.test(code) && /Push lane/.test(code);
}

export const quizzes: Record<string, Quiz> = {
  '01': {
    chapterId: '01',
    title: '召唤师入职',
    difficulty: 'Easy',
    tags: ['入门', 'main', '输出'],
    story: `你刚被召入**峡谷学院**。教官要求用 Java 编写第一个**战报脚本**：在控制台打印欢迎语，证明你已接入战场终端。

敌方无关，本关只验你的「Hello World」级仪式。`,
    examples: [{ input: '运行 main', output: 'Hello, Summoner!', explanation: '精确输出这一行' }],
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
    examples: [{ input: 'minionGold[]', output: '98' }],
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
    examples: [{ input: 'Garen rankUp once', output: '2' }],
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
    examples: [{ input: 'Champion c = new Yasuo()', output: 'Last Breath' }],
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
    examples: [{ input: 'flash.cast()', output: 'Blink!' }],
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
    examples: [{ input: 'name equals "Faker"', output: 'Same summoner' }],
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
    examples: [{ input: 'useSkill(true)', output: 'Wait for CD' }],
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
    examples: [{ input: '3 items', output: '3' }],
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
    examples: [{ input: 'reader.readLine()', output: '第一行战报内容' }],
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
    examples: [{ input: 'thread start', output: 'Push top lane' }],
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
    examples: [{ input: 'enter pit', output: 'Secured Baron' }],
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
    examples: [{ input: 'store Control Ward', output: 'Control Ward' }],
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
    examples: [{ input: 'Hero.class', output: 'Hero' }],
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
    examples: [{ input: 'kills >= 10', output: '2' }],
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
    examples: [{ input: 'new Hero()', output: '堆 / Heap' }],
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
      if (a.includes('堆') || /heap/i.test(a)) return { pass: true, message: 'Accepted — 对象在堆上' };
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
    examples: [{ input: 'getInstance() twice', output: 'true' }],
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
      hasAll(code, ['class Nexus', 'getInstance', 'Holder']) && (code.includes('INSTANCE') || code.includes('Instance'))
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
    examples: [{ input: 'GET /match/score', output: '@RestController + @GetMapping' }],
    constraints: ['// ANSWER:', 'RestController', 'GetMapping'],
    starterCode: `// 战报 API 草稿
public class MatchScoreApi {
    // ANSWER: 
    
    // public Score getScore() { ... }
}`,
    hint: '// ANSWER: @RestController 与 @GetMapping("/match/score")',
    validate: (code) => {
      const n = norm(code);
      if (!n.includes('ANSWER')) return { pass: false, message: '在 // ANSWER: 行填写注解' };
      if (n.includes('RestController') && n.includes('GetMapping'))
        return { pass: true, message: 'Accepted — 接口定义正确' };
      return { pass: false, message: '需要 @RestController 与 @GetMapping' };
    },
  },
  '21': {
    chapterId: '21',
    title: '逆风守家决策',
    difficulty: 'Easy',
    tags: ['基本类型', 'if-else', '数组'],
    story: `**整合题**（第 02 + 03 + 04 章，非相邻组合）：基地告急，裁判系统要一次性判完。

已知 \`nexusAlive = true\`、\`hp = 150\`、防御塔赏金数组 \`{100, 50}\`：

1. 若 \`!nexusAlive\`，打印 \`"GG"\`
2. 否则若 \`hp < 200\`，打印 \`"Recall now!"\`
3. 否则用**增强 for** 累加赏金数组，打印总和 \`150\``,
    examples: [
      { input: 'nexusAlive=false', output: 'GG' },
      { input: 'hp=150, towers={100,50}', output: 'Recall now! 或累加 150' },
    ],
    constraints: ['boolean nexusAlive', 'if-else 链', 'int[] 增强 for 累加'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        boolean nexusAlive = true;
        int hp = 150;
        int[] towerBounty = {100, 50};
        // TODO: 按优先级判定 GG / Recall / 累加赏金
        
    }
}`,
    hint: 'else if (hp < 200) ... ; else { for (int g : towerBounty) sum += g; }',
    validate: (code) =>
      hasAll(code, ['boolean nexusAlive', 'if', 'nexusAlive', 'GG', 'hp', '200', 'Recall', 'int[]', 'for', ':'])
        ? { pass: true, message: 'Accepted — 守家决策正确' }
        : { pass: false, message: '需要 boolean 判定 + if-else + 数组累加' },
  },
  '22': {
    chapterId: '22',
    title: '五杀榜与 MVP',
    difficulty: 'Medium',
    tags: ['String', 'equals', 'ArrayList', 'Stream'],
    story: `**整合题**（第 09 + 11 + 17 章）：赛后统计击杀高光，并确认 MVP。

1. \`kills = [2, 11, 15, 8]\`，Stream 过滤 **≥ 10**，collect 后 \`size\` 为 \`2\` 并打印
2. \`mvp.equals("Faker")\` 成立时打印 \`"MVP confirmed"\`（禁止 \`==\` 比较字符串）`,
    examples: [
      { input: 'kills >= 10', output: '2' },
      { input: 'mvp equals Faker', output: 'MVP confirmed' },
    ],
    constraints: ['stream().filter', 'collect', 'equals', '禁止 mvp =='],
    starterCode: `import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Solution {
    public static void main(String[] args) {
        List<Integer> kills = Arrays.asList(2, 11, 15, 8);
        // TODO A: filter >= 10, print size
        
        String mvp = "Faker";
        // TODO B: equals 确认 MVP
        
    }
}`,
    hint: 'kills.stream().filter(k -> k >= 10).collect(...); if (mvp.equals("Faker")) ...',
    validate: (code) =>
      hasAll(code, ['stream', 'filter', 'collect', '10', 'equals', 'MVP confirmed']) &&
      !norm(code).includes('mvp ==')
        ? { pass: true, message: 'Accepted — 高光已筛，MVP 确认' }
        : { pass: false, message: 'Stream filter(>=10) + equals 确认 MVP' },
  },
  '23': {
    chapterId: '23',
    title: '技能冷却链',
    difficulty: 'Medium',
    tags: ['方法', '接口', '异常', 'try-catch'],
    story: `**整合题**（第 05 + 08 + 10 章）：接口定义技能，静态方法校验冷却，异常兜底。

1. 接口 \`Skill\`，\`Flash\` 实现 \`cast()\` 打印 \`"Blink!"\`
2. 静态方法 \`fire(Skill s, boolean onCooldown)\`：冷却中抛 \`IllegalStateException\`
3. main 中 \`try\` 调用 \`fire(new Flash(), true)\`，\`catch\` 后打印 \`"Wait for CD"\``,
    examples: [
      { input: 'flash.cast()', output: 'Blink!' },
      { input: 'fire(..., true)', output: 'Wait for CD' },
    ],
    constraints: ['interface Skill', 'static void fire', 'IllegalStateException', 'try-catch'],
    starterCode: `public class Solution {
    // TODO: interface Skill, class Flash, static fire(...)
    
    public static void main(String[] args) {
        // TODO: try-catch 打印 Wait for CD
        
    }
}`,
    hint: 'if (onCooldown) throw new IllegalStateException(...);',
    validate: (code) =>
      hasAll(code, ['interface Skill', 'implements Skill', 'Blink!', 'static', 'fire', 'IllegalStateException', 'try', 'catch', 'Wait for CD'])
        ? { pass: true, message: 'Accepted — 闪现接口 + 冷却异常处理' }
        : { pass: false, message: 'Skill 接口 + static fire 抛异常 + try-catch' },
  },
  '24': {
    chapterId: '24',
    title: '分身英雄实验室',
    difficulty: 'Medium',
    tags: ['类', '继承', '重写', '反射'],
    story: `**整合题**（第 06 + 07 + 16 章）：英雄基类、分身子类、反射验明正身。

1. 类 \`Hero\`，字段 \`String name\`；子类 \`Shaco\` 继承并重写 \`String role()\` 返回 \`"Clone"\`
2. main 中 \`Shaco s = new Shaco("Shaco");\` 打印 \`s.role()\` 与 \`Shaco.class.getSimpleName()\``,
    examples: [
      { input: 'shaco.role()', output: 'Clone' },
      { input: 'Shaco.class', output: 'Shaco' },
    ],
    constraints: ['class Hero', 'extends Hero', 'role()', 'getSimpleName()'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Shaco shaco = new Shaco("Shaco");
        System.out.println(shaco.role());
        System.out.println(Shaco.class.getSimpleName());
    }
}

// TODO: Hero, Shaco`,
    hint: 'class Shaco extends Hero { @Override String role() { return "Clone"; } }',
    validate: (code) =>
      hasAll(code, ['class Hero', 'class Shaco', 'extends Hero', 'role', 'Clone', 'Shaco.class', 'getSimpleName'])
        ? { pass: true, message: 'Accepted — 分身继承 + 反射验身' }
        : { pass: false, message: 'Hero/Shaco 继承重写 + Shaco.class.getSimpleName()' },
  },
  '25': {
    chapterId: '25',
    title: '排位队列网关',
    difficulty: 'Medium',
    tags: ['main', '类', '单例'],
    story: `**整合题**（第 01 + 06 + 19 章）：队列网关单例就绪，首位英雄入队。

1. **静态内部类单例** \`MatchQueue\`，\`getInstance()\` 两次引用 \`==\` 为 \`true\`
2. 类 \`Hero\` 含 \`String name\` 构造方法；main 创建 \`new Hero("Ahri")\` 后打印 \`"Queue ready"\``,
    examples: [
      { input: 'getInstance() twice', output: 'true' },
      { input: 'hero queued', output: 'Queue ready' },
    ],
    constraints: ['class MatchQueue 单例', 'class Hero', 'Queue ready'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        MatchQueue a = MatchQueue.getInstance();
        MatchQueue b = MatchQueue.getInstance();
        System.out.println(a == b);
        Hero ahri = new Hero("Ahri");
        System.out.println("Queue ready");
    }
}

// TODO: MatchQueue, Hero`,
    hint: 'private static class Holder { static final MatchQueue INSTANCE = new MatchQueue(); }',
    validate: (code) =>
      hasAll(code, ['class MatchQueue', 'getInstance', 'Holder', 'class Hero', 'Queue ready']) &&
      (code.includes('INSTANCE') || code.includes('Instance'))
        ? { pass: true, message: 'Accepted — 单例队列就绪' }
        : { pass: false, message: 'MatchQueue 单例 + Hero 类 + Queue ready' },
  },
  '26': {
    chapterId: '26',
    title: '装备箱读档',
    difficulty: 'Medium',
    tags: ['泛型', 'IO', 'try-with-resources'],
    story: `**整合题**（第 12 + 15 章，跨阶段）：泛型装备箱 + 战报读档。

1. 泛型 \`Chest<T>\` 有 \`T item\` 与 \`void store(T item)\`
2. 方法 \`loadItem(Chest<String> chest, BufferedReader reader)\` 用 **try-with-resources** 读一行存入 chest 并打印`,
    examples: [
      { input: 'Chest<String>', output: '存读一行装备名' },
      { input: 'try-with-resources', output: 'readLine 内容' },
    ],
    constraints: ['class Chest<T>', 'try (BufferedReader', 'readLine()', 'store'],
    starterCode: `import java.io.BufferedReader;

public class Solution {
    public static void loadItem(Chest<String> chest, BufferedReader reader) throws Exception {
        // TODO: try-with-resources 读一行 → chest.store → println
        
    }
}

// TODO: class Chest<T>`,
    hint: 'try (BufferedReader br = reader) { chest.store(br.readLine()); }',
    validate: (code) =>
      hasAll(code, ['class Chest<T>', 'store', 'T item', 'try (', 'readLine', 'System.out.println'])
        ? { pass: true, message: 'Accepted — 泛型箱 + 读档完成' }
        : { pass: false, message: 'Chest<T> + try-with-resources readLine + store' },
  },
  '27': {
    chapterId: '27',
    title: '抢龙协同一触即发',
    difficulty: 'Hard',
    tags: ['if-else', 'Thread', 'synchronized'],
    story: `**整合题**（第 03 + 13 + 14 章）：龙还活着才开团——分带线程 + 龙坑互斥锁。

1. \`boolean dragonAlive = true\`；仅当为 true 时：
2. 启动 \`Thread\` 打印 \`"Push mid"\`
3. 在 \`synchronized (pit)\` 中打印 \`"Secured Dragon"\``,
    examples: [
      { input: 'dragonAlive=true', output: 'Push mid + Secured Dragon' },
      { input: 'dragonAlive=false', output: '不执行' },
    ],
    constraints: ['if (dragonAlive)', 'new Thread', 'start()', 'synchronized (pit)'],
    starterCode: `public class Solution {
    private static final Object pit = new Object();

    public static void main(String[] args) {
        boolean dragonAlive = true;
        // TODO: dragonAlive 时才 Thread + synchronized
        
    }
}`,
    hint: 'if (dragonAlive) { new Thread(() -> println("Push mid")).start(); synchronized (pit) { ... } }',
    validate: (code) =>
      hasAll(code, ['dragonAlive', 'if', 'Thread', 'start', 'Push mid', 'synchronized', 'pit', 'Secured Dragon'])
        ? { pass: true, message: 'Accepted — 条件开团，龙已 secured' }
        : { pass: false, message: 'if(dragonAlive) + Thread + synchronized(pit)' },
  },
  '28': {
    chapterId: '28',
    title: '战术接口探测',
    difficulty: 'Hard',
    tags: ['类', '接口', '反射', 'Class'],
    story: `**整合题**（第 06 + 08 + 16 章）：战术角色接口 + 坦克实现 + 反射识别。

1. 接口 \`Role\` 含 \`String code()\`；类 \`Tank\` 实现并返回 \`"TOP"\`
2. main 中以 \`Role\` 引用调用 \`code()\`，并打印 \`Tank.class.getSimpleName()\``,
    examples: [
      { input: 'tank.code()', output: 'TOP' },
      { input: 'Tank.class', output: 'Tank' },
    ],
    constraints: ['interface Role', 'implements Role', 'Tank.class.getSimpleName()'],
    starterCode: `public class Solution {
    public static void main(String[] args) {
        Role tank = new Tank();
        System.out.println(tank.code());
        System.out.println(Tank.class.getSimpleName());
    }
}

// TODO: interface Role, class Tank`,
    hint: 'class Tank implements Role { public String code() { return "TOP"; } }',
    validate: (code) =>
      hasAll(code, ['interface Role', 'class Tank', 'implements Role', 'TOP', 'Tank.class', 'getSimpleName'])
        ? { pass: true, message: 'Accepted — 战术接口 + 反射识别' }
        : { pass: false, message: 'Role 接口 + Tank 实现 + getSimpleName' },
  },
  '29': {
    chapterId: '29',
    title: '野区战绩复盘',
    difficulty: 'Hard',
    tags: ['数组', 'Stream', 'filter', 'JVM'],
    story: `**整合题**（第 04 + 17 + 18 章）：野区刷怪记录 + Stream 筛高光 + JVM 内存问答。

1. \`int[] camps = {4, 12, 7, 15}\` 转为 List，Stream 过滤 **≥ 10**，collect 后 size 为 \`2\` 并打印
2. 注释 \`// ANSWER:\` 写出 \`new int[5]\` 数组对象分配在 JVM **堆**（含「堆」或 Heap）`,
    examples: [
      { input: 'camps >= 10', output: '2' },
      { input: 'new int[5]', output: '堆 / Heap' },
    ],
    constraints: ['int[]', 'stream().filter', 'collect', '// ANSWER: 含 堆 或 Heap'],
    starterCode: `import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Solution {
    public static void main(String[] args) {
        int[] camps = {4, 12, 7, 15};
        // TODO A: 转 List → stream filter >= 10 → print size
        
        int[] buff = new int[5];
        // ANSWER: 
        
    }
}`,
    hint: 'Arrays.stream(camps).filter(c -> c >= 10)... ; // ANSWER: 堆',
    validate: (code) => {
      const streamOk = hasAll(code, ['stream', 'filter', 'collect', '10']);
      const m = code.match(/\/\/\s*ANSWER:\s*(.+)/i);
      const heapOk = m && (m[1].includes('堆') || /heap/i.test(m[1]));
      if (streamOk && heapOk) return { pass: true, message: 'Accepted — 野区高光已筛，数组在堆上' };
      if (!streamOk) return { pass: false, message: '数组 → Stream filter(>=10) + collect' };
      return { pass: false, message: '// ANSWER: 数组对象在堆（Heap）' };
    },
  },
  '30': {
    chapterId: '30',
    title: '峡谷数据中心',
    difficulty: 'Hard',
    tags: ['HashMap', '单例', 'Spring'],
    story: `**整合题**（第 11 + 19 + 20 章）：战绩字典 + 全局数据中心单例 + REST 注解。

1. \`HashMap<String, Integer>\` 存入 \`"blue", 25\` 与 \`"red", 18\`，打印 \`blue\` 方分数 \`25\`
2. 静态内部类单例 \`DataCenter\`，两次 \`getInstance()\` 用 \`==\` 比较打印 \`true\`
3. 注释 \`// ANSWER:\` 写出 GET \`/match/score\` 需要的 \`@RestController\` 与 \`@GetMapping\``,
    examples: [
      { input: 'scores.get("blue")', output: '25' },
      { input: 'GET /match/score', output: '@RestController + @GetMapping' },
    ],
    constraints: ['HashMap', 'put', 'getInstance', 'Holder', '// ANSWER: RestController 与 GetMapping'],
    starterCode: `import java.util.HashMap;

public class Solution {
    public static void main(String[] args) {
        // TODO A: HashMap 存 blue/red 分数，println blue 分数
        
        DataCenter a = DataCenter.getInstance();
        DataCenter b = DataCenter.getInstance();
        System.out.println(a == b);
    }
}

// TODO: class DataCenter 单例

// 战报 API — 注释写出注解：
// ANSWER: `,
    hint: 'scores.put("blue", 25); Holder 单例; // ANSWER: @RestController 与 @GetMapping',
    validate: (code) => {
      const n = norm(code);
      const mapOk = hasAll(code, ['HashMap', 'put', 'blue', '25', 'get']);
      const singletonOk =
        hasAll(code, ['class DataCenter', 'getInstance', 'Holder']) && (code.includes('INSTANCE') || code.includes('Instance'));
      const springOk = n.includes('ANSWER') && n.includes('RestController') && n.includes('GetMapping');
      if (mapOk && singletonOk && springOk) return { pass: true, message: 'Accepted — 数据中心就绪' };
      if (!mapOk) return { pass: false, message: 'HashMap 存 blue/red 分数并 get 打印' };
      if (!singletonOk) return { pass: false, message: 'DataCenter 静态内部类单例' };
      return { pass: false, message: '// ANSWER: @RestController 与 @GetMapping' };
    },
  },
  '31': {
    chapterId: '31',
    title: '团战集结系统',
    difficulty: 'Hard',
    tags: ['类', '继承', '接口', 'ArrayList', 'Stream'],
    story: `**综合题**（5 知识点 + 逻辑判定）

抽象类 \`Champion\`；\`Assassin\` 实现 \`Ready\`（\`ready()\` 恒 true），\`Tank\` 实现 \`Ready\`（\`ready()\` 恒 false）。

\`ArrayList<Champion>\` 加入 **2 个 Assassin + 1 个 Tank**。用 Stream \`filter\` 统计 \`ready()\` 为 true 的人数：

- **≥ 2** 打印 \`"Engage!"\`
- 否则打印 \`"Wait"\`

本例应输出 \`Engage!\`（只有 2 人就绪，但阈值是 ≥2）。`,
    examples: [
      { input: '2 Assassin + 1 Tank', output: 'Engage!' },
      { input: 'filter ready()', output: 'count = 2' },
    ],
    constraints: ['Assassin 与 Tank 两类', 'filter 必须判断 ready()', 'if 阈值 ≥ 2 输出 Engage!'],
    starterCode: `import java.util.ArrayList;
import java.util.List;

public class Solution {
    public static void main(String[] args) {
        List<Champion> team = new ArrayList<>();
        team.add(new Assassin());
        team.add(new Assassin());
        team.add(new Tank());
        // TODO: stream filter ready()==true，>=2 打印 Engage! 否则 Wait
        
    }
}

// TODO: Champion, Ready, Assassin, Tank`,
    hint: 'long n = team.stream().filter(c -> ((Ready)c).ready()).count(); if (n >= 2) ...',
    validate: (code) => {
      if (!hasAll(code, ['abstract class Champion', 'class Assassin', 'class Tank', 'interface Ready', 'implements Ready', 'ArrayList', 'stream', 'filter']))
        return { pass: false, message: '需要 Champion/Assassin/Tank + Ready 接口 + ArrayList + Stream' };
      if (!hasReadyFilter(code)) return { pass: false, message: 'filter 中须调用 ready() 判断，不能写死人数' };
      if (!hasEngageThreshold(code)) return { pass: false, message: '须用 count>=2 决定 Engage! 或 Wait' };
      if (!hasAll(code, ['Assassin', 'Tank', 'Engage!', 'Wait'])) return { pass: false, message: '缺少 Assassin/Tank 或 Engage!/Wait 输出' };
      return { pass: true, message: 'Accepted — 集结逻辑正确' };
    },
  },
  '32': {
    chapterId: '32',
    title: '峡谷裁判计分板',
    difficulty: 'Hard',
    tags: ['if-else', '方法', 'String', '异常', 'HashMap'],
    story: `**综合题**（5 知识点 + 计分逻辑）

\`HashMap\` 存基础击杀：\`"blue"→11\`、\`"red"→10\`。

1. 静态 \`bonus(int k)\` 返回 \`k * 2\`（加成后 blue=22, red=20）
2. 比较 \`bonus(blue)\` 与 \`bonus(red)\`，更高者胜：打印 \`"Blue wins"\`，并设 \`winner = "Blue"\`
3. \`"Blue".equals(winner)\` 时打印 \`"Winner confirmed"\`
4. \`try { Integer.parseInt("oops"); }\` 捕获后打印 \`"Invalid stat"\`

**禁止**不调用 \`bonus\` 就直接 println Blue wins。`,
    examples: [
      { input: 'bonus(11) vs bonus(10)', output: 'Blue wins' },
      { input: 'parseInt("oops")', output: 'Invalid stat' },
    ],
    constraints: ['bonus 必须 k*2', '判胜须调用 bonus 比较', 'equals 确认胜者'],
    starterCode: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    // TODO: static int bonus(int k) 返回 k * 2
    
    public static void main(String[] args) {
        Map<String, Integer> scores = new HashMap<>();
        scores.put("blue", 11);
        scores.put("red", 10);
        // TODO: 用 bonus 比较判胜 → Blue wins → Winner confirmed
        // TODO: try-catch parseInt("oops") → Invalid stat
        
    }
}`,
    hint: 'if (bonus(scores.get("blue")) > bonus(scores.get("red"))) { ... winner = "Blue"; }',
    validate: (code) => {
      if (!hasAll(code, ['HashMap', 'put', 'blue', '11', 'red', '10', 'static', 'bonus']))
        return { pass: false, message: '需要 HashMap 存 blue=11/red=10 与 static bonus' };
      if (!hasBonusDouble(code)) return { pass: false, message: 'bonus 方法体内须实现 k * 2' };
      if (!hasScoreCompare(code)) return { pass: false, message: '判胜须调用 bonus(...) 再比较大小' };
      if (!hasAll(code, ['equals', 'Winner confirmed', 'try', 'catch', 'NumberFormatException', 'Invalid stat']))
        return { pass: false, message: '缺少 equals 确认或 parseInt 异常处理' };
      return { pass: true, message: 'Accepted — 计分逻辑正确' };
    },
  },
  '33': {
    chapterId: '33',
    title: '战后档案流水线',
    difficulty: 'Hard',
    tags: ['IO', '泛型', '反射', 'Stream', '单例'],
    story: `**综合题**（5 知识点 + 清洗逻辑）

1. 单例 \`ArchiveHub\`，两次 \`getInstance()\` 打印 \`true\`
2. 泛型 \`Vault<T>\` + \`load\` 用 try-with-resources 读一行 \`store\` 并打印
3. \`"a,,b".split(",")\` → Stream **filter 去掉空串** → 若 \`size == 2\` 打印 \`"Archive OK"\`，否则 \`"Archive corrupt"\`
4. 打印 \`Vault.class.getSimpleName()\`

本例 split 后应输出 \`Archive OK\`。`,
    examples: [
      { input: '"a,,b" split filter', output: 'Archive OK' },
      { input: 'empty token filtered', output: 'size = 2' },
    ],
    constraints: ['filter 须排除空串', 'if size==2 分支', '单例 + 泛型 + IO'],
    starterCode: `import java.io.BufferedReader;
import java.util.Arrays;
import java.util.stream.Collectors;

public class Solution {
    public static void load(Vault<String> vault, BufferedReader reader) throws Exception {
        // TODO: try-with-resources 读一行 → store → println
        
    }

    public static void main(String[] args) {
        System.out.println(ArchiveHub.getInstance() == ArchiveHub.getInstance());
        System.out.println(Vault.class.getSimpleName());
        // TODO: split "a,,b" → filter 非空 → size==2 则 Archive OK 否则 Archive corrupt
    }
}

// TODO: ArchiveHub, Vault<T>`,
    hint: '.filter(s -> !s.isEmpty()) ... if (size == 2)',
    validate: (code) => {
      const singletonOk =
        hasAll(code, ['class ArchiveHub', 'getInstance', 'Holder']) && (code.includes('INSTANCE') || code.includes('Instance'));
      if (!singletonOk) return { pass: false, message: 'ArchiveHub 静态内部类单例' };
      if (!hasAll(code, ['class Vault<T>', 'store', 'try (', 'readLine', 'Vault.class', 'getSimpleName']))
        return { pass: false, message: 'Vault<T> + try-with-resources + 反射类名' };
      if (!hasNonEmptySplitFilter(code)) return { pass: false, message: 'split 后 filter 须排除空串（isEmpty/length）' };
      if (!hasAll(code, ['Archive OK', 'Archive corrupt']) || !norm(code).includes('if'))
        return { pass: false, message: '须 if 判断 size==2 输出 Archive OK / Archive corrupt' };
      return { pass: true, message: 'Accepted — 档案清洗逻辑正确' };
    },
  },
  '34': {
    chapterId: '34',
    title: '三路分推调度中心',
    difficulty: 'Hard',
    tags: ['数组', '方法', 'Thread', 'synchronized', 'JVM'],
    story: `**综合题**（5 知识点 + 调度逻辑）

\`int[] pressure = {3, 9, 5}\`。

1. 静态 \`maxLane(int[] lanes)\` **遍历**找最大压力的下标（应返回 \`1\`）
2. 仅当 \`maxLane(pressure) >= 1\` 时：启动 Thread 打印 \`"Push lane " + maxLane(pressure)\`（即 \`Push lane 1\`）
3. 否则打印 \`"Hold"\`
4. 无论哪种情况，都在 \`synchronized (mapLock)\` 中打印 \`"Map control"\`
5. 注释 \`// ANSWER:\` 写出线程局部变量在 JVM **虚拟机栈**（含「栈」或 Stack）`,
    examples: [
      { input: 'pressure {3,9,5}', output: 'Push lane 1' },
      { input: 'maxLane returns 1', output: 'Hold skipped' },
    ],
    constraints: ['maxLane 须循环比较', 'Push lane 须拼接 maxLane 结果', 'if maxLane>=1 分支'],
    starterCode: `public class Solution {
    private static final Object mapLock = new Object();

    // TODO: static int maxLane(int[] lanes) 遍历找最大下标

    public static void main(String[] args) {
        int[] pressure = {3, 9, 5};
        // TODO: if maxLane(pressure) >= 1 → Thread Push lane N，否则 Hold
        // TODO: synchronized 打印 Map control
        // ANSWER: 
    }
}`,
    hint: 'for (int i=1; i<lanes.length; i++) if (lanes[i] > lanes[max]) max=i;',
    validate: (code) => {
      if (!hasMaxIndexScan(code)) return { pass: false, message: 'maxLane 须用循环/比较找最大下标，不能 return 常数' };
      if (!usesMaxLaneResult(code)) return { pass: false, message: 'Push lane 须拼接 maxLane(pressure) 的结果' };
      if (!hasAll(code, ['if', 'maxLane', 'Hold', 'Thread', 'start', 'synchronized', 'mapLock', 'Map control']))
        return { pass: false, message: '缺少 if>=1 分支、Hold、Thread 或 synchronized' };
      const m = code.match(/\/\/\s*ANSWER:\s*(.+)/i);
      if (!m || (!m[1].includes('栈') && !/stack/i.test(m[1])))
        return { pass: false, message: '// ANSWER: 局部变量在线程栈（Stack）' };
      return { pass: true, message: 'Accepted — 分推调度逻辑正确' };
    },
  },
  '35': {
    chapterId: '35',
    title: '峡谷 API 网关',
    difficulty: 'Hard',
    tags: ['类', '异常', 'HashMap', '单例', 'Spring'],
    story: `**综合题**（5 知识点 + 注册逻辑）

1. \`Player(String name)\`；\`register(Player p)\` 在 \`p == null\` 或 \`p.name == null\` 时抛 \`IllegalArgumentException\`
2. main：先 \`try { register(null); }\` → catch 打印 \`"Rejected"\`
3. 再 \`register(new Player("Ahri"))\`，若 \`roster.size() == 1\` 打印 \`"Registered: Ahri"\`（用 \`get("Ahri").name\`）
4. \`Gateway.getInstance()\` 两次 \`==\` 打印 \`true\`
5. 注释 \`// ANSWER:\` 写出 GET \`/api/player\` 的 \`@RestController\` 与 \`@GetMapping\``,
    examples: [
      { input: 'register(null)', output: 'Rejected' },
      { input: 'register Ahri, size=1', output: 'Registered: Ahri' },
    ],
    constraints: ['register 须校验 null', 'size==1 才打印 Registered', 'Gateway 单例'],
    starterCode: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    static Map<String, Player> roster = new HashMap<>();

    static void register(Player p) {
        // TODO: p 或 p.name 为 null 抛 IllegalArgumentException，否则 put
        
    }

    public static void main(String[] args) {
        // TODO: try register(null) → Rejected
        // TODO: register Ahri → if size==1 打印 Registered: Ahri
        System.out.println(Gateway.getInstance() == Gateway.getInstance());
    }
}

// TODO: Player, Gateway
// ANSWER: `,
    hint: 'if (p == null || p.name == null) throw ...; if (roster.size() == 1) ...',
    validate: (code) => {
      const n = norm(code);
      if (!hasNullGuardThrow(code)) return { pass: false, message: 'register 须判断 null 并 throw IllegalArgumentException' };
      if (!hasAll(code, ['class Player', 'HashMap', 'put', 'try', 'catch', 'Rejected', 'Ahri']))
        return { pass: false, message: 'Player + Map + try-catch Rejected + 注册 Ahri' };
      if (!hasAll(code, ['size()', 'Registered: Ahri']) || !n.includes('if'))
        return { pass: false, message: '注册成功后须 if (roster.size()==1) 打印 Registered: Ahri' };
      if (!hasAll(code, ['class Gateway', 'getInstance', 'Holder']) || !(code.includes('INSTANCE') || code.includes('Instance')))
        return { pass: false, message: 'Gateway 静态内部类单例' };
      if (!n.includes('ANSWER') || !n.includes('RestController') || !n.includes('GetMapping'))
        return { pass: false, message: '// ANSWER: @RestController 与 @GetMapping' };
      return { pass: true, message: 'Accepted — 网关注册逻辑正确' };
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
