# hi-java

Java 学习笔记、示例代码与 Web 学习门户。

## 在线访问

| 站点 | 地址 |
|------|------|
| Java 文档 | https://huauauaa.github.io/hi-java/ |
| School 门户 | https://huauauaa.github.io/hi-java/school/ |

## 项目结构

```
hi-java/
├── apps/
│   ├── site/      # Hugo 文档站点
│   └── school/    # React + Ant Design + Tailwind CSS 门户
└── packages/
    └── hugo-geekdoc/  # Hugo 主题（submodule）
```

## 本地开发

### 前置依赖

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+
- [Hugo](https://gohugo.io/) 0.92+

```bash
# 初始化主题 submodule
git submodule update --init --recursive

# 安装依赖
pnpm install

# Hugo 文档（http://localhost:1313）
pnpm dev

# School 门户（http://localhost:5173）
pnpm dev:school
```

### 构建

```bash
pnpm build
```

构建产物合并到 `apps/site/public/`，其中 School 位于 `school/` 子路径，与 GitHub Pages 部署一致。

## License

MIT
