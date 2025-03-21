# Anime Games Scraper

这个项目用于从GameDistribution站点抓取二次元风格的游戏（Anime、Manga、Fantasy风格），并自动生成HTML页面，包含游戏名称、描述、IFrame代码和缩略图。

## 功能特点

- 自动抓取GameDistribution的二次元游戏
- 根据关键词过滤二次元风格游戏
- 下载并保存游戏缩略图
- 生成美观的响应式HTML页面
- 自动创建游戏详情页，包含游戏iframe
- 支持多线程抓取，提高效率
- 为每个游戏生成独特的占位图像
- 游戏描述使用英文，便于国际用户阅读

## 安装要求

```bash
pip install -r requirements.txt
```

## 使用方法

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/anime-games-scraper.git
cd anime-games-scraper
```

2. 安装依赖：

```bash
pip install -r requirements.txt
```

3. 运行脚本：

```bash
python scraper.py
```

4. 在`output`目录中查看生成的HTML文件和游戏数据

## 最近更新

- **占位图像改进**：现在为每个游戏生成独特的占位图像，包含游戏标题和美观的样式
- **英文描述**：所有游戏描述均使用英文，提升国际用户体验
- **游戏库扩展**：添加了更多动漫游戏，包括拼图、塔防和角色扮演类游戏
- **图像处理优化**：改进了图像下载和处理逻辑，解决了403禁止访问问题

## 自定义配置

您可以在`scraper.py`文件中修改以下配置：

- `OUTPUT_DIR`: 输出目录
- `MAX_PAGES`: 抓取的最大页数
- `ANIME_KEYWORDS`: 用于判断游戏风格的关键词

## 将结果推送到GitHub

1. 创建GitHub仓库
2. 初始化本地Git仓库并推送：

```bash
git init
git add .
git commit -m "Initial commit: Anime Games Scraper"
git remote add origin https://github.com/yourusername/anime-games-scraper.git
git push -u origin main
```

## 注意事项

- 请遵守GameDistribution的使用条款
- 抓取时添加了随机延迟，以避免对服务器造成过大负担
- 生成的HTML页面使用响应式设计，适配各种设备

## 许可证

MIT
