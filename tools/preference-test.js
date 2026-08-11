// 用人偏好测试：同一合成候选人，不同"公司看重什么"时的计算差异
// 模型：回调率 = 基线15% × 院校(筛选方式) × 证书 × 经历 × 定向(行业) × 竞争 × 关键词 × 偏好权重
// 合成画像只用于检查计算行为，不对应任何真实个人

const base = 0.15;

function calc({ name, school, cert, exp, target, pref, kw, written, interview }) {
  const rate = Math.min(base * 1.0 * school * cert * exp * target * pref * kw, 0.35);
  return { name, offer: (rate * written * interview * 100).toFixed(1) + '%' };
}

console.log('=== 同一合成候选人：五种用人偏好的公司 ===\n');

// 都是"综合管理岗"，但公司看重不同
const cases = [
  // 稳定型：运营商市州（本地扎根是卖点）
  calc({ name: 'A. 稳定型（运营商市州，求本地扎根）', school: 0.7, cert: 1.1, exp: 1.3, target: 1.5, pref: 1.3, kw: 1.1, written: 0.6, interview: 0.4 }),
  // 忠诚型：央企党建（政治素质是卖点）
  calc({ name: 'B. 忠诚型（央企党建，求政治素养）',   school: 0.7, cert: 1.1, exp: 1.2, target: 1.4, pref: 1.3, kw: 1.1, written: 0.6, interview: 0.4 }),
  // 能力型：数据岗（即战力是卖点，CDA 权重高）
  calc({ name: 'C. 能力型（数据/科技岗，求即战力）',  school: 0.9, cert: 1.3, exp: 1.3, target: 1.2, pref: 1.2, kw: 1.0, written: 0.6, interview: 0.4 }),
  // 高潜型：管培生（双非最不利）
  calc({ name: 'D. 高潜型（管培生，求名校高潜）',     school: 0.6, cert: 1.0, exp: 1.0, target: 1.1, pref: 0.65, kw: 0.9, written: 0.6, interview: 0.4 }),
  // 销售型：业务拓展（🔴 排除，这里仅展示）
  calc({ name: 'E. 业绩型（销售岗，求业绩）',         school: 0.7, cert: 1.0, exp: 1.0, target: 1.0, pref: 1.0, kw: 0.9, written: 0.6, interview: 0.4 })
];

cases.forEach(c => console.log('  ' + c.name + ': ' + c.offer));

console.log('\n=== 验证点 ===');
console.log('① 排序完全由合成参数决定，不代表真实招聘中的稳定关系');
console.log('② 高潜型（管培）双非最不利，应慎投');
console.log('③ 销售型虽未排除在此计算中，但硬约束应🔴直接排除，不投');

// 排序验证
const sorted = cases.map((c, i) => ({ ...c, i })).sort((a, b) => parseFloat(b.offer) - parseFloat(a.offer));
console.log('\n排序: ' + sorted.map(s => s.name.split('（')[0]).join(' > '));
console.log('\n=== 结论 ===');
console.log('合成示例仅用于检查计算和排序逻辑；不得据此推荐真实候选人的赛道');
