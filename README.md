# MoE × PEFT 论文项目网站

基于《An Empirical Study of Parameter-Efficient Fine-Tuning for Mixture-of-Experts LLMs》制作的英文静态项目网站。

## 预览

直接用浏览器打开 `index.html`，即可查看页面。也可以在本目录启动本地服务：

```sh
python3 -m http.server 8000
```

随后访问 `http://localhost:8000`。

## 已包含

- 作者、单位、研究范围及论文摘要。
- 四条核心发现，以及适配位置、粒度、PEFT 方法、辅助损失四组可切换结果。
- 原论文图表的高清预览与放大窗口。
- Qwen3 上 MoE²-LoRA 改进前后的完整比较，包含一般能力收益与下游准确率代价。
- 功能有效秩与预训练谱一致性分析。
- 可复制的 BibTeX、手机导航、键盘操作和减少动态效果设置支持。

## 公开链接

论文、代码和作者主页暂未提供，页面中的论文和代码显示为 “Coming soon”。公开后，编辑 `site-config.js`：

```js
window.PROJECT_CONFIG = {
  paperUrl: "https://arxiv.org/abs/你的论文编号",
  codeUrl: "https://github.com/你的账号/仓库",
  authorUrls: {
    minglei: "",
    peng: "",
    haonan: "",
    jingqi: "",
    qingyu: "",
    tao: ""
  }
};
```

仅填写真实公开地址；空值会保留待发布状态。BibTeX 暂用 `@unpublished`，未编造年份、会议或 arXiv 编号。论文发布后，请同步更新 `index.html` 底部的引用。

## GitHub Pages 发布

仓库：`leoli646/moefactory-project-page`。

公开地址：`https://leoli646.github.io/moefactory-project-page/`。

本网站无构建步骤、无运行时依赖。将网站文件提交到 `main` 分支后，在仓库的 **Settings → Pages** 中选择 **Deploy from a branch → main → /(root)**。首次部署完成后网址生效；以后推送到 `main` 自动更新。正式地址已写入 canonical、Open Graph、robots.txt 和 sitemap.xml。

## 配色与内容

配色直接来自论文：主题深蓝 `#1E3A5F`、强调蓝 `#4A90D9`、结论蓝 `#2B5F8A`、背景浅蓝 `#EFF6FC`。颜色变量在 `styles.css` 顶部。

`assets/figures/` 中的 PDF 来自本地 Overleaf 项目，PNG 为原图渲染。网站中的成对条形图，上方为三模型、双任务平均下游准确率，下方为 MMLU-Pro 与 IFEval 相对预训练基线变化的平均值（pp）；数据来自四张原始结果图的 Average (6 cells) 行。上游图采用独立的 −10 至 +10 pp 坐标范围，中心线为零，数值显示两位小数。图表放大后可查看模型与任务细节。

本网站与 Overleaf 论文仓库独立维护。论文和研究代码链接尚待提供。
