// 相关性区间模型测试（2026-08 v2 重写）
// 旧版"实力上限 C=1-(1-p_max)^3"无推导依据、文档与实现不符（文档称投5→28% 实为 22.1%），已废弃。
// 新版：组合概率 = 区间 [下界, 上界]
//   上界 = 1-∏(1-pᵢ)        独立假设（投得越多越高）
//   下界 = max(pᵢ)          完全相关假设（结果全由同一实力决定）
//   参考值 = 上界 × 0.65    保守决策值（真实情况介于独立与完全相关之间）
// 文献：arxiv:2603.21699 / PMC12731703 —— 申请成功率取决于求职者自身质量（共享潜变量）

function combo(pArr) {
  const n = pArr.length;
  const indep = 1 - pArr.reduce((acc, p) => acc * (1 - p), 1);   // 独立假设上界
  const corr = Math.max(...pArr);                                 // 完全相关下界
  const ref = indep * 0.65;                                       // 保守参考值
  return {
    n,
    indep: (indep * 100).toFixed(1) + '%',
    corr: (corr * 100).toFixed(1) + '%',
    ref: (ref * 100).toFixed(1) + '%'
  };
}

// 张洵已投 5 岗（v2 模型单岗率：九洲系 1.1%、京东方 0.8%、中航系 1.5% 量级，取 0.6-1.5% 代表性值）
const invested = [0.011, 0.008, 0.015, 0.006, 0.010];
console.log('=== 当前已投 5 岗（单岗 0.6-1.5%）===');
console.log(combo(invested));

// 模拟投满 8/11/20 家（新增同质量岗）
function extend(arr, n, p) {
  const a = arr.slice();
  for (let i = 0; i < n; i++) a.push(p);
  return a;
}
console.log('\n=== 投满 8 家（+3 家 1%）===');
console.log(combo(extend(invested, 3, 0.01)));
console.log('\n=== 投满 11 家（+6 家 1%）===');
console.log(combo(extend(invested, 6, 0.01)));
console.log('\n=== 投满 20 家（+15 家 1%）===');
console.log(combo(extend(invested, 15, 0.01)));
console.log('\n=== 极端：同实力投 100 家 ===');
console.log(combo(extend(invested, 95, 0.01)));

// 验证"实力弱的人投再多也没用"：全 0.5% 岗
console.log('\n=== 实力弱（全是 0.5% 岗）投 50 家 ===');
const weak = new Array(50).fill(0.005);
console.log(combo(weak));

// 对照：全 1% 岗投 50 家（与文档"弱实力投 50 家≈上界39%/参考12%"对齐）
console.log('\n=== 全 1% 岗投 50 家（对照文档锚点）===');
console.log(combo(new Array(50).fill(0.01)));

// 验证结论：投递数量推高独立上界，但参考值与下界增长放缓
console.log('\n=== 拐点分析（单岗 1%，投 1/3/5/8/12/20 家）===');
for (const n of [1, 3, 5, 8, 12, 20]) {
  console.log(`投 ${String(n).padStart(2)} 家: ${JSON.stringify(combo(new Array(n).fill(0.01)))}`);
}
