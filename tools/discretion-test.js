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

console.log('=== 同一候选人，三种筛选方式（张洵画像）===\n');

// 1. 九洲纪检：主观裁量筛选（军工+审计相关）
const jiuzhou = calc({
  name: '九洲·纪检干事（主观裁量筛选）',
  school: 0.7,        // 双非惩罚大（主观印象）
  cert: 1.1,          // CISP 对纪检弱相关
  exp: 1.4,           // 审计经历强对口
  target: 1.5,        // 军工定向
  compete: 1.2,       // 低竞争
  kw: 1.1,            // 关键词对齐
  written: 0.6,       // 未备考
  interview: 0.4      // 央国企差额
});

// 2. 建行科技专项：硬标准筛选（银行科技岗）
const ccb = calc({
  name: '建行·科技专项人才（硬标准筛选）',
  school: 0.9,        // 双非惩罚小（门槛过了一视同仁）
  cert: 1.3,          // CDA/CDA 证书硬通货，权重最高
  exp: 1.2,           // 数据审计对口
  target: 1.2,        // 跨行业转译
  compete: 0.7,       // 省行热门高竞争
  kw: 1.0,
  written: 0.6,
  interview: 0.4      // 央国企差额
});

// 3. 京东运营：大厂算法筛选
const jd = calc({
  name: '京东·JDS运营（大厂算法筛选）',
  school: 0.6,        // 双非机筛惩罚最大
  cert: 1.0,          // 证书对运营无用
  exp: 1.0,           // 审计对运营弱对口
  target: 1.0,        // 大厂
  compete: 0.7,       // 海量投递
  kw: 0.9,
  written: 0.6,
  interview: 0.2      // 大厂多轮
});

[jiuzhou, ccb, jd].forEach(r => console.log(r.name + '\n   回调率: ' + r.callback + '  录用率: ' + r.offer + '\n'));

console.log('=== 验证点 ===');
console.log('① 三岗录用率应拉开明显差距（主观岗 vs 大厂岗天然差 5-10 倍——双非投大厂运营接近无望，真实案例：四非投130+全部被拒）');
const rates = [jiuzhou, ccb, jd].map(r => parseFloat(r.offer));
console.log('   最大/最小 = ' + (Math.max(...rates) / Math.min(...rates)).toFixed(1) + ' 倍（京东0.7%符合事实，非模型错误）');
console.log('② 建行硬筛选岗证书权重应起作用（证书 1.3 是最大单因子）→ 见 ccb 计算');
console.log('③ 京东双非惩罚最大（0.6）且证书/经历无用 → 应最低');
console.log('   排序检查: ' + [jiuzhou, ccb, jd].sort((a,b)=>parseFloat(b.offer)-parseFloat(a.offer)).map(r=>r.name.split('（')[0]).join(' > '));
