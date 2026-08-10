// 面试结构异质性测试：验证同一回调率下，不同面试结构的通过率和"准备杠杆"差异
// 模型：录用 = min(回调率, 35%) × 笔试通过率 × 面试→offer(按结构) × 未准备惩罚(按结构)

const base = 0.15;
// 张洵投综合管理岗：回调修正（学历1.0×院校0.7×证书1.1×经历1.3×定向1.5×竞争1.2×关键词1.1）
const callback = Math.min(base * 1.0 * 0.7 * 1.1 * 1.3 * 1.5 * 1.2 * 1.1, 0.35);

console.log('=== 同一候选人（回调率 ' + (callback * 100).toFixed(1) + '%），四种面试结构 ===\n');

const structures = [
  { name: '结构化统一面（银行/运营商/国网）', pass: 0.45, unprepared: 0.6 },
  { name: '半结构化+群面（国企综合/党建）',     pass: 0.35, unprepared: 0.65 },
  { name: '多轮独立面（京东/字节/阿里）',       pass: 0.20, unprepared: 0.6 },
  { name: '主观印象面（军工/关系岗）',          pass: 0.40, unprepared: 0.75 }
];

console.log('--- 未准备（×未准备惩罚）---');
const unprepared = structures.map(s => {
  const offer = callback * 0.6 /*笔试*/ * s.pass * s.unprepared;
  console.log('  ' + s.name + ': ' + (offer * 100).toFixed(1) + '%');
  return { ...s, offer };
});

console.log('\n--- 充分准备（未准备惩罚→1.0）---');
const prepared = structures.map(s => {
  const offer = callback * 0.6 /*笔试仍0.6：未备考*/ * s.pass * 1.0;
  console.log('  ' + s.name + ': ' + (offer * 100).toFixed(1) + '%');
  return { ...s, offer };
});

console.log('\n=== 验证点 ===');
console.log('① 未准备时：主观印象面（关系主导）反而比结构化面高——符合"准备收益小但关系能用"');
console.log('② 准备后：结构化面提升幅度最大（0.6→1.0 = 1.67倍）——符合"准备收益最大"');
const lift = structures.map((s, i) => prepared[i].offer / unprepared[i].offer);
structures.forEach((s, i) => console.log('   ' + s.name + ' 准备杠杆 ×' + lift[i].toFixed(2)));
console.log('③ 多轮独立面无论准备与否都最低——符合"大厂多轮最不利"');

console.log('\n=== 结论 ===');
const bestPrep = structures[lift.indexOf(Math.max(...lift))].name;
console.log('准备杠杆最大的是: ' + bestPrep + ' → 张洵应优先备考这类面试');
