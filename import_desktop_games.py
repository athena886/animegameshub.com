#!/usr/bin/env python3
"""
桌面游戏导入工具 - AnimeGamesHub项目
将桌面游戏文件夹中的游戏导入到AnimeGamesHub项目中
"""

import os
import re
import json
import shutil
import uuid
from PIL import Image, ImageDraw, ImageFont
import random

# 配置
DESKTOP_GAMES_PATH = "/Users/athena/Desktop/anime"
PROJECT_PATH = "/Users/athena/CascadeProjects/AnimeGamesHub"
IMAGES_OUTPUT_PATH = os.path.join(PROJECT_PATH, "images/games")
GAMES_DATA_PATH = os.path.join(PROJECT_PATH, "js/desktop_games.js")

# 确保目录存在
os.makedirs(IMAGES_OUTPUT_PATH, exist_ok=True)

def generate_unique_id():
    """生成唯一ID"""
    return str(uuid.uuid4())[:8]

def extract_iframe_src(text):
    """从文本中提取iframe源URL"""
    iframe_pattern = r'<iframe\s+src=[\'"]([^\'"]+)[\'"]'
    match = re.search(iframe_pattern, text)
    if match:
        return match.group(1)
    return None

def extract_game_title(text):
    """从文本中提取游戏标题"""
    title_pattern = r'Game Title:\s*(.+)'
    match = re.search(title_pattern, text)
    if match:
        return match.group(1).strip()
    
    # 如果没有找到"Game Title:"格式，则尝试提取第一行作为标题
    lines = text.strip().split('\n')
    if lines:
        return lines[0].strip()
    
    return None

def categorize_game(title):
    """根据游戏标题猜测游戏类别"""
    title_lower = title.lower()
    
    categories = {
        "rpg": ["quest", "adventure", "fantasy", "rpg", "story", "legend"],
        "action": ["battle", "fight", "action", "combat", "warrior", "ninja", "samurai"],
        "puzzle": ["puzzle", "match", "jigsaw", "memory", "brain"],
        "romance": ["love", "dress", "fashion", "makeup", "dating", "couple", "wife", "avatar"],
        "casual": ["casual", "clicker", "idle", "pet", "animal", "cute"],
        "racing": ["race", "speed", "car", "driving", "drift"],
        "tower-defense": ["tower", "defense", "strategy", "castle"],
        "arcade": ["arcade", "retro", "classic", "pixel"],
        "idle": ["idle", "clicker", "tycoon"],
        "adventure": ["adventure", "explore", "journey", "quest"]
    }
    
    for category, keywords in categories.items():
        if any(keyword in title_lower for keyword in keywords):
            return category
    
    # 默认类别
    return random.choice(["adventure", "casual", "action", "puzzle"])

def process_image(source_path, target_path):
    """处理图片并保存到目标路径"""
    try:
        # 打开源图片
        img = Image.open(source_path)
        
        # 调整图片大小为固定尺寸
        img = img.resize((300, 200), Image.LANCZOS)
        
        # 保存处理后的图片为JPG格式
        img.convert('RGB').save(target_path, 'JPEG', quality=85)
        
        print(f"图片处理成功: {target_path}")
        return True
    except Exception as e:
        print(f"处理图片时出错: {e}")
        return False

def create_placeholder_image(output_path, title):
    """创建占位图片"""
    try:
        # 创建一个800x600的黑色背景图片
        width, height = 800, 600
        image = Image.new('RGB', (width, height), color=(17, 16, 31))
        draw = ImageDraw.Draw(image)
        
        # 尝试加载字体，如果不存在则使用默认字体
        try:
            # 尝试获取系统上的一个合适字体
            font_path = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
            
            title_font_size = 50
            
            # 如果字体文件不存在，PIL将使用默认字体
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, title_font_size)
            else:
                font = ImageFont.load_default()
        except Exception:
            font = ImageFont.load_default()
        
        # 添加网站名称
        logo_text = "AnimeGamesHub"
        logo_font_size = 40
        logo_font = font if font else ImageFont.load_default()
        
        draw.text((width/2, height/2 - 100), logo_text, 
                  fill=(66, 211, 255), font=logo_font, anchor="mm")
        
        # 添加"Image Placeholder"文本
        placeholder_text = "Image Placeholder"
        draw.text((width/2, height/2), placeholder_text, 
                  fill=(255, 66, 176), font=font, anchor="mm")
        
        # 添加游戏标题
        if len(title) > 20:
            title = title[:20] + "..."
        draw.text((width/2, height/2 + 100), title, 
                  fill=(255, 255, 255), font=font, anchor="mm")
        
        # 保存图片
        image.save(output_path)
        return True
    except Exception as e:
        print(f"创建占位图片失败: {e}")
        return False

def generate_game_description(title, category):
    """根据游戏标题和类别生成相关的英文游戏描述"""
    
    # 为不同类型的游戏准备描述模板
    descriptions_by_category = {
        "puzzle": [
            "Test your memory skills in this adorable {title}! Match pairs of cute anime characters and clear all levels to win.",
            "A challenging memory matching game featuring beautiful anime artwork. Train your brain while enjoying colorful anime graphics in {title}.",
            "Flip cards and find matching pairs in this exciting anime memory challenge. Perfect your recall skills with {title}!"
        ],
        "adventure": [
            "Embark on an epic adventure in {title}! Explore mysterious lands, defeat enemies, and uncover hidden treasures.",
            "Join the hero's journey in this thrilling anime adventure game. {title} offers hours of exploration and excitement.",
            "Navigate through dangerous terrain and face powerful foes in {title}, a captivating anime-styled adventure game."
        ],
        "action": [
            "Fast-paced anime action awaits in {title}! Test your reflexes as you battle through waves of enemies.",
            "Jump, dodge, and attack in this intense anime action game. {title} will challenge even experienced gamers.",
            "Unleash powerful combos and special moves in {title}, featuring smooth controls and exciting anime-style battles."
        ],
        "romance": [
            "Create your perfect anime avatar in {title}! Design characters, choose outfits, and express your unique style.",
            "Dress up cute anime characters with hundreds of fashion options in {title}. Show off your fashion sense!",
            "Customize every detail of your anime character in this detailed dress-up game. {title} offers endless style possibilities."
        ],
        "rpg": [
            "Immerse yourself in a rich anime world with {title}! Level up your character, learn new skills, and complete challenging quests.",
            "Experience an epic story with memorable characters in this anime RPG. {title} combines strategy and adventure.",
            "Build your dream team of heroes in {title}, a strategic anime RPG with deep character customization."
        ],
        "casual": [
            "Relax and enjoy {title}, a charming casual game with adorable anime aesthetics.",
            "Perfect for quick gaming sessions, {title} offers simple yet addictive gameplay with cute anime characters.",
            "Have fun with this lighthearted anime game. {title} is easy to learn but offers plenty of challenges."
        ],
        "tower-defense": [
            "Strategically place your defenses to stop waves of enemies in {title}, an anime-styled tower defense game.",
            "Build, upgrade, and manage your defensive structures in this challenging anime tower defense game. {title} will test your tactical skills.",
            "Protect your base from increasingly difficult enemy waves in {title}, featuring unique anime-inspired towers and abilities."
        ],
        "racing": [
            "Race through colorful anime-inspired tracks in {title}! Drift, boost, and outmaneuver your opponents.",
            "Experience high-speed thrills with cute anime characters in {title}, featuring various vehicles and tracks.",
            "Master challenging courses and unlock new cars in this exciting anime racing game. {title} combines speed and style!"
        ],
        "idle": [
            "Watch your anime empire grow in {title}! This idle game combines cute characters with strategic progression.",
            "Collect resources, upgrade abilities, and build your collection in this addictive anime idle game. {title} plays even when you're away!",
            "Enjoy steady progress and regular rewards in {title}, a relaxing anime idle game with charming visuals."
        ],
        "arcade": [
            "Experience classic gameplay with an anime twist in {title}! This arcade-style game offers simple controls but challenging levels.",
            "Test your skills in this fast-paced anime arcade game. {title} brings back retro gaming with modern anime graphics.",
            "Achieve high scores and compete for the top spot in {title}, featuring addictive arcade gameplay and anime characters."
        ]
    }
    
    # 默认描述模板
    default_descriptions = [
        "Enjoy the exciting anime game {title}! Immerse yourself in beautiful graphics and engaging gameplay.",
        "{title} offers a unique gaming experience with charming anime characters and intuitive controls.",
        "Discover the world of {title}, a delightful anime game that will keep you entertained for hours."
    ]
    
    # 根据类别选择描述模板
    templates = descriptions_by_category.get(category, default_descriptions)
    
    # 从模板中随机选择一个并格式化
    import random
    description = random.choice(templates).format(title=title)
    
    # 添加一个通用的结尾句
    endings = [
        " Perfect for anime fans of all ages!",
        " A must-play for anime enthusiasts!",
        " Dive into this captivating anime experience today!"
    ]
    
    return description + random.choice(endings)

def import_games_from_desktop():
    """导入桌面游戏到AnimeGamesHub项目"""
    if not os.path.exists(DESKTOP_GAMES_PATH):
        print(f"错误：桌面游戏路径不存在: {DESKTOP_GAMES_PATH}")
        return []
    
    imported_games = []
    game_folders = [f for f in os.listdir(DESKTOP_GAMES_PATH) 
                    if os.path.isdir(os.path.join(DESKTOP_GAMES_PATH, f))]
    
    for folder in game_folders:
        folder_path = os.path.join(DESKTOP_GAMES_PATH, folder)
        
        # 查找游戏标题文件
        title_file_path = os.path.join(folder_path, "game_title.txt")
        if not os.path.exists(title_file_path):
            print(f"跳过 {folder}: 找不到game_title.txt文件")
            continue
        
        with open(title_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # 提取游戏标题和iframe源URL
        game_title = extract_game_title(content)
        iframe_url = extract_iframe_src(content)
        
        if not game_title or not iframe_url:
            print(f"跳过 {folder}: 无法提取游戏标题或iframe源URL")
            continue
        
        # 为游戏生成唯一ID
        game_id = generate_unique_id()
        
        # 查找图片文件
        image_files = [f for f in os.listdir(folder_path) 
                       if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')) 
                       and os.path.isfile(os.path.join(folder_path, f))]
        
        if not image_files:
            print(f"跳过 {folder}: 找不到图片文件")
            continue
        
        # 选择第一张图片作为游戏图片
        source_image = os.path.join(folder_path, image_files[0])
        image_filename = f"{game_id}.jpg"
        target_image = os.path.join(IMAGES_OUTPUT_PATH, image_filename)
        
        # 处理图片
        image_success = process_image(source_image, target_image)
        
        if not image_success:
            # 创建占位图片
            create_placeholder_image(target_image, game_title)
        
        # 创建游戏数据
        game_category = categorize_game(game_title)
        
        # 生成相关的游戏描述
        game_description = generate_game_description(game_title, game_category)
        
        game_data = {
            "id": game_id,
            "title": game_title,
            "category": game_category,
            "image": f"images/games/{image_filename}",
            "featured": random.random() > 0.7,  # 30%的概率成为精选
            "plays": random.randint(100000, 1000000),
            "rating": round(random.uniform(3.0, 5.0), 1),
            "ratingCount": random.randint(100, 5000),
            "description": game_description,
            "iframeUrl": iframe_url
        }
        
        imported_games.append(game_data)
        print(f"成功导入游戏: {game_title}")
    
    # 检查是否已导入游戏
    if not imported_games:
        print("没有成功导入任何游戏")
        return []
    
    # 保存成JavaScript文件
    save_games_as_js(imported_games)
    
    print(f"共导入了 {len(imported_games)} 款游戏")
    return imported_games

def save_games_as_js(games):
    """将游戏数据保存为JavaScript文件"""
    js_content = f"""/**
 * 从桌面导入的游戏数据
 * 自动生成 - 请勿手动修改
 * 游戏数量: {len(games)}
 * 生成时间: {os.popen('date').read().strip()}
 */

const desktopGames = {json.dumps(games, indent=4, ensure_ascii=False)};

// 导出桌面游戏数据供其他脚本使用
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = desktopGames;
}} else {{
    // 在浏览器环境中使用
    window.desktopGames = desktopGames;
}}
"""
    
    with open(GAMES_DATA_PATH, 'w', encoding='utf-8') as file:
        file.write(js_content)
    
    print(f"成功保存游戏数据到: {GAMES_DATA_PATH}")

if __name__ == "__main__":
    import_games_from_desktop()
