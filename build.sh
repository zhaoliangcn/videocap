#!/bin/bash

echo "========================================="
echo "  VideoCap - 打包脚本"
echo "  VideoCap - Build Script"
echo "========================================="
echo ""

cd "$(dirname "$0")"

# 检测操作系统
OS=""
case "$(uname -s)" in
    Darwin*)    OS="mac" ;;
    Linux*)     OS="linux" ;;
    MINGW*|CYGWIN*|MSYS*) OS="win" ;;
    *)          OS="unknown" ;;
esac

echo "检测到系统: $OS"
echo ""

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "[1/3] 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 依赖安装失败"
        exit 1
    fi
    echo ""
else
    echo "[1/3] 依赖已存在，跳过安装"
    echo ""
fi

# 选择打包平台
echo "[2/3] 选择打包平台:"
echo "  1) 当前系统 ($OS)"
echo "  2) macOS"
echo "  3) Windows"
echo "  4) Linux"
echo "  5) 全部平台"
echo ""
read -p "请选择 [1-5]: " choice

case $choice in
    1) TARGET="" ;;
    2) TARGET="--mac" ;;
    3) TARGET="--win" ;;
    4) TARGET="--linux" ;;
    5) TARGET="--mac --win --linux" ;;
    *) echo "无效选择，打包当前系统"; TARGET="" ;;
esac

echo ""
echo "[3/3] 开始打包..."
echo ""

# 执行打包
if [ -n "$TARGET" ]; then
    npx electron-builder $TARGET
else
    npm run build
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================="
    echo "  打包完成！"
    echo "  输出目录: release/"
    echo "========================================="
    echo ""
    ls -la release/ 2>/dev/null
else
    echo ""
    echo "========================================="
    echo "  打包失败！"
    echo "========================================="
    exit 1
fi
