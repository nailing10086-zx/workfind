#!/bin/bash
# Chrome MCP 调试浏览器启动脚本（保证参数一致，登录态持久）
# 用法：bash tools/chrome-mcp-start.sh
# 说明：自动发现 Chrome；默认使用独立 profile。可用 CHROME_PATH / CHROME_MCP_PROFILE 覆盖
#
# ⚠️ 关键（2026-08-10 踩坑修复）：
# 必须让 Chrome 脱离当前 shell 存活（守护进程），否则 bash 会话一结束 Chrome 被杀，
# Chrome MCP 就会报 "Could not connect to Chrome ... fetch failed"（实际是 9222 已无监听）。
# 用 nohup + 重定向 + 延迟 detach，保证独立于调用方 shell 的进程组。

CHROME="${CHROME_PATH:-}"
WINDOWS_LOCAL_APPDATA=""

if [[ -z "$CHROME" ]] && command -v cygpath >/dev/null 2>&1 && [[ -n "${LOCALAPPDATA:-}" ]]; then
  WINDOWS_LOCAL_APPDATA="$(cygpath -u "$LOCALAPPDATA")"
  for candidate in \
    "$WINDOWS_LOCAL_APPDATA/Google/Chrome/Application/chrome.exe" \
    "$WINDOWS_LOCAL_APPDATA/Chromium/Application/chrome.exe"; do
    if [[ -x "$candidate" ]]; then
      CHROME="$candidate"
      break
    fi
  done
fi

if [[ -z "$CHROME" ]]; then
  for command_name in google-chrome google-chrome-stable chromium chromium-browser; do
    if command -v "$command_name" >/dev/null 2>&1; then
      CHROME="$(command -v "$command_name")"
      break
    fi
  done
fi

if [[ -z "$CHROME" || ! -x "$CHROME" ]]; then
  echo "⚠️ 未找到 Chrome。请设置 CHROME_PATH 为可执行文件路径。"
  exit 1
fi

if [[ -n "${CHROME_MCP_PROFILE:-}" ]]; then
  PROFILE="$CHROME_MCP_PROFILE"
elif [[ -n "$WINDOWS_LOCAL_APPDATA" ]]; then
  PROFILE="$WINDOWS_LOCAL_APPDATA/workfind/chrome-devtools-profile"
else
  PROFILE="${XDG_STATE_HOME:-$HOME/.local/state}/workfind/chrome-devtools-profile"
fi
PORT=9222

mkdir -p "$PROFILE"

# 1. 检查是否已在运行
if curl -s -m 3 "http://127.0.0.1:${PORT}/json/version" | grep -q "Browser"; then
  echo "✅ Chrome MCP 已在运行（端口 ${PORT}），登录态沿用 profile：${PROFILE}"
  exit 0
fi

# 2. 以守护进程方式启动（nohup 脱离会话；重定向避免挂起；独立 profile 不影响日常 Chrome）
echo "🔄 守护方式启动 Chrome（调试模式 ${PORT}，profile：${PROFILE}）..."
nohup "$CHROME" \
  --remote-debugging-port=${PORT} \
  --user-data-dir="${PROFILE}" \
  --no-first-run \
  --no-default-browser-check \
  about:blank >/dev/null 2>&1 </dev/null &
disown

# 3. 等待端口就绪
for i in 1 2 3 4 5 6 7 8 9 10; do
  sleep 1
  if curl -s -m 3 "http://127.0.0.1:${PORT}/json/version" | grep -q "Browser"; then
    echo "✅ Chrome 已就绪（端口 ${PORT}）——现在 curl 和 node fetch 都应能连通"
    exit 0
  fi
done

echo "⚠️ 10 秒内未就绪，请手动检查 Chrome 是否被占用"
exit 1
