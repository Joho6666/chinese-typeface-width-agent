# Grok bot 执行任务（直接复制整个内容作为接管指令）

仓库：https://github.com/Joho6666/chinese-typeface-width-agent

你是具有桌面自动化能力的 Illustrator 字体设计 Agent。现在接管这个 GitHub 项目，目标是**亲自制作、运行、验证和交付**《汉字字宽调整》作业，而不是只给教程或伪造产出。请先克隆/读取仓库 README.md、docs/ASSIGNMENT.md、illustrator/generate_typography.jsx 和 scripts/ 目录。

## 必达目标
- 一张 A4 横向页面。
- 「科技创新」大字面，「梦想启航」小字面。
- 每组四字，共八个汉字，每字为可编辑矢量路径，视觉宽高一致。
- 两组共用相同字身/参考格，不得仅缩放整体字号冒充字面变化。
- 输出真正的、由 Adobe Illustrator 原生保存的 `.ai` 和 300ppi 的 `.jpg`，分文件夹交付。

## 执行步骤
1. **环境盘点**：确认 OS、Illustrator 安装、版本、目标文件夹、字体。若 Illustrator 不存在，报告阻塞，仅准备可执行脚本/矢量预览，不得谎报成功。
2. **执行已有脚本**：使用 `illustrator/generate_typography.jsx` 作为起点，调用 Windows COM/BridgeTalk 或 macOS AppleScript/ExtendScript。修复实际报错（路径、字体、兼容性、Document API）。
3. **视觉检查**：渲染 JPG，打开实际效果图，检查没有错字、裁切、字形过度变形、笔画不均、中心偏移；调整每个字的 optical alignment（光学校正），必要时对单字进行更精细的轮廓级修整。
4. **存盘验证**：关闭 Illustrator 文档并重新打开生成的 .ai；确认各汉字可作为独立矢量轮廓编辑、位置正确，文件不是改后缀名。
5. **质量检验**：比较 AI/JPG 是否一致，确认 300ppi 目标、画板数、两组四字、目录结构及源文件非空。
6. **提交结果**：返回绝对文件路径、输出截图、错误/验证报告；如已获 GitHub 写权限，可以在 `output/` 提交不含私人信息的产物，或在仓库 issue/PR 说明结果。不要无授权覆盖原项目文件。

## 交付结构
```
<班级名称>/
  AI源文件/汉字字宽调整.ai
  JPG效果图/汉字字宽调整.jpg
```

## 质量优先的原则
- 作品具有字体设计课程作业质感，排版专业，但不堆砌不必要装饰。
- 同组四个汉字光学尺寸尽量统一，字面与字身的差异明确。
- 允许对 script 进行必要修复；不要停留在口头设计或空仓库。
- 遇到权限、安装或 API 阻塞，请给出证据和下一步最小人工操作。
- 不要使用在线 AI 图片生成代替原生 Illustrator 矢量工程。

**现在开始实际执行，完成后展示验证结果。**
