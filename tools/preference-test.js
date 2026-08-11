// 岗位要求测试：只匹配公告明示标准，不推断隐藏偏好或固定加成。
const assert = require('node:assert/strict');

function compareRequirements(requirements, evidence) {
  const rows = requirements.map(requirement => ({
    requirement: requirement.name,
    required: requirement.required,
    verified: evidence.has(requirement.name)
  }));
  const hardConflict = rows.some(row => row.required && !row.verified);
  return {
    grade: hardConflict ? 'exclude' : rows.some(row => row.verified) ? 'evidence_present' : 'evidence_missing',
    probability: null,
    rows
  };
}

const requirements = [
  { name: '明示学历门槛', required: true },
  { name: '岗位相关项目', required: false }
];

assert.equal(compareRequirements(requirements, new Set()).grade, 'exclude');
const result = compareRequirements(requirements, new Set(['明示学历门槛', '岗位相关项目']));
assert.equal(result.grade, 'evidence_present');
assert.equal(result.probability, null);
assert.ok(result.rows.every(row => typeof row.verified === 'boolean'));

console.log('preference-test: PASS');
