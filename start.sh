#!/bin/bash

echo "========================================="
echo "  VideoCap - 屏幕录制程序"
echo "========================================="
echo ""

cd "$(dirname "$0")"

if [ ! -d "node_modules/electron" ]; then
    echo "[1/2] 正在安装依赖（使用国内镜像）..."
    ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ npm install
    if [ $? -ne 0 ]; then
        echo "错误: 依赖安装失败"
        exit 1
    fi
    echo ""
fi

echo "[2/2] 启动应用..."
echo ""
echo "快捷键说明:"
echo "  ⌘ + ⇧ + R  - 开始/停止录制"
echo "  ⌘ + ⇧ + S  - 停止录制"
echo ""
echo "录制时程序会自动最小化，录制完成后自动恢复窗口。"
echo ""

npx electron .
