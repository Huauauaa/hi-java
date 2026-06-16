# 第 01 章：Java 入门与环境

## 学习目标

- 了解 Java 语言特点与适用场景
- 完成 JDK 安装与环境变量配置
- 编写并运行第一个 Java 程序

## 核心知识点

### Java 语言概述

- 跨平台：一次编译，到处运行（JVM）
- 面向对象、强类型、自动内存管理
- 主要应用领域：后端服务、Android、大数据、企业级系统

### 环境搭建

- **JDK**：Java Development Kit，含编译器 `javac` 与运行时 `java`
- **JRE**：Java Runtime Environment，仅运行
- 环境变量：`JAVA_HOME`、`PATH`
- IDE 选择：IntelliJ IDEA、Eclipse、VS Code + 插件

### 第一个程序

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

### 程序结构

- 源文件 `.java` → 编译 `.class`（字节码）→ JVM 执行
- 类名与文件名一致；`public class` 只能有一个
- `main` 方法是程序入口

### 基础概念

| 概念   | 说明               |
| ------ | ------------------ |
| JDK    | 开发工具包         |
| JRE    | 运行时环境         |
| JVM    | 虚拟机，执行字节码 |
| 字节码 | 平台无关的中间代码 |

## 实践建议

- 用命令行完成一次 `javac` + `java` 全流程
- 在 IDE 中创建 Maven/Gradle 空项目，熟悉目录结构
