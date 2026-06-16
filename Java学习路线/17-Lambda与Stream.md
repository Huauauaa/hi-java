# 第 17 章：Lambda 与 Stream

## 学习目标

- 熟练编写 Lambda 表达式与方法引用
- 使用 Stream API 进行集合处理

## 核心知识点

### Lambda 表达式

```java
// 函数式接口
@FunctionalInterface
interface Calculator {
    int calc(int a, int b);
}

Calculator add = (a, b) -> a + b;
Calculator mul = (a, b) -> { return a * b; };
```

- 语法：`(参数) -> 表达式` 或 `(参数) -> { 语句; }`
- 变量捕获：只能使用 effectively final 的局部变量

### 方法引用

| 形式     | 示例                  |
| -------- | --------------------- |
| 静态     | `Integer::parseInt`   |
| 实例     | `System.out::println` |
| 特定对象 | `str::length`         |
| 构造     | `ArrayList::new`      |

### 常用函数式接口

| 接口            | 方法        | 用途 |
| --------------- | ----------- | ---- |
| `Predicate<T>`  | `test(T)`   | 判断 |
| `Function<T,R>` | `apply(T)`  | 转换 |
| `Consumer<T>`   | `accept(T)` | 消费 |
| `Supplier<T>`   | `get()`     | 供给 |

### Stream API

```java
List<String> result = list.stream()
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .sorted()
    .distinct()
    .collect(Collectors.toList());
```

### Stream 操作分类

- **中间操作**（惰性）：`filter`、`map`、`flatMap`、`sorted`、`distinct`、`limit`
- **终端操作**：`collect`、`forEach`、`reduce`、`count`、`findFirst`、`anyMatch`

### 并行流

```java
list.parallelStream().filter(...).collect(...);
```

- 适合计算密集、无共享可变状态
- 注意线程安全与顺序问题

### Optional 配合 Stream

```java
Optional.ofNullable(user)
    .map(User::getName)
    .orElse("unknown");
```

## 实践建议

- 用 Stream 重写传统 for 循环的 filter/map/reduce
- 对比串行流与并行流性能（大数据集）
