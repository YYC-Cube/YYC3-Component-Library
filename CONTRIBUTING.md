# 贡献指南 · CONTRIBUTING

感谢关注 YYC³ 家族项目！贡献前请先阅读团队标准规范 SSOT 与本仓三份核心文档：

- [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) — 迁移总计划（进度唯一事实源）
- [组件拆分执行衔接手册](./docs/YYC3-项目组件-拆分规范/YYC3-组件拆分-执行衔接手册.md) — 单组件十步规程与放行标准
- [权威副本映射表](./docs/YYC3-项目组件-拆分规范/YYC3-权威副本-映射表.md) — 一切主库抽取的强制输入（D0 门）

## 🌿 分支规范

| 分支 | 用途 |
|---|---|
| `main` | 稳定线（**受保护**：禁直推、禁强推，一切变更走 PR） |
| `feat/<主题>` | 功能 / 组件抽取批次 |
| `fix/<主题>` | 缺陷修复 |
| `docs/<主题>` | 文档 |
| `phase<N>/<主题>` | 阶段性工作（如 `phase1/consolidation`） |
| `dependabot/*` | 依赖机器人（自动） |

## 📝 提交规范（Conventional Commits）

```
feat: 新功能        fix: 缺陷修复       docs: 文档
style: 格式         refactor: 重构      perf: 性能
test: 测试          build: 构建         chore: 杂务
```

示例：`feat(music): 抽取 Player 组件（源：UI-9/YYC3-Music，D0 行 #12）`

## 🔄 贡献流程

1. Fork / 建分支
2. 开发 + 自测：`pnpm build && pnpm test`（组件类变更走[执行衔接手册 §四十步规程](./docs/YYC3-项目组件-拆分规范/YYC3-组件拆分-执行衔接手册.md)）
3. 新组件入库要求：独立性评分 ≥ 0.8、P0 测试场景（CS-001~010）覆盖、Storybook story、包级 README 回写
4. 提交（遵循上述规范，一次提交一件事）
5. Push 并发起 PR（关联 Issue；抽取类 PR 须在描述中注明**源绝对路径 + 权威副本映射表行号**）
6. 通过测试与维护者审查后合并；版本变更经 changesets 登记（`pnpm changeset`）

## 📐 文档规范

新增/修改 Markdown 文档须遵循[标头标尾规范 v1.1.0](./docs/YYC3-团队通用-标规文档/YYC3-团队通用-标头标尾.md)：13 字段 front-matter + 品牌引用块 + 变更历史表 + 居中标尾；正文品牌写 `YYC³`，文件名/包名用 ASCII `YYC3`。

## 📄 许可

贡献即同意以 [MIT](LICENSE) 许可授权贡献内容。

---

> ***YanYuCloudCube*** · *言启象限 | 语枢未来*
