#!/bin/bash
# Chrome MCP 调试浏览器启动脚本（保证参数一致，登录态持久）
# 用法：bash tools/chrome-mcp-start.sh
# 说明：固定使用同一 user-data-dir，登录态保存在该 profile；重复运行会复用已有 Chrome

CHROME="/c/Users/22174/AppData/Local/Google/Chrome/Application/chrome.exe"
PROFILE="C:/Users/22174/.chrome-devtools-profile"
PORT=9222

# 1. 检查是否已在运行
if curl -s -m 3 "http://127.0.0.1:${PORT}/json/version" | grep -q "Browser"; then
  echo "✅ Chrome MCP 已在运行（端口 ${PORT}），登录态沿用 profile：${PROFILE}"
  exit 0
fi

# 2. 启动（独立 profile，不影响日常 Chrome；参数固定不变）
echo "🔄 启动 Chrome（调试模式 ${PORT}，profile：${PROFILE}）..."
"$CHROME" \
  --remote-debugging-port=${PORT} \
  --user-data-dir="${PROFILE}" \
  --no-first-run \
  --no-default-browser-check \
  about:blank &

# 3. 等待端口就绪
for i in 1 2 3 4 5 6 7 8 9 10; do
  sleep 1
  if curl -s -m 3 "http://127.0.0.1:${PORT}/json/version" | grep -q "Browser"; then
    echo "✅ Chrome 已就绪（端口 ${PORT}）"
    exit 0
  fi
done

echo "⚠️ 10 秒内未就绪，请手动检查 Chrome 是否被占用"
exit 1
