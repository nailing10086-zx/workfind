// 证据输出测试：没有本地验证数据时，不得生成数值概率。
const assert = require('node:assert/strict');

function assessEvidence({ hardConflict = false, verifiedDirectEvidence = 0, calibratedModel = null }) {
  if (hardConflict) return { grade: 'exclude', probability: null };
  if (calibratedModel) {
    const required = ['population', 'timeWindow', 'sampleSizeBasis', 'validation', 'calibration'];
    if (required.some(key => !calibratedModel[key])) {
      throw new Error('数值模型缺少必要的适用范围或验证信息');
    }
    return { grade: 'calibrated_numeric', probability: calibratedModel.predict() };
  }
  const grade = verifiedDirectEvidence >= 3 ? 'strong' : verifiedDirectEvidence >= 1 ? 'medium' : 'weak';
  return { grade, probability: null };
}

assert.deepEqual(assessEvidence({ hardConflict: true }), { grade: 'exclude', probability: null });
assert.deepEqual(assessEvidence({ verifiedDirectEvidence: 0 }), { grade: 'weak', probability: null });
assert.deepEqual(assessEvidence({ verifiedDirectEvidence: 2 }), { grade: 'medium', probability: null });
assert.deepEqual(assessEvidence({ verifiedDirectEvidence: 4 }), { grade: 'strong', probability: null });
assert.throws(() => assessEvidence({ calibratedModel: { predict: () => 0.2 } }), /缺少/);

console.log('discretion-test: PASS');
