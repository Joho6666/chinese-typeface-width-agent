# 汉字字宽调整 · Illustrator Agent 自动化

> 公开仓库，供 Grok bot、Codex、Claude Code 等具备**本地文件/应用执行权限**的 Agent 接手。项目目标：将课堂《汉字字宽调整》作业制作成**真正的 Adobe Illustrator .ai 源文件**，并导出 JPG。仓库内容为可执行起点，不代表 AI 文件已经生成。

## 任务与文件

- 题目：汉字字宽调整；一张画板两组词语，每组至少 3 字；同组每个汉字视觉宽高一致；一组大字面，一组小字面。
- 词组：**科技创新**（大字面）与 **梦想启航**（小字面）。
- 版面：A4 横向，297 × 210 mm；同一个画板；分组、留白、字身网格清晰。
- 交付：`班级名称/AI源文件/汉字字宽调整.ai` 和 `班级名称/JPG效果图/汉字字宽调整.jpg`。
- 字面目标（设计起点）：大字面可见字形约占字符框的 90%～94%，小字面约 72%～80%。不要把“字面”误解为仅设置不同字号。
- 主要汉字必须为**独立、可编辑的矢量轮廓**，避免字体缺失。
- JPG 目标分辨率 **300 ppi**，A4 横向约 3508 × 2480 px。

## Grok bot 如何接手

**先阅读 [GROK_BOT_TASK.md](GROK_BOT_TASK.md)**，再查看 [作业要求](docs/ASSIGNMENT.md) 和 [Illustrator 脚本](illustrator/generate_typography.jsx)。Agent 应实际运行脚本、截图检查视觉、验证并提交完成产物。

仓库提供 `illustrator/generate_typography.jsx` 作为自动化起点。该脚本：
1. 新建 A4 横向 RGB 画板；
2. 建立两组汉字的字身网格；
3. 将每字创建轮廓并独立编组；
4. 调整可见字形的宽、高、位置；
5. 保存 Illustrator 原生 `.ai`、导出 JPG；
6. 将执行状态写入结果文件。

> **关键限制：** 仅有云端聊天权限的 Grok bot，不能凭 GitHub 仓库直接操作你电脑上的 Illustrator。必须给 Grok bot 可使用的桌面执行器、远程电脑或本地工作区；未检测到 Adobe Illustrator 时不能宣称已经生成 `.ai`。

## 运行方式

### macOS

安装 Adobe Illustrator，克隆仓库，执行：

```bash
bash scripts/run_macos.sh /path/to/local/output "你的班级名称"
```

### Windows

在装有 Illustrator 的 Windows PowerShell 中运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run_windows.ps1 -OutputDir "D:\type-assignment" -ClassName "你的班级名称"
```

脚本应尽量使用 Illustrator 官方支持的 JavaScript / ExtendScript 自动化接口，而不是通过模拟点击盲目操作。运行后**必须打开实际 .ai 文件确认**，并对照 JPG 做视觉验证；不同 Illustrator 版本可能存在 API 差异，需要 Agent 修复脚本。

## 验收标准

- [ ] 只有一张 A4 横向画板，恰好两组四字词语
- [ ] 两组字体风格一致、大小字面的差异明显，同组字形光学宽高一致
- [ ] 四周留白合理、没有缺字/乱码/重叠/裁切
- [ ] Illustrator 重新打开 `.ai` 成功，文字轮廓可单独选择和编辑
- [ ] JPG 完整且清晰，目标 300ppi
- [ ] 文件实际保存于上述班级文件夹，不能通过重命名 SVG/EPS 伪造 AI
- [ ] Agent 报告输出目录、成功/失败、错误日志与核验截图

## 说明

作业要求源于用户提供的课程截图。本仓库公开分享任务说明与自动化脚本，不公开个人信息、账号凭据或学生身份信息。班级名称由操作者本地填写。
