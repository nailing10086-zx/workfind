// 筛选裁量权测试：验证同一候选人投三个不同筛选方式的岗位，概率差异是否符合文献机制
// 模型：回调率 = 基线15% × 学历 × 院校(按筛选方式) × 证书 × 经历 × 定向 × 竞争度 × 关键词
//       录用 = 回调率 × 笔试 × 面试（央国企差额0.4 / 大厂多轮0.2）

function calc({ name, school, cert, exp, target, compete, kw, written, interview, cap = 0.35 }) {
  const base = 0.15;
  const rate = base * 1.0 /*学历*/ * school * cert * exp * target * compete * kw;
  const r_capped = Math.min(rate, cap);
  const final = r_capped * written * interview;
  return { name, callback: (r_capped * 100).toFixed(1) + '%', offer: (final * 100).toFixed(1) + '%' };
}

console.log('=== 合成候选人：三种筛选方式 ===\n');

// 1. 地方国企合规岗：主观裁量筛选
const subjectiveRole = calc({
  name: '地方国企·合规岗（主观裁量筛选）',
  school: 0.7,        // 双非惩罚大（主观印象）
  cert: 1.1,          // 证书弱相关
  exp: 1.4,           // 经历强对口
  target: 1.5,        // 行业定向
  compete: 1.2,       // 低竞争
  kw: 1.1,            // 关键词对齐
  written: 0.6,       // 未备考
  interview: 0.4      // 央国企差额
});

// 2. 金融科技岗：硬标准筛选
const standardsRole = calc({
  name: '金融机构·科技岗（硬标准筛选）',
  school: 0.9,        // 双非惩罚小（门槛过了一视同仁）
  cert: 1.3,          // 岗位相关证书，权重较高
  exp: 1.2,           // 数据经历对口
  target: 1.2,        // 跨行业转译
  compete: 0.7,       // 省行热门高竞争
  kw: 1.0,
  written: 0.6,
  interview: 0.4      // 央国企差额
});

// 3. 互联网运营岗：算法筛选
const algorithmicRole = calc({
  name: '互联网企业·运营岗（算法筛选）',
  school: 0.6,        // 双非机筛惩罚最大
  cert: 1.0,          // 证书对运营无用
  exp: 1.0,           // 审计对运营弱对口
  target: 1.0,        // 大厂
  compete: 0.7,       // 海量投递
  kw: 0.9,
  written: 0.6,
  interview: 0.2      // 大厂多轮
});

[subjectiveRole, standardsRole, algorithmicRole].forEach(r => console.log(r.name + '\n   回调率: ' + r.callback + '  录用率: ' + r.offer + '\n'));

console.log('=== 验证点 ===');
console.log('① 本脚本只检查给定参数下的计算行为，不证明参数具有经验效度');
const rates = [subjectiveRole, standardsRole, algorithmicRole].map(r => parseFloat(r.offer));
console.log('   最大/最小 = ' + (Math.max(...rates) / Math.min(...rates)).toFixed(1) + ' 倍');
console.log('② 硬筛选岗中的证书权重应体现在计算结果中');
console.log('③ 算法筛选示例的院校、竞争和关键词系数较低，因此结果应最低');
console.log('   排序检查: ' + [subjectiveRole, standardsRole, algorithmicRole].sort((a,b)=>parseFloat(b.offer)-parseFloat(a.offer)).map(r=>r.name.split('（')[0]).join(' > '));
