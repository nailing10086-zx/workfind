// 实力上限模型测试：验证"投递数量 vs 组合概率"曲线是否饱和
// 模型：组合概率 = min(1-(1-p̄)^n, C)，C = 1-(1-p_max)^3

function combo(pArr) {
  const n = pArr.length;
  // 独立假设
  const indep = 1 - pArr.reduce((acc, p) => acc * (1 - p), 1);
  // 实力上限
  const p_max = Math.max(...pArr);
  const C = 1 - Math.pow(1 - p_max, 3);
  const capped = Math.min(indep, C);
  return { n, indep: (indep * 100).toFixed(1) + '%', cap: (C * 100).toFixed(1) + '%', final: (capped * 100).toFixed(1) + '%' };
}

// 张洵已投 5 岗（新模型回调率×笔试×面试，九洲系 7-9%、京东 3%、中航 6%）
const invested = [0.08, 0.07, 0.08, 0.03, 0.06];
console.log('=== 当前已投 5 岗 ===');
console.log(combo(invested));

// 模拟投满 8/11/20 家（新增同质量岗）
function extend(arr, n, p) {
  const a = arr.slice();
  for (let i = 0; i < n; i++) a.push(p);
  return a;
}
console.log('\n=== 投满 8 家（+3 家 5%）===');
console.log(combo(extend(invested, 3, 0.05)));
console.log('\n=== 投满 11 家（+6 家 5%）===');
console.log(combo(extend(invested, 6, 0.05)));
console.log('\n=== 投满 20 家（+15 家 5%）===');
console.log(combo(extend(invested, 15, 0.05)));
console.log('\n=== 极端：同实力投 100 家 ===');
console.log(combo(extend(invested, 95, 0.05)));

// 验证"实力弱的人投再多也没用"
console.log('\n=== 实力弱（全是 1% 岗）投 50 家 ===');
const weak = new Array(50).fill(0.01);
console.log(combo(weak));
