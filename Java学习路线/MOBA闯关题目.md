# MOBA 题目（整合 10 题 + 综合 5 题）

在 **20 章单题练习** 之外：

- **整合题**（21–30）：跨章节组合，通常 2～3 个知识点
- **综合题**（31–35）：大型场景，**每题 4 个以上知识点**

## 整合题一览（21–30）

整合规则：**不必按章节顺序，不必两两一组**。

| 题号 | 涉及章节 | 知识点数 | MOBA 场景 | 核心知识点 |
| --- | --- | --- | --- | --- |
| 21 | 02, 03, 04 | 3 | 逆风守家决策 | boolean、if-else 链、数组累加 |
| 22 | 09, 11, 17 | 3 | 五杀榜与 MVP | String.equals、List、Stream filter |
| 23 | 05, 08, 10 | 3 | 技能冷却链 | 静态方法、接口、异常 try-catch |
| 24 | 06, 07, 16 | 3 | 分身英雄实验室 | 类、继承重写、反射 getSimpleName |
| 25 | 01, 06, 19 | 3 | 排位队列网关 | main、Hero 类、单例模式 |
| 26 | 12, 15 | 2 | 装备箱读档 | try-with-resources、泛型 Chest&lt;T&gt; |
| 27 | 03, 13, 14 | 3 | 抢龙协同一触即发 | if 条件、Thread、 synchronized |
| 28 | 06, 08, 16 | 3 | 战术接口探测 | 类、接口实现、反射 Class |
| 29 | 04, 17, 18 | 3 | 野区战绩复盘 | 数组、Stream filter、JVM 堆 |
| 30 | 11, 19, 20 | 3 | 峡谷数据中心 | HashMap、单例、Spring 注解 |

---

## 题 21 · 逆风守家决策 {#关-01}

**涉及文档**：[02 基本类型](./02-基本语法与数据类型.md) · [03 流程控制](./03-运算符与流程控制.md) · [04 数组](./04-数组.md)

基地裁判系统：`nexusAlive = true`，`hp = 150`，塔赏金 `{100, 50}`。

1. `!nexusAlive` → 打印 `GG`
2. 否则 `hp < 200` → 打印 `Recall now!`
3. 否则增强 for 累加赏金，打印 `150`

---

## 题 22 · 五杀榜与 MVP {#关-02}

**涉及文档**：[09 常用 API](./09-常用API.md) · [11 集合框架](./11-集合框架.md) · [17 Lambda 与 Stream](./17-Lambda与Stream.md)

1. `kills = [2, 11, 15, 8]`，Stream 过滤 ≥ 10，collect 后 size 为 `2`
2. `mvp.equals("Faker")` 成立时打印 `MVP confirmed`

---

## 题 23 · 技能冷却链 {#关-03}

**涉及文档**：[05 方法与参数](./05-方法与参数.md) · [08 抽象类与接口](./08-抽象类与接口.md) · [10 异常处理](./10-异常处理.md)

1. 接口 `Skill`，`Flash` 实现 `cast()` 打印 `Blink!`
2. 静态 `fire(Skill, boolean onCooldown)` 冷却中抛 `IllegalStateException`
3. main 中 try-catch 打印 `Wait for CD`

---

## 题 24 · 分身英雄实验室 {#关-04}

**涉及文档**：[06 类与对象](./06-类与对象.md) · [07 封装继承多态](./07-封装继承与多态.md) · [16 反射与注解](./16-反射与注解.md)

1. `Hero` 基类；`Shaco extends Hero` 重写 `role()` 返回 `"Clone"`
2. 打印 `shaco.role()` 与 `Shaco.class.getSimpleName()`

---

## 题 25 · 排位队列网关 {#关-05}

**涉及文档**：[01 入门与环境](./01-Java入门与环境.md) · [06 类与对象](./06-类与对象.md) · [19 设计模式](./19-设计模式.md)

1. 静态内部类单例 `MatchQueue`，两次 `getInstance()` 用 `==` 比较为 `true`
2. `Hero` 类含 `name` 字段；创建 `new Hero("Ahri")` 后打印 `Queue ready`

---

## 题 26 · 装备箱读档 {#关-06}

**涉及文档**：[12 IO 与 NIO](./12-IO与NIO.md) · [15 泛型](./15-泛型.md)

1. 泛型 `Chest<T>` 含 `store(T item)`
2. `loadItem(Chest<String>, BufferedReader)` 用 try-with-resources 读一行存入并打印

---

## 题 27 · 抢龙协同一触即发 {#关-07}

**涉及文档**：[03 流程控制](./03-运算符与流程控制.md) · [13 多线程基础](./13-多线程基础.md) · [14 并发进阶](./14-并发进阶.md)

仅当 `dragonAlive = true` 时：启动 Thread 打印 `Push mid`，并在 `synchronized (pit)` 中打印 `Secured Dragon`。

---

## 题 28 · 战术接口探测 {#关-08}

**涉及文档**：[06 类与对象](./06-类与对象.md) · [08 抽象类与接口](./08-抽象类与接口.md) · [16 反射与注解](./16-反射与注解.md)

1. 接口 `Role` 含 `code()`；`Tank` 实现返回 `"TOP"`
2. 以 `Role` 引用调用 `code()`，并打印 `Tank.class.getSimpleName()`

---

## 题 29 · 野区战绩复盘 {#关-09}

**涉及文档**：[04 数组](./04-数组.md) · [17 Lambda 与 Stream](./17-Lambda与Stream.md) · [18 JVM 原理](./18-JVM原理.md)

1. `int[] camps = {4, 12, 7, 15}` → Stream 过滤 ≥ 10，size 为 `2`
2. 注释 `// ANSWER:` 写出 `new int[5]` 分配在 JVM **堆**

---

## 题 30 · 峡谷数据中心 {#关-10}

**涉及文档**：[11 集合框架](./11-集合框架.md) · [19 设计模式](./19-设计模式.md) · [20 框架与工程实践](./20-框架与工程实践.md)

1. `HashMap` 存 `"blue"→25`、`"red"→18`，打印 blue 方 `25` 分
2. 单例 `DataCenter`，两次 `getInstance()` 比较为 `true`
3. 注释写出 GET `/match/score` 的 `@RestController` 与 `@GetMapping`

---

## 综合题一览（31–35）

每题整合 **4 个以上**知识点，并含**业务逻辑判定**（阈值、比较、分支、清洗等）。

| 题号 | 涉及章节 | 知识点数 | MOBA 场景 | 核心知识点 |
| --- | --- | --- | --- | --- |
| 31 | 06, 07, 08, 11, 17 | 5 | 团战集结系统 | 抽象类、接口、ArrayList、Stream |
| 32 | 03, 05, 09, 10, 11 | 5 | 峡谷裁判计分板 | if、静态方法、equals、异常、HashMap |
| 33 | 12, 15, 16, 17, 19 | 5 | 战后档案流水线 | IO、泛型、反射、Stream、单例 |
| 34 | 04, 05, 13, 14, 18 | 5 | 三路分推调度中心 | 数组、方法、Thread、synchronized、JVM 栈 |
| 35 | 06, 10, 11, 19, 20 | 5 | 峡谷 API 网关 | 类、异常、HashMap、单例、Spring 注解 |

---

## 题 31 · 团战集结系统 {#关-11}

**涉及文档**：[06](./06-类与对象.md) · [07](./07-封装继承与多态.md) · [08](./08-抽象类与接口.md) · [11](./11-集合框架.md) · [17](./17-Lambda与Stream.md)

2 个 `Assassin`（ready=true）+ 1 个 `Tank`（ready=false）。Stream 统计就绪人数，**≥ 2** 输出 `Engage!`，否则 `Wait`（本例为 Engage!）。

---

## 题 32 · 峡谷裁判计分板 {#关-12}

**涉及文档**：[03](./03-运算符与流程控制.md) · [05](./05-方法与参数.md) · [09](./09-常用API.md) · [10](./10-异常处理.md) · [11](./11-集合框架.md)

blue=11、red=10 基础击杀；`bonus(k)=k*2` 加成后比较判胜（22>20 → Blue wins），`equals` 确认，再测 parseInt 异常。

---

## 题 33 · 战后档案流水线 {#关-13}

**涉及文档**：[12](./12-IO与NIO.md) · [15](./15-泛型.md) · [16](./16-反射与注解.md) · [17](./17-Lambda与Stream.md) · [19](./19-设计模式.md)

`"a,,b"` split 后 filter 空串，**size==2** 输出 `Archive OK`，否则 `Archive corrupt`；另含单例、泛型 Vault、IO 读档。

---

## 题 34 · 三路分推调度中心 {#关-14}

**涉及文档**：[04](./04-数组.md) · [05](./05-方法与参数.md) · [13](./13-多线程基础.md) · [14](./14-并发进阶.md) · [18](./18-JVM原理.md)

`maxLane` 遍历 `{3,9,5}` 找最大下标（1）；**≥1** 时 Thread 打印 `Push lane 1`，否则 `Hold`；最后 synchronized 控图 + JVM 栈问答。

---

## 题 35 · 峡谷 API 网关 {#关-15}

**涉及文档**：[06](./06-类与对象.md) · [10](./10-异常处理.md) · [11](./11-集合框架.md) · [19](./19-设计模式.md) · [20](./20-框架与工程实践.md)

`register(null)` → Rejected；注册 Ahri 后 **roster.size()==1** 才打印 `Registered: Ahri`；Gateway 单例 + Spring 注解注释。
