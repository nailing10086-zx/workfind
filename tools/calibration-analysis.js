// 投递追踪校准分析脚本 v2（多被试版）
// 用法：node tools/calibration-analysis.js [csv路径]  （默认 docs/投递追踪模板.csv）
// 功能：①整体校准（校准曲线/Brier）②环节漏斗 ③分层诊断（筛选方式/面试结构/用人偏好/岗位类型）
//       ④多被试分析：按被试分组、按院校档次/专业/证书分层对比回调率与offer率
// 输入字段：被试ID, 院校档次, 专业大类, 证书, 实习经历, 预测录用率, 结果_offer, 结果_简历, 结果_笔试, 结果_面试

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
console.log('=== 投递追踪校准分析 v2（多被试）===');
const subjects = new Set(rows.map(r => r['被试ID'])).size;
console.log('样本数: ' + rows.length + ' 行, 被试: ' + subjects + ' 人\n');

// 1. 整体校准
const offers = rows.filter(r => r['结果_offer'] === '是').length;
const offerRate = offers / rows.length;
const avgPred = rows.reduce((s, r) => s + parseFloat(r['预测录用率'] || 0), 0) / rows.length;
console.log('实际 offer 率: ' + (offerRate * 100).toFixed(1) + '%  (' + offers + '/' + rows.length + ')');
console.log('平均预测录用率: ' + avgPred.toFixed(1) + '%');
console.log('校准差: ' + ((offerRate * 100) - avgPred).toFixed(1) + ' pp' + (Math.abs(offerRate*100 - avgPred) <= 3 ? ' ✅' : ' ⚠️'));

const brier = rows.reduce((s, r) => {
  const p = parseFloat(r['预测录用率'] || 0) / 100;
  const y = r['结果_offer'] === '是' ? 1 : 0;
  return s + (p - y) * (p - y);
}, 0) / rows.length;
console.log('Brier score: ' + brier.toFixed(4) + '（0=完美, 0.25=永远猜50%）\n');

// 2. 环节漏斗
console.log('=== 环节漏斗（全部被试）===');
let prevN = rows.length;
[['简历','结果_简历','过'],['笔试','结果_笔试','过'],['面试','结果_面试','过']].forEach(([name, col, passVal]) => {
  const withResult = rows.filter(r => r[col] !== 'NA' && r[col] !== '');
  if (!withResult.length) { console.log(name + ': 无结果'); return; }
  const passed = withResult.filter(r => r[col] === passVal).length;
  console.log(name + ': ' + passed + '/' + withResult.length + ' = ' + (passed/withResult.length*100).toFixed(1) + '%');
});

// 3. 多被试：按被试分组
console.log('\n=== 按被试分组（n≥5 才看）===');
const bySub = {};
rows.forEach(r => (bySub[r['被试ID']] = bySub[r['被试ID']] || []).push(r));
Object.entries(bySub).forEach(([id, grp]) => {
  if (grp.length < 5) return;
  const cb = grp.filter(r => r['结果_简历'] === '过').length / grp.filter(r => r['结果_简历'] !== '' && r['结果_简历'] !== 'NA').length;
  const hit = grp.filter(r => r['结果_offer'] === '是').length;
  const avg = grp.reduce((s, r) => s + parseFloat(r['预测录用率'] || 0), 0) / grp.length;
  console.log('  ' + id + ': n=' + grp.length + ' 回调率 ' + (cb*100).toFixed(0) + '%' +
    ' offer率 ' + (hit/grp.length*100).toFixed(0) + '% vs 预测 ' + avg.toFixed(1) + '%');
});

// 4. 组间对比：院校档次（检验"双非惩罚"命题）
console.log('\n=== 院校档次对比（检验双非 vs 985 回调率差异）===');
const bySchool = {};
rows.forEach(r => (bySchool[r['院校档次']] = bySchool[r['院校档次']] || []).push(r));
Object.entries(bySchool).forEach(([k, grp]) => {
  if (grp.length < 3) { console.log('  ' + k + ': 样本不足(' + grp.length + ')'); return; }
  const withRes = grp.filter(r => r['结果_简历'] !== '' && r['结果_简历'] !== 'NA');
  const cb = withRes.filter(r => r['结果_简历'] === '过').length / withRes.length;
  const hit = grp.filter(r => r['结果_offer'] === '是').length;
  console.log('  ' + k + ': n=' + grp.length + ' 回调率 ' + (cb*100).toFixed(0) + '% offer率 ' + (hit/grp.length*100).toFixed(0) + '%');
});

// 5. 组间对比：证书有无 / 专业
console.log('\n=== 证书有无对比 ===');
const byCert = {};
rows.forEach(r => (byCert[r['证书'] || '无'] = byCert[r['证书'] || '无'] || []).push(r));
Object.entries(byCert).forEach(([k, grp]) => {
  if (grp.length < 3) return;
  const withRes = grp.filter(r => r['结果_简历'] !== '' && r['结果_简历'] !== 'NA');
  if (!withRes.length) return;
  const cb = withRes.filter(r => r['结果_简历'] === '过').length / withRes.length;
  console.log('  ' + k.slice(0, 20) + ': n=' + grp.length + ' 回调率 ' + (cb*100).toFixed(0) + '%');
});

// 6. 分层诊断（筛选方式等）
console.log('\n=== 分层诊断（样本≥3）===');
['筛选方式', '面试结构', '用人偏好', '岗位类型'].forEach(dim => {
  const groups = {};
  rows.forEach(r => { const v = r[dim] || '未知'; (groups[v] = groups[v] || []).push(r); });
  const keys = Object.keys(groups).filter(k => groups[k].length >= 3);
  if (!keys.length) return;
  console.log('-- ' + dim + ' --');
  keys.forEach(k => {
    const grp = groups[k];
    const hit = grp.filter(r => r['结果_offer'] === '是').length;
    const avg = grp.reduce((s, r) => s + parseFloat(r['预测录用率'] || 0), 0) / grp.length;
    console.log('  ' + k + ': n=' + grp.length + ' 实际 ' + (hit/grp.length*100).toFixed(0) + '% vs 预测 ' + avg.toFixed(1) + '%');
  });
});
