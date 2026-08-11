// 面试结构测试：结构只决定准备建议，不产生预设通过率。
const assert = require('node:assert/strict');

const guidance = {
  structured: '按胜任力准备真实案例，练习统一计时回答',
  group: '练习表达、倾听、协作和可验证案例',
  multi_round: '按每轮职责分别准备，并记录逐轮结果',
  unstructured: '以岗位相关事实作答，不推断印象加成',
  unknown: '结构未查到，先核实公告或官方说明'
};

function describeInterview(type, localPassRate) {
  if (!(type in guidance)) throw new Error('未知面试结构');
  if (localPassRate === undefined) {
    return { type, preparation: guidance[type], passRate: null, basis: 'requires_local_data' };
  }
  if (localPassRate < 0 || localPassRate > 1) throw new RangeError('通过率必须位于 [0, 1]');
  return { type, preparation: guidance[type], passRate: localPassRate, basis: 'validated_local_data_required' };
}

for (const type of Object.keys(guidance)) {
  assert.equal(describeInterview(type).passRate, null);
}
assert.equal(describeInterview('structured', 0.4).basis, 'validated_local_data_required');
assert.throws(() => describeInterview('structured', 1.1), RangeError);

console.log('interview-structure-test: PASS');
