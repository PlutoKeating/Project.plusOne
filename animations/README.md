# 教程原理动画

用 [Remotion](https://www.remotion.dev/) 编写的原理动画。打包成一个网页脚本 `docs/assets/anim/plusone-anim.js`，在页面里用 Remotion Player 播放，不导出视频文件。

## 目录

| 路径 | 作用 |
|------|------|
| `src/kit.tsx` | 公共画布、配色和图元：`Stage` `Card` `Arrow` `Packet` `Caption` `FadeIn` |
| `src/scenes/*.tsx` | 每个文件一个动画，导出 `scene`；文件名就是动画 id |
| `src/registry.ts` | 由 `scripts/gen-registry.mjs` 自动生成，不要手改 |
| `src/Root.tsx` | Remotion Studio 预览入口 |
| `src/web/entry.tsx` | 网页入口：把 `<div data-anim="id">` 挂载成播放器 |
| `scripts/build-web.mjs` | esbuild 打包到 `docs/assets/anim/plusone-anim.js` |

## 命令

```console
npm i                # 安装依赖
npm run dev          # 打开 Remotion Studio 预览全部动画
npm run build:web    # 生成网页脚本（改完动画后必须执行并提交产物）
npm run lint         # eslint + tsc 检查
```

## 在教程里使用

在 Markdown 里写：

```html
<div data-anim="ch04-react-loop"></div>
```

`docs/index.html` 加载打包后的脚本，并在 Docsify 每次渲染页面后挂载播放器。播放器滚动到可见区域时自动播放，离开时暂停。

## 新增动画

1. 在 `src/scenes/` 新建 `chNN-主题.tsx`（小写字母、数字、连字符），参照 `ch04-react-loop.tsx` 导出 `scene`。
2. 画布固定 1280×720、30fps；动画只用 `useCurrentFrame()` + `interpolate()/spring()` 驱动，不用 CSS 动画。
3. `npm run build:web`，在页面里加 `data-anim` 占位，本地预览确认。
