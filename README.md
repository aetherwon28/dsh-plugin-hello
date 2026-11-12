# dsh-plugin-hello

一个最小可用的 DeepSeek Harness 插件模板：它只做一件事 —— 注册一个模型可调用的工具 `hello_world`。

```
dsh-plugin-hello/
├── package.json     # 包元数据，type: module
├── lib/index.js     # 插件本体（全部逻辑）
└── README.md
```

## 它长什么样

`lib/index.js` 导出三个东西，这就是一个 cordis 插件的全部契约：

| 导出 | 作用 |
|---|---|
| `name` | 插件在 profile 诊断里显示的名字 |
| `inject` | 依赖的宿主服务，这里是 `['tools']` |
| `apply(ctx)` | 挂载时执行，这里注册一个工具 |

工具定义是一个普通对象：`name` / `description` / `parameters`（JSON Schema）/ `output`（返回值 schema + 渲染成模型可读内容）/ `execute`。

刻意不引入任何运行时依赖，也不走构建：文件克隆下来就能被加载，不依赖宿主如何解析模块。代价是没有 `defineTool` 的类型推导（真实项目可以加回来，见文末）。

## 本地挂载（开发时）

1. 装进 profile：

   ```bash
   dsh plugin --profile web add /path/to/dsh-plugin-hello
   ```

2. 在你的 profile patch 层（`~/.dsh/profiles/web/cordis.patch.yml`）里插入这一条，让它被加载：

   ```yaml
   - insert:
       - id: hello
         name: dsh-plugin-hello
   ```

3. 重启该 profile 的 dsh 进程。之后模型会多出 `hello_world` 这个工具。

## 从 GitHub 安装

```bash
dsh plugin --profile web add github:aetherwon28/dsh-plugin-hello
```

同样需要在 `cordis.patch.yml` 里加那条 `insert`。

仓库：<https://github.com/aetherwon28/dsh-plugin-hello>

## 改成你自己的插件

1. 全局重命名：`package.json` 的 `name`、`lib/index.js` 里的工具名 `hello_world`、插件名 `plugin-hello`。
2. 改 `parameters` 和 `output.schema` 描述你的输入输出。
3. 改 `execute` 实现真实逻辑。
4. 想用类型推导和参数默认值时，换成官方写法：

   ```js
   import { defineTool } from '@deepseek-ai/dsh-tools'
   import z from '@deepseek-ai/schemastery'
   ```

   并在 `package.json` 里把它们声明为 `peerDependencies`（宿主已经安装了这些包）。

## 许可

MIT
