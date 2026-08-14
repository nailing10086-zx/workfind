# 录用模型证据与边界

本文件记录模型修订所依据的人员选拔、预测模型与统计方法文献。文献可用于判断测评方法是否有岗位相关效度、如何建模和怎样验证；**不能把效度系数、相关系数或其他场景的比例直接换算成个人录用概率**。

## 结论摘要

- 结构化面试通常比随意访谈更可靠，但“效度更高”不等于“通过率更高”，也不提供某个岗位的 offer 概率。
- 2022 年后的更新研究指出，部分经典选拔效度估计因范围限制校正过度而偏高；使用历史数值时必须以更新证据为准。
- 人岗/人组织匹配研究支持“匹配与工作结果相关”，不支持为学历、证书、关系、关键词或定向投递设置可跨场景迁移的固定倍率。
- 数值预测需要目标人群的本地数据、明确分母、足够样本、内部或时间外验证、校准评估及不确定区间。
- 同一候选人的多次投递共享潜在因素，通常不满足无条件独立。应用分层/混合效应模型处理相关性，不应用人为“实力上限”截断独立概率。
- 当前文献没有提供可直接套用到中国央国企校招各环节的通用基准率；没有合格本地数据时，默认只给证据等级。

## 文献分别支持什么

| 主题 | 可支持 | 不可支持 |
|:-----|:-------|:---------|
| 人员选拔效度 | 选择较有证据的测评方法，比较预测效度 | 把效度系数当作回调率、通过率或 offer 率 |
| 面试结构 | 使用统一题目、追问规则和评分标准 | 给结构化、群面、多轮面预设固定通过率 |
| 人岗匹配 | 将岗位要求与可验证经历逐项对齐 | 给“匹配”预设固定加成或因果倍率 |
| 概率模型 | 分阶段建模、检查校准和整体误差 | 用零散案例、行业均值或“保守取值”生成个人概率 |
| 样本量 | 按参数、事件率、过拟合和精度要求计算 | 使用“10 条即可校准”之类统一门槛 |
| 多次投递 | 用候选人随机效应、单位/岗位层级和年份效应 | 假设全部岗位无条件独立，或设置任意能力上限 |

## APA 7 参考文献

Berry, C. M., Lievens, F., Zhang, C., & Sackett, P. R. (2024). Insights from an updated personnel selection meta-analytic matrix: Revisiting general mental ability tests’ role in the validity–diversity trade-off. *Journal of Applied Psychology*. https://doi.org/10.1037/apl0001203

Breslow, N. E., & Clayton, D. G. (1993). Approximate inference in generalized linear mixed models. *Journal of the American Statistical Association, 88*(421), 9–25. https://doi.org/10.1080/01621459.1993.10594284

Campion, M. A., Palmer, D. K., & Campion, J. E. (1997). A review of structure in the selection interview. *Personnel Psychology, 50*(3), 655–702. https://doi.org/10.1111/j.1744-6570.1997.tb00709.x

Kristof-Brown, A. L., Zimmerman, R. D., & Johnson, E. C. (2005). Consequences of individuals’ fit at work: A meta-analysis of person–job, person–organization, person–group, and person–supervisor fit. *Personnel Psychology, 58*(2), 281–342. https://doi.org/10.1111/j.1744-6570.2005.00672.x

Levashina, J., Hartwell, C. J., Morgeson, F. P., & Campion, M. A. (2014). The structured employment interview: Narrative and quantitative review of the research literature. *Personnel Psychology, 67*(1), 241–293. https://doi.org/10.1111/peps.12052

Riley, R. D., Debray, T. P. A., Collins, G. S., Archer, L., Ensor, J., van Smeden, M., & Snell, K. I. E. (2021). Minimum sample size for external validation of a clinical prediction model with a binary outcome. *Statistics in Medicine, 40*(19), 4230–4251. https://doi.org/10.1002/sim.9025

Riley, R. D., Ensor, J., Snell, K. I. E., Harrell, F. E., Jr., Martin, G. P., Reitsma, J. B., Moons, K. G. M., Collins, G. S., & van Smeden, M. (2020). Calculating the sample size required for developing a clinical prediction model. *BMJ, 368*, m441. https://doi.org/10.1136/bmj.m441

Sackett, P. R., Lievens, F., & Landers, R. N. (2026). Hiring people in organizations: The state and future of the science. *Annual Review of Organizational Psychology and Organizational Behavior, 13*, 49–75. https://doi.org/10.1146/annurev-orgpsych-020924-072127

Sackett, P. R., Zhang, C., Berry, C. M., & Lievens, F. (2022). Revisiting meta-analytic estimates of validity in personnel selection: Addressing systematic overcorrection for restriction of range. *Journal of Applied Psychology, 107*(11), 2040–2068. https://doi.org/10.1037/apl0000994

Sackett, P. R., Zhang, C., Berry, C. M., & Lievens, F. (2023). Revisiting the design of selection systems in light of new findings regarding the validity of widely used predictors. *Industrial and Organizational Psychology, 16*(3), 283–300. https://doi.org/10.1017/iop.2023.24

Schmidt, F. L., & Hunter, J. E. (1998). The validity and utility of selection methods in personnel psychology: Practical and theoretical implications of 85 years of research findings. *Psychological Bulletin, 124*(2), 262–274. https://doi.org/10.1037/0033-2909.124.2.262

Society for Industrial and Organizational Psychology. (2018). *Principles for the validation and use of personnel selection procedures* (5th ed.). Author.

Steyerberg, E. W., Vickers, A. J., Cook, N. R., Gerds, T., Gonen, M., Obuchowski, N., Pencina, M. J., & Kattan, M. W. (2010). Assessing the performance of prediction models: A framework for traditional and novel measures. *Epidemiology, 21*(1), 128–138. https://doi.org/10.1097/EDE.0b013e3181c30fb2

Van Calster, B., McLernon, D. J., van Smeden, M., Wynants, L., & Steyerberg, E. W. (2019). Calibration: The Achilles heel of predictive analytics. *BMC Medicine, 17*, Article 230. https://doi.org/10.1186/s12916-019-1466-7

Wingate, T. G., Bourdage, J. S., & Steel, P. (2025). Evaluating interview criterion-related validity for distinct constructs: A meta-analysis. *International Journal of Selection and Assessment, 33*(1), e12494. https://doi.org/10.1111/ijsa.12494

## 版本说明

- 本轮仅采用同行评审论文和专业学会规范；未使用预印本作为模型参数依据。
- 这些预测建模论文部分来自医学统计领域，用于通用的样本量、校准和验证方法，不作为招聘场景的基准率来源。
- 每次模型更新都应重新核对 DOI、版本、目标人群与适用边界。
