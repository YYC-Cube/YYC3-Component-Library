# ============================================================
# YYC³（YanYuCloudCube™ · 注册商标）
# 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
# 万象归元于云枢 | 深栈智启新纪元
# All things converge in cloud pivot; Deep stacks ignite a new era of intelligence
# ============================================================
# Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
# ============================================================
# deprecate-legacy-ui.sh — @yyc3/ui 更名 @yyc3/ui-enterprise 后的 npm 废弃指引
# 依据：A2 终裁「双线分工」+ refactor/ui-enterprise-rename（正仓会话①，owner 已批）
# 执行人：owner（npm publish 权限持有者）；本脚本不随 CI 执行
# ============================================================
# 说明：
# - npm 上 @yyc3/ui 名下 stable 线（1.0.0 ~ 2.0.2，latest=2.0.2）为 CL radix 线历史发布；
#   废弃后安装将收到指引信息，包仍可安装（deprecate ≠ unpublish）。
# - 3.0.0-alpha.* 为 FAmily-Pai base-ui 线（beta tag），A2 裁决保留 @yyc3/ui 名义，
#   **不在废弃范围**；如误跑全量废弃请立即用 npm deprecate 恢复空消息。
# - dry-run：逐条回显命令，去掉 --dry-run 前缀变量 DEMO=0 实际执行。
# ============================================================
set -euo pipefail

LEGACY="@yyc3/ui"
SUCCESSOR="@yyc3/ui-enterprise"
MESSAGE="Renamed to ${SUCCESSOR} (YYC³ 企业通用 Radix 线). AI Family base-ui 线请使用 3.0.0-alpha.x（beta tag）. See https://github.com/YYC-Cube/YYC3-Component-Library"
DEMO="${DEMO:-1}"

echo "== 当前 @yyc3/ui 已发布版本（请人工核对归属后再执行）=="
npm view "$LEGACY" versions --json
npm view "$LEGACY" dist-tags --json

# CL radix 线历史发布（stable 线）；如与实际不符，注释/增删下行列表
VERSIONS="1.0.0 1.0.1 1.0.2 1.1.0 1.1.1 2.0.0 2.0.1 2.0.2"

for v in $VERSIONS; do
  if [ "$DEMO" = "1" ]; then
    echo "[dry-run] npm deprecate \"${LEGACY}@${v}\" \"${MESSAGE}\""
  else
    npm deprecate "${LEGACY}@${v}" "$MESSAGE"
    echo "deprecated: ${LEGACY}@${v}"
  fi
done

echo "== 完成。核验：npm view ${LEGACY} deprecated versions =="
