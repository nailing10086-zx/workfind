# WorkFind — 央国企招聘查询 Skill

帮你查央国企招聘信息：官网、校招时间（基于近 3 年历史推算）、岗位方向、匹配度评估。
**面向所有求职者**：下载本仓库后，填一份自己的简历就能用——不绑定任何人。

## 项目结构

```
├── .reasonix/skills/workfind/SKILL.md  ← Reasonix skill（核心）
├── .reasonix/skills/workfind/references/
│   ├── company-sources.yaml  ← 公司校招数据源登记表（官网/公众号，命中免重搜）
│   ├── anti-fraud.md         ← 校招诈骗识别清单（收费内推/保过/保证金等8类）
│   ├── campus-calendar.md    ← 央国企秋招日历（2027届，已核实/预计分月时间线）
│   └── job-advice.md         ← 央国企求职内参（晋升/关系/转政府/结构化面试/避坑/概率模型）
├── docs/                 ← 文档（模型白皮书等）
│   └── 央国企校招录用概率模型白皮书.md  ← 录用概率模型完整设计论证与文献（v3.0，非投稿）
├── 各省国企/            ← 全国各省国企名录（Markdown，33省）
├── 国企数据库.json       ← 国企数据（供脚本读取）
├── 国企数据库.db         ← 同数据 SQLite 版（DataGrip 查询）
├── 央企二级子公司.json    ← 央企二级/省公司关系
├── 央国企完整名录_2026.txt ← 全国央国企名录
├── 央国企名录_分省索引.txt ← 分省索引
├── 查国企.js            ← Node 查询脚本（无需 Reasonix）
└── 简历/               ← 放你自己的简历（已被 .gitignore 排除，不会上传）
```

## 安装（三选一，先装环境再使用）

### 方式一：Reasonix（推荐，功能完整）
1. 安装 [Reasonix](https://reasonix.ai)（桌面版/CLI）
2. 安装本 skill：
   - 命令安装：在 Reasonix 里运行 `/install-capability` 指向本仓库 `gitee.com/zxasoul/workfind`
   - 或手动：clone 仓库，把 `.reasonix/skills/workfind/` 整个目录复制到你的项目 `.reasonix/skills/` 下
3. 安装 `firecrawl` MCP（联网搜索必需）
4. 简历放进 `简历/` 目录 → 使用 `/workfind`

### 方式二：Claude Code / Cursor 等通用 Agent
1. 把 `.reasonix/skills/workfind/` 整个目录（SKILL.md + references/）放到对应位置：
   - Claude Code：`.claude/skills/workfind/`
   - Cursor：`.cursor/skills/workfind/`
2. 配置 `firecrawl` MCP（联网搜索）
3. 用法相同，按你的工具方式触发

### 方式三：不装 Agent，只用本地清单（Node.js）
- 有 Node.js 就能查全国国企清单（无需 AI、无需 Reasonix）：
  ```
  node 查国企.js 广东           # 查看某省国企清单
  node 查国企.js 广东 电信       # 按关键词筛选
  node 查国企.js --list          # 查看所有省份
  ```
- AI 分析（录用参考 / 简历诊断 / 秋招日历 / 概率模型）需要方式一或二

### 依赖总览
| 依赖 | 用途 | 必需 |
|------|------|:---:|
| firecrawl MCP | 联网搜索岗位/公告 | ✅（AI 分析时）|
| Node.js | 本地国企清单查询 | 可选 |

## 快速开始（Reasonix）

1. 安装 `firecrawl` MCP（联网搜索必需）
2. 把你的简历放进 `简历/` 目录（.md / .txt / .docx / .pdf 都行），或直接在对话里拖文件
3. 运行 skill，传参：

```
/workfind 简历: 简历/我的简历.md 地区: 广东 只查已开放: true
```

支持的结构化参数：

| 参数 | 说明 | 示例 |
|:-----|:-----|:-----|
| `简历:` | 候选人简历路径（可选，docx/pdf 自动解析）| `简历: 简历/我的简历.md` |
| `地区:` | 限定办公地点=岗位工作地（非公司总部；总部在外地但本地有岗仍可投）| `地区: 广东` |
| `行业:` | 只看这些行业 | `行业: [运营商, 军工装备]` |
| `岗位:` | 只看这些岗位方向 | `岗位: [综合管理, 审计, 数据分析]` |
| `排除:` | 明确不看的岗 | `排除: [纯销售, 写代码技术岗]` |
| `只查已开放:` | true=未开放单位只给预计时间 | `只查已开放: true` |
| `分组:` | true=按行业分组跑批+分缓存 | `分组: true` |

其他用法：

```
/workfind 全部 广东        # 查某省全部国企（省份任意，逐家含难度评估）
/workfind 中国铁塔         # 查单家单位
/workfind 攻略             # 国企晋升/关系运作/转政府知识
/workfind 简历 [岗位名]    # 针对该岗位生成定制简历
/workfind 简历诊断 [岗位名] # 诊断简历缺口（JD关键词对齐、缺失经历、改写建议）
/workfind 宣讲会 中国铁塔   # 查近期校招宣讲会/投递时间节点
/workfind 秋招日历         # 输出央国企秋招时间线（分月，已核实/预计）
/workfind 内参 结构化面试  # 央国企求职内参（晋升/关系/转政府/面试/避坑）
/workfind 投递 记录 中国铁塔 综合管理 已投  # 记录投递事件（投递 列表 查看）
/workfind 投递 结果 中国铁塔 综合管理 offer  # 记录最终结果，用于模型校准
/workfind 模型 校准        # 样本≥10后对比预测与实际，校准基线/修正因子
/workfind 数据 贡献        # 生成脱敏数据文件，复制粘贴提交（无需 git）
```

## 贡献数据改进模型（一键同意，零操作）

这个 skill 会越用越准：投递结果积累后，模型会校准基线。如果你想帮忙改进模型（**完全自愿，数据已脱敏**）：

1. 跑 `/workfind 数据 贡献` → skill 生成脱敏 JSON（只含学历层级/证书有无/关系有无/行业/地区/结果，**不含姓名/学校/公司名等个人信息**）
2. 你只需要说"同意" → skill **自动提交**到维护者接收端点，无需复制粘贴、无需打开网页、无需装 git

> 隐私保证：提交内容可先展示给你确认；拒绝则绝不发送，不影响任何功能。

维护者数据接收端点：维护者在**本地**文件 `.reasonix/skills/workfind/维护者配置.json` 填写 webhook URL 与加签 secret（飞书/钉钉/企微群机器人或维格表 API，国内直连免费）；**该文件不进仓库、不公开**。未配置时，用户数据保存在本地不丢失。

## 内置特色功能

- **央国企秋招日历**：全国/分省校招时间线（每家预计开放+网申窗口+截止），不用盯公告
- **录用参考模型（论文基线+简历修正）**：通用劳动力市场简历审计（Bertrand & Mullainathan 2004 AER 等）实证基线（申请→回调 10-15%）× 逐项简历修正（学历/证书/经历/关系，每项标论文依据）→ 个人参考区间（封顶 50%）+ 多投组合策略
- **央国企求职内参**：晋升路径、关系运作（四档评级）、转政府通道、结构化面试、避坑方法论
- **投递记忆**：记录已投/笔试/面试/offer 状态，命中已投单位自动提示勿重复
- **反诈骗识别**：收费内推 / 保过 / 代投 / 保证金等 8 类校招骗局，自动标注 ⚠️
- **敏感信息边界**：薪酬 / HC / 通过率只标公开来源，否则写"估算"或"未查到"
- **数据源优先级**：你给的链接 > 内置公司登记表 > 本地国企库 > 网络搜索 > 不编造

## 没有简历也能用

不给简历也能跑，输出客观岗位信息，匹配度标"需自行判断"。给了简历，匹配度评估会以简历为准（教育/证书/经历/硬约束/筛选条件）。

## 简历格式建议

直接用你现有的简历即可（不挑格式）。想优化匹配度评估，可以在简历里附一段筛选条件，例如：

```
## 投递筛选条件
- 地区：广东省内（任意省份）
- 行业：运营商、军工装备、数据科技
- 岗位方向：综合管理 / 审计 / 数据分析 / 信息安全
- 排除：纯销售、需要写代码的技术岗
- 企业类型：央国企优先
```

## 有 Node.js 时直接查清单（不用 AI）

```bash
node 查国企.js 广东           # 查看某省国企清单（省份任意）
node 查国企.js 广东 投资       # 按关键词筛选
node 查国企.js 江苏 导出       # 导出为独立 MD 文件
node 查国企.js --list          # 查看所有省份
```

## 数据来源

各市国资委官网 / guozi.org / 本地宝招聘 / 应届生求职网 / 智联招聘。数据已验证，非 AI 生成。

数据规模：约 1550 家 —— 100 家一级央企（国务院国资委监管）+ 33 省省属国企 + 31 省会市属国企 + 24 个重点城市市属国企。

## 依赖

- Reasonix + firecrawl MCP（联网搜索）
- Node.js（本地清单查询，可选）

## 学术引用（录用参考模型的论文依据）

录用参考模型中的**论文基线、简历修正因子与参数取值**基于以下学术研究，特此致谢。各参数已按保守原则整合与下调，非直接复刻原文数值。

**同行评审（顶刊/经典）**
- Bertrand & Mullainathan (2004), *Are Emily and Greg More Employable Than Lakisha and Jamal? A Field Experiment on Labor Market Discrimination*, American Economic Review 94(4) —— 简历回调率基线
- Pager, Western & Bonikowski (2009), *Discrimination in a Low-Wage Labor Market: A Field Experiment*, American Sociological Review 74(5) —— 简历回调率基线
- Spence (1973), *Job Market Signaling*, Quarterly Journal of Economics 87(3) —— 学历信号
- Schmidt & Hunter (1998), *The Validity and Utility of Selection Methods in Personnel Psychology*, Psychological Bulletin 124(2) —— 选拔测试效度
- Becker (1964), *Human Capital*, University of Chicago Press —— 经历/人力资本
- Di Stasio & Gërxhani (2015), *Employers' social contacts and their hiring behavior in a factorial survey*, Social Science Research（PMID:25769854）—— 推荐效应

**近年实证（2020s，数值锚点优先）**
- Kline, Rose & Walters (2022), 简历审计基准研究, American Economic Review —— 申请→回调基线（近年）
- *Can LLMs Hire Fairly? Racial Bias in Resume Screening*（arxiv:2606.28978）—— AI 招聘时代简历筛选审计
- *Hiring Discrimination and the Task Content of Jobs*（arxiv:2604.01933，36,880 申请大样本审计）—— 管理岗回调差 28-43%

**中国场景（2025/2026 校招行业数据）**
- 《2026 校园招聘白皮书》：2025 届硕士平均起薪 **13749 元/月**；73.5% 企业用 AI 简历筛选缩短初筛；AI 辅助面试 33.1%
- 北森《2026 校招报告》：95% 校招生使用 AI 求职，简历同质化严重
- 《2025 春季校园招聘白皮书》：72.4% 学生参与 AI 面试（较 2024 +20.2%）；77% 企业应用 AI 工具（简历筛选 52.6%）
- 教育部就业调研：面试环节紧张 49.95%、表达欠缺 49.46% 为求职失败主因

**中国权威（中文顶刊）**
- 边燕杰 (1997), *Bringing Strong Ties Back In: Indirect Ties, Network Bridges, and Job Searches in China*, American Sociological Review 62(3) —— 强关系求职（中国场景）
- 边燕杰、丘海雄 (2000), *企业的社会资本及其功效*, 《中国社会科学》—— 关系/社会资本
- 边燕杰 (2004), *城市居民社会资本的来源及作用：网络观点与调查发现*, 《中国社会科学》—— 关系/社会资本
- 《校园招聘有效性：影响因素及其负面影响》(2010) —— 中国校招实证

**跨场景结构参考（医学匹配，仅借漏斗方向）**
- *Preference Signaling Pilot in the Urology Match* (2022), Urology（DOI:10.1016/j.urology.2022.08.034）
- *Insights from the San Francisco Match rank list data* (2014), Annals of Plastic Surgery（DOI:10.1097/SAP.0000000000000185）

**预印本（arxiv，未经同行评审，仅作方向参考）**
- *AI Skills Improve Job Prospects*（arxiv:2601.13286）
- *The Role of Referrals in Labor Markets*（arxiv:2012.15753）
- *Hiring Discrimination and the Task Content of Jobs*（arxiv:2604.01933）
- *The Value of Non-Traditional Credentials*（arxiv:2405.00247）

> 完整模型与参数说明见 `references/job-advice.md`。如引用有误，欢迎指正。

## 致谢

感谢 Reasonix 生态提供的技能和 MCP 支持：

**技能**：`deep-research` · `forkprobe` · `humanizer-zh` · `remove-ai-flavor` · `deslop` · `avoid-ai-writing` · `reasonix-guide` · `install-capability` · `review` · `security-review` · `explore` · `research` · `init` · `push-skills`

**MCP**：`firecrawl-mcp`（岗位搜索/企业信息抓取）· `luma-mcp`（图像理解）

感谢开源生态：Node.js · Git。

## 许可证

MIT
