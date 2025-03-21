#!/bin/bash

# 项目路径
PROJECT_PATH="/Users/athena/CascadeProjects/AnimeGamesHub"
DESKTOP_PATH="/Users/athena/Desktop/anime"

# 显示脚本头部信息
echo "====================================================="
echo "   AnimeGamesHub 桌面游戏更新脚本"
echo "====================================================="
echo ""
echo "将从以下目录导入游戏："
echo "$DESKTOP_PATH"
echo ""
echo "游戏将被导入到："
echo "$PROJECT_PATH"
echo ""

# 检查桌面游戏文件夹是否存在
if [ ! -d "$DESKTOP_PATH" ]; then
    echo "错误：桌面游戏文件夹不存在: $DESKTOP_PATH"
    exit 1
fi

# 检查项目文件夹是否存在
if [ ! -d "$PROJECT_PATH" ]; then
    echo "错误：项目文件夹不存在: $PROJECT_PATH"
    exit 1
fi

# 计算要导入的游戏数量
GAME_COUNT=$(find "$DESKTOP_PATH" -maxdepth 1 -type d | wc -l)
GAME_COUNT=$((GAME_COUNT - 1))
echo "找到 $GAME_COUNT 个游戏文件夹等待导入"

# 创建必要的目录
mkdir -p "$PROJECT_PATH/images/games"
mkdir -p "$PROJECT_PATH/js"

echo ""
echo "开始导入游戏..."
echo ""

# 激活虚拟环境
source "$PROJECT_PATH/venv/bin/activate"

# 运行Python导入脚本
cd "$PROJECT_PATH"
python import_desktop_games.py

# 检查是否成功
if [ $? -eq 0 ]; then
    echo ""
    echo "游戏导入完成！"
    echo ""
    echo "现在您可以在浏览器中打开以下URL查看更新后的网站："
    echo "file://$PROJECT_PATH/index.html"
    echo ""
    
    # 如果是Mac系统，尝试自动打开浏览器
    if [ "$(uname)" == "Darwin" ]; then
        echo "正在打开浏览器..."
        open "$PROJECT_PATH/index.html"
    fi
    
    echo "====================================================="
    echo "   导入过程完成"
    echo "====================================================="
else
    echo ""
    echo "错误：游戏导入过程中出现问题。"
    echo "请检查错误信息并尝试手动运行Python脚本。"
    echo ""
fi

# 关闭虚拟环境
deactivate
