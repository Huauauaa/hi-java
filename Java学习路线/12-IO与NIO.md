# 第 12 章：IO 与 NIO

## 学习目标

- 掌握字节流与字符流的使用
- 了解 NIO 与文件 API 基础

## 核心知识点

### IO 分类

| 维度 | 类型 |
|------|------|
| 方向 | 输入流、输出流 |
| 数据 | 字节流（InputStream/OutputStream）、字符流（Reader/Writer） |
| 角色 | 节点流、处理流（包装） |

### 常用类

```
字节：FileInputStream, FileOutputStream, BufferedInputStream
字符：FileReader, FileWriter, BufferedReader, BufferedWriter
对象：ObjectInputStream, ObjectOutputStream（序列化）
```

### 文件读写示例

```java
// 字符流 + 缓冲
try (BufferedReader reader = new BufferedReader(new FileReader("in.txt"));
     BufferedWriter writer = new BufferedWriter(new FileWriter("out.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        writer.write(line);
        writer.newLine();
    }
}
```

### File 与 Path（NIO.2）

```java
Path path = Paths.get("data.txt");
List<String> lines = Files.readAllLines(path);
Files.write(path, lines, StandardCharsets.UTF_8);

File file = new File("data.txt");
file.exists();
file.length();
```

### 序列化

- 实现 `Serializable`，`transient` 跳过字段
- `serialVersionUID` 版本兼容

### NIO 基础

- `Channel`、`Buffer`：非阻塞 IO 基础
- `Selector`：多路复用，适合高并发网络 IO
- 与 BIO 对比：BIO 一线程一连接，NIO 一线程多连接

### 资源管理

- 优先 `try-with-resources`
- 缓冲流提升性能

## 实践建议

- 实现文件复制（字节流 / NIO `Files.copy`）
- 读取配置文件，练习 Properties
