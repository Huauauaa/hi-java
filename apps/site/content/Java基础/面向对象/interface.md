# interface

> 一种引用数据类型，是方法的集合；用于定义类的行为规范（能做什么），而非具体实现。

## 语法

```java
[权限修饰符] interface 接口名 {
    // 常量、抽象方法、默认方法、静态方法、私有方法
}
```

接口中的成员有固定修饰符（可省略，编译器会自动补全）：

| 成员 | 默认修饰符 |
|------|-----------|
| 常量 | `public static final` |
| 抽象方法 | `public abstract` |
| 默认方法 | `public` |
| 静态方法 | `public` |

## 实现与继承

- 类通过 `implements` 实现接口，必须实现接口中**所有抽象方法**（除非该类是抽象类）
- 一个类可以实现**多个**接口
- 接口通过 `extends` 继承其他接口，可以多继承

```java
interface A { void a(); }
interface B { void b(); }
interface C extends A, B { void c(); }

class Demo implements C {
    @Override
    public void a() {}
    @Override
    public void b() {}
    @Override
    public void c() {}
}
```

## JDK 8+ 新特性

### 默认方法（default）

接口中提供默认实现，实现类可以不重写；若重写，遵循普通方法重写规则。

```java
interface Flyable {
    default void fly() {
        System.out.println("flying");
    }
}
```

### 静态方法（static）

通过 `接口名.方法名()` 调用，不能通过实现类实例调用。

```java
interface Utils {
    static void log(String msg) {
        System.out.println(msg);
    }
}
// Utils.log("hello");
```

### JDK 9+ 私有方法（private）

供接口内部的 default / static 方法复用，外部不可访问。

## JDK 17+ 密封接口（sealed interface）

> 显式声明哪些类/接口可以 `implements` 或 `extends` 它，在编译期限制类型扩展范围。

### 语法

```java
public sealed interface Shape permits Circle, Rectangle {
    double area();
}
```

- **`sealed`**：声明该接口为密封接口
- **`permits`**：列出允许实现/继承的子类型（子类型类名）
- 若所有子类型与密封接口在**同一源文件**中，可省略 `permits`

### 子类型要求

`permits` 中的类/接口必须是以下之一：

| 修饰 | 含义 |
|------|------|
| `final` | 不可再被继承或实现 |
| `sealed` | 继续作为密封类型，需指定自己的 `permits` |
| `non-sealed` | 解除密封限制，允许任意类再继承/实现 |

```java
public sealed interface Expr permits Constant, Add, Neg { }

public final record Constant(int value) implements Expr { }

public final class Add implements Expr {
    private final Expr left;
    private final Expr right;
    // ...
}

public non-sealed interface Neg extends Expr { } // 允许后续再扩展
```

### 与 sealed class 的配合

密封接口可以 `extends` 另一个密封接口，形成受控的类型层次：

```java
public sealed interface Animal permits Dog, Cat { }

public sealed interface Pet extends Animal permits Dog, Cat { }

public final class Dog implements Pet { }
public final class Cat implements Pet { }
```

### 使用场景

- **穷举类型**：表达式的种类、几何图形的类型等有限集合
- **模式匹配**：配合 `switch` 模式匹配（JDK 21 起为标准特性），编译器可检查分支是否覆盖所有子类型

```java
static double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.width() * r.height();
        // 密封接口 + record，编译器可验证分支完整性
    };
}
```

## 函数式接口

只包含**一个抽象方法**的接口（`Object` 中的方法不算，如 `equals`）。

可用 `@FunctionalInterface` 标注，编译期校验；常用于 Lambda 表达式与方法引用。

```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}

// Lambda
Calculator add = (a, b) -> a + b;
```

## 接口 vs 抽象类

| | 接口 | 抽象类 |
|---|------|--------|
| 继承 | 多实现 | 单继承 |
| 构造器 | 无 | 有 |
| 成员变量 | 只能是常量 | 任意 |
| 设计目的 | 规范行为（has-a / can-do） | 复用代码（is-a） |

## 常见用法

- **回调**：定义行为，由调用方传入实现（如 `Comparable`、`Comparator`）
- **解耦**：面向接口编程，降低模块依赖
- **标记接口**：不含方法，仅作类型标记（如 `Serializable`、`Cloneable`）

## Demo

Flyable.java

```java
package com.hua.demo;

public interface Flyable {

    int MAX_SPEED = 900; // public static final

    void fly();

    default void land() {
        System.out.println("landing...");
    }

    static void showMaxSpeed() {
        System.out.println("max speed: " + MAX_SPEED);
    }
}
```

Bird.java

```java
package com.hua.demo;

public class Bird implements Flyable {

    @Override
    public void fly() {
        System.out.println("bird is flying");
    }
}
```

InterfaceTest.java

```java
package com.hua.demo;

import org.junit.Test;

public class InterfaceTest {

    @Test
    public void test() {
        Flyable bird = new Bird();
        bird.fly();
        bird.land();
        Flyable.showMaxSpeed();

        Calculator add = (a, b) -> a + b;
        System.out.println(add.calculate(1, 2));
    }
}

@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
}
```

### 密封接口 Demo

Shape.java

```java
package com.hua.demo;

public sealed interface Shape permits Circle, Rectangle {

    double area();
}
```

Circle.java

```java
package com.hua.demo;

public final class Circle implements Shape {

    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    public double radius() {
        return radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}
```

Rectangle.java

```java
package com.hua.demo;

public final class Rectangle implements Shape {

    private final double width;
    private final double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    public double width() {
        return width;
    }

    public double height() {
        return height;
    }

    @Override
    public double area() {
        return width * height;
    }
}
```

SealedInterfaceTest.java

```java
package com.hua.demo;

import org.junit.Test;

public class SealedInterfaceTest {

    @Test
    public void test() {
        Shape circle = new Circle(2);
        Shape rectangle = new Rectangle(3, 4);

        System.out.println(area(circle));
        System.out.println(area(rectangle));
    }

    static double area(Shape shape) {
        return switch (shape) {
            case Circle c -> c.area();
            case Rectangle r -> r.area();
        };
    }
}
```
