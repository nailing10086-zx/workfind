// CDP 连通性诊断脚本 v2（模拟 Chrome MCP 服务器进程的访问方式）
(async () => {
  const results = [];

  // 1. 默认 127.0.0.1（node fetch 与 chrome-devtools-mcp 相同用法）
  try {
    const r = await fetch('http://127.0.0.1:9222/json/version');
    const j = await r.json();
    results.push('node fetch 127.0.0.1:9222 ✓ ' + j.Browser);
  } catch (e) {
    results.push('node fetch 127.0.0.1:9222 ✗ ' + (e.cause ? e.cause.message : e.message));
  }

  // 2. 显式 IPv6
  try {
    const r = await fetch('http://[::1]:9222/json/version');
    const j = await r.json();
    results.push('node fetch [::1]:9222 ✓ ' + j.Browser);
  } catch (e) {
    results.push('node fetch [::1]:9222 ✗ ' + (e.cause ? e.cause.message : e.message));
  }

  // 3. localhost 主机名（node 默认解析顺序）
  try {
    const r = await fetch('http://localhost:9222/json/version');
    const j = await r.json();
    results.push('node fetch localhost:9222 ✓ ' + j.Browser);
  } catch (e) {
    results.push('node fetch localhost:9222 ✗ ' + (e.cause ? e.cause.message : e.message));
  }

  // 4. dns.lookup 看 localhost 解析（promise 版）
  const dns = require('dns').promises;
  try {
    const addrs = await dns.lookup('localhost', { all: true });
    results.push('dns localhost → ' + JSON.stringify(addrs));
  } catch (e) {
    results.push('dns localhost ✗ ' + e.message);
  }

  // 5. 代理 env
  const proxyVars = Object.keys(process.env).filter(k => /proxy/i.test(k));
  results.push('代理环境变量: ' + (proxyVars.length ? proxyVars.map(k => k + '=' + process.env[k]).join('; ') : '无'));

  console.log(results.join('\n'));
})();
