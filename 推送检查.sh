#!/bin/bash
# 推送前检查（防多设备覆盖）
# 用法：bash 推送检查.sh
# 说明：你有两台电脑都可能推送 workfind。推送前先跑本脚本，确认本地不落后于 Gitee/GitHub。
#       落后 = 另一台电脑推过新内容 —— 必须先 git pull 合并，禁止直接 push 或 --force（会覆盖别人成果）。

cd "$(dirname "$0")" || exit 1

echo "本地 HEAD:   $(git log --oneline -1 2>/dev/null)"
git fetch origin 2>/dev/null
git fetch github 2>/dev/null

B_O=$(git rev-list --count HEAD..origin/master 2>/dev/null || echo "?")
B_G=$(git rev-list --count HEAD..github/master 2>/dev/null || echo "?")

echo "落后 Gitee:  ${B_O} 个提交"
echo "落后 GitHub: ${B_G} 个提交"

if [ "$B_O" != "?" ] && [ "$B_G" != "?" ]; then
  if [ "$B_O" -gt 0 ] || [ "$B_G" -gt 0 ]; then
    echo ""
    echo "⚠️ 本地落后了！另一台电脑可能推过新内容。"
    echo "   先执行：git pull origin master  （或 git pull github master）"
    echo "   合并后再推送。不要直接 push 或使用 --force！"
    exit 1
  else
    echo ""
    echo "✅ 本地是最新，可以推送："
    echo "   git push origin master   # Gitee"
    echo "   git push github master   # GitHub"
  fi
else
  echo "⚠️ 检查不完整（某个远端不可达），请手动确认远端状态再推送。"
fi
