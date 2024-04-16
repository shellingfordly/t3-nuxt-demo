# Vue Comment

[English](https://github.com/shellingfordly/vue-comment/blob/main/README.md) | Chinese

这是一个基于 Github Issue 的 vue3 评论组件。它的灵感来自于一个叫[vssue](https://github.com/meteorlxy/vssue)的仓库。

如果你创建好了 `Github-OAuth` 并在配置在 env 中，然后创建第一个 issue，你就可以看到你的第一个 issue 内的所有评论了。

## 配置

设置 `Github-OAuth` 配置

创建 `New OAuth App` 获取 `clientId` 和 `clientSecret`

```bash
VITE_CLIENT_ID=replace_me
VITE_CLIENT_SECRET=replace_me
VITE_GITHUB_AUTHOR=replace_me
VITE_GITHUB_REPO=replace_me
```

## 运行

```
pnpm install
pnpm run dev
```

## 贡献

📜 如果您有任何问题或想法，可以提到 Issue 里。

❤️ 非常欢迎贡献

## Preview

![preview](./docs/img/preview.png)

quote replay

![quote replay](./docs/img/quote_replay.png)
