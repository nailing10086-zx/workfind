// 概率恒等式测试：只验证计算行为，不提供任何经验参数。
const assert = require('node:assert/strict');

function validateProbability(p) {
  if (!Number.isFinite(p) || p < 0 || p > 1) {
    throw new RangeError('概率必须位于 [0, 1]');
  }
}

function anyOfferIndependent(probabilities) {
  probabilities.forEach(validateProbability);
  return 1 - probabilities.reduce((product, p) => product * (1 - p), 1);
}

// 对共享潜在状态 u 做加权平均：E_u[1 - product(1 - p_i(u))]。
function anyOfferConditionalScenarios(scenarios) {
  const weightSum = scenarios.reduce((sum, scenario) => sum + scenario.weight, 0);
  assert.ok(Math.abs(weightSum - 1) < 1e-12, '场景权重之和必须为 1');
  return scenarios.reduce((sum, scenario) => {
    validateProbability(scenario.weight);
    return sum + scenario.weight * anyOfferIndependent(scenario.probabilities);
  }, 0);
}

assert.equal(anyOfferIndependent([]), 0);
assert.equal(anyOfferIndependent([0]), 0);
assert.equal(anyOfferIndependent([1]), 1);
assert.ok(Math.abs(anyOfferIndependent([0.2, 0.3]) - 0.44) < 1e-12);
assert.throws(() => anyOfferIndependent([1.01]), RangeError);

// 两个岗位的边际概率均为 0.5；共享状态造成正相关，组合概率不等于独立公式。
const correlated = anyOfferConditionalScenarios([
  { weight: 0.5, probabilities: [0.9, 0.9] },
  { weight: 0.5, probabilities: [0.1, 0.1] }
]);
const independentFromMarginals = anyOfferIndependent([0.5, 0.5]);
assert.ok(Math.abs(correlated - 0.59) < 1e-12);
assert.ok(Math.abs(independentFromMarginals - 0.75) < 1e-12);
assert.notEqual(correlated, independentFromMarginals);

console.log('probability-model-test: PASS');
