# 第 09 章：常用 API

## 学习目标

- 熟练使用 String、包装类、日期时间等核心 API
- 了解 `Objects`、`Optional` 等工具类

## 核心知识点

### String

- **不可变**：每次修改产生新对象
- 常用：`length()`、`charAt()`、`substring()`、`indexOf()`、`split()`、`trim()`、`equals()`、`equalsIgnoreCase()`
- `==` vs `equals()`：前者比地址，后者比内容
- `StringBuilder` / `StringBuffer`：可变字符串，频繁拼接用 Builder（非线程安全更快）

```java
String s = "hello";
String t = new String("hello");
s.equals(t);           // true
s == t;                // false（不同对象）

StringBuilder sb = new StringBuilder();
sb.append("a").append("b");
```

### 包装类

| 基本类型  | 包装类    |
| --------- | --------- |
| `int`     | `Integer` |
| `double`  | `Double`  |
| `boolean` | `Boolean` |
| …         | …         |

- 自动装箱 / 拆箱：`Integer i = 10; int n = i;`
- 缓存：`Integer.valueOf(-128~127)` 复用实例
- `parseInt()`、`valueOf()` 字符串转换

### Object 类

- `equals()`、`hashCode()`、`toString()`、`getClass()`
- 重写 `equals` 须同时重写 `hashCode`

### 日期时间（Java 8+）

- 旧 API：`Date`、`Calendar`（了解即可）
- 新 API：`LocalDate`、`LocalTime`、`LocalDateTime`、`ZonedDateTime`
- `DateTimeFormatter` 格式化

### Math 与 Random

- `Math.abs()`、`max()`、`min()`、`round()`、`sqrt()`、`pow()`
- `Random` / `ThreadLocalRandom`

### Optional（Java 8+）

```java
Optional<String> opt = Optional.ofNullable(getName());
opt.orElse("default");
opt.ifPresent(System.out::println);
```

## 重点难点

- String 常量池与 `intern()`
- 包装类 `null` 拆箱会 `NullPointerException`
