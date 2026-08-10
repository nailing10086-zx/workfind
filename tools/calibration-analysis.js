// 投递追踪校准分析脚本
// 用法：node tools/calibration-analysis.js [csv路径]  （默认 docs/投递追踪模板.csv）
// 功能：①校准曲线（预测分桶 vs 实际offer率）②Brier score ③环节漏斗对比 ④整体统计
// 输入字段：预测录用率, 结果_offer, 结果_简历, 结果_笔试, 结果_面试, 最终结果

const fs = require('fs');
const path = process.argv[2] || 'docs/投递追踪模板.csv';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const header = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).filter(l => l.trim()).map(l => {
    const cells = l.split(',').map(c => c.trim());
    const row = {};
    header.forEach((h, i) => row[h] = cells[i] || '');
    return row;
  });
}

const rows = parseCSV(fs.readFileSync(path, 'utf8'));
console.log('=== 投递追踪校准分析 ===');
console.log('样本数: ' + rows.length + '\n');

// 1. 基础统计
const offers = rows.filter(r => r['结果_offer'] === '是').length;
const offerRate = offers / rows.length;
const avgPred = rows.reduce((s, r) => s + parseFloat(r['预测录用率'] || 0), 0) / rows.length;
console.log('实际 offer 率: ' + (offerRate * 100).toFixed(1) + '%  (' + offers + '/' + rows.length + ')');
console.log('平均预测录用率: ' + avgPred.toFixed(1) + '%');
console.log('校准差（实际-预测）: ' + ((offerRate * 100) - avgPred).toFixed(1) + ' 个百分点' + (Math.abs(offerRate*100 - avgPred) <= 3 ? ' ✅ 校准良好' : ' ⚠️ 偏离'));

// 2. Brier score
const brier = rows.reduce((s, r) => {
  const p = parseFloat(r['预测录用率'] || 0) / 100;
  const y = r['结果_offer'] === '是' ? 1 : 0;
  return s + (p - y) * (p - y);
}, 0) / rows.length;
console.log('\nBrier score: ' + brier.toFixed(4) + '（0=完美，0.25=永远猜50%）');

// 3. 环节漏斗对比（只统计已出结果的）
console.log('\n=== 环节漏斗 ===');
const funnelStages = [
  ['简历', '结果_简历', '过'],
  ['笔试', '结果_笔试', '过'],
  ['面试', '结果_面试', '过']
];
let prevN = rows.length;
funnelStages.forEach(([name, col, passVal]) => {
  const withResult = rows.filter(r => r[col] !== 'NA' && r[col] !== '');
  if (withResult.length === 0) { console.log(name + ': 无结果'); return; }
  const passed = withResult.filter(r => r[col] === passVal).length;
  const rate = passed / withResult.length;
  console.log(name + ': ' + passed + '/' + withResult.length + ' = ' + (rate * 100).toFixed(1) + '%' +
    (withResult.length < prevN ? '' : '（待推进）'));
  prevN = passed;
});

// 4. 校准曲线（预测分桶）
console.log('\n=== 校准曲线（按预测录用率分桶）===');
const buckets = [[0, 3], [3, 6], [6, 10], [10, 20], [20, 100]];
buckets.forEach(([lo, hi]) => {
  const inBucket = rows.filter(r => {
    const p = parseFloat(r['预测录用率'] || 0);
    return p >= lo && p < hi;
  });
  if (inBucket.length === 0) return;
  const hit = inBucket.filter(r => r['结果_offer'] === '是').length;
  const actual = hit / inBucket.length;
  console.log('预测 ' + lo + '-' + hi + '%: n=' + inBucket.length + ' 实际 ' + (actual * 100).toFixed(0) + '%' +
    (Math.abs(actual*100 - (lo+hi)/2) <= 5 ? ' ✅' : ' ⚠️'));
});

// 5. 分层诊断（哪些维度预测准/不准）
console.log('\n=== 分层诊断（样本≥3 才看）===');
['筛选方式', '面试结构', '用人偏好', '岗位类型'].forEach(dim => {
  console.log('-- ' + dim + ' --');
  const groups = {};
  rows.forEach(r => { const v = r[dim] || '未知'; (groups[v] = groups[v] || []).push(r); });
  Object.entries(groups).forEach(([k, grp]) => {
    if (grp.length < 3) return;
    const hit = grp.filter(r => r['结果_offer'] === '是').length;
    const avg = grp.reduce((s, r) => s + parseFloat(r['预测录用率'] || 0), 0) / grp.length;
    console.log('  ' + k + ': n=' + grp.length + ' 实际 ' + (hit/grp.length*100).toFixed(0) + '% vs 预测 ' + avg.toFixed(1) + '%');
  });
});
