#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import random
import requests
import shutil
import uuid
from jinja2 import Template
from PIL import Image, ImageDraw, ImageFont
import re
from io import BytesIO
from concurrent.futures import ThreadPoolExecutor

# Configuration
OUTPUT_DIR = "output"
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")
USER_PROVIDED_IMAGES_DIR = os.path.join(OUTPUT_DIR, "user_provided_images")
DATA_FILE = os.path.join(OUTPUT_DIR, "games_data.json")
HTML_OUTPUT = os.path.join(OUTPUT_DIR, "index.html")

# Mapping for user-provided images (game ID -> image filename)
USER_PROVIDED_IMAGES = {
    "2d08408fcb514a24a48f5712dfd2e1d4": "anigirls_wonderful_clicker.jpg",
    "849b591bf5f7413b8a4ca43fc378e40c": "ninja_dash.jpg",
    # Add more mappings as needed
}

# Known anime game IDs and information
ANIME_GAMES = [
    {
        "id": "849b591bf5f7413b8a4ca43fc378e40c",
        "title": "Anime Fantasy RPG",
        "category": "rpg",
        "description": "Explore a fantasy world and experience wonderful anime character adventures. Make friends, defeat powerful enemies, and save the world!",
        "tags": ["RPG", "Fantasy", "Adventure"]
    },
    {
        "id": "5b0abd4f0faa4f5eb190a9a16d5a1b4c",
        "title": "Kawaii Dress Up",
        "category": "romance",
        "description": "Dress up cute anime characters, select beautiful outfits, hairstyles, and accessories. Create your own fashion style!",
        "tags": ["Fashion", "Cute", "Dress Up"]
    },
    {
        "id": "c84aa267dd0d4c7c8ef5c16c600a3adb",
        "title": "Magical School",
        "category": "rpg",
        "description": "Enter a magic school, learn spells, make new friends, and solve school mysteries. Become the greatest wizard!",
        "tags": ["Magic", "School", "Adventure"]
    },
    {
        "id": "f804d079d0984f88a0e3c4f6e9956fd3",
        "title": "Anime Tower Defense",
        "category": "tower-defense",
        "description": "Use various anime characters as defense towers to prevent enemy invasions. Upgrade your characters and unlock special abilities!",
        "tags": ["Tower Defense", "Strategy", "Action"]
    },
    {
        "id": "4b6f97415000460a909ddbf2ad13895c",
        "title": "Pixel Ninja",
        "category": "adventure",
        "description": "Control a pixel-style ninja character, navigate obstacles, collect treasures, and defeat enemies. Experience an exciting ninja adventure!",
        "tags": ["Pixel Art", "Ninja", "Action"]
    },
    {
        "id": "1c51a5f1d07848b7a2a7abea9bb348e9",
        "title": "Anime Racing Stars",
        "category": "racing",
        "description": "Race with popular anime characters on exciting tracks, collect power-ups, and use special abilities to win races!",
        "tags": ["Racing", "Sports", "Multiplayer"]
    },
    {
        "id": "8cbfbb3925e84c35a6f7a4fab3d9946c",
        "title": "Anime Puzzle Challenge",
        "category": "puzzle",
        "description": "Solve challenging puzzles with anime themes, unlock new levels, and test your logic skills!",
        "tags": ["Puzzle", "Brain Games", "Strategy"]
    },
    {
        "id": "e14d3b2ff8f54b48a2f72e9951372965",
        "title": "Chibi Combat",
        "category": "fighting",
        "description": "Battle with cute chibi anime characters, master combos, and become the ultimate fighter in this adorable combat game!",
        "tags": ["Fighting", "Action", "Multiplayer"]
    },
    {
        "id": "5569bd8e16c548ce9241a4d3a29e1cf5",
        "title": "Anime Idle Heroes",
        "category": "idle",
        "description": "Collect and upgrade anime heroes that continue fighting even when you're away. Return to collect rewards and advance!",
        "tags": ["Idle", "Collection", "RPG"]
    },
    {
        "id": "25062a9a11dc4eaebc0b484271bfa9b3",
        "title": "Manga Creator",
        "category": "simulation",
        "description": "Create your own manga stories, design characters, draw scenes, and add dialogue. Share your creations and gain fans!",
        "tags": ["Creative", "Drawing", "Simulation"]
    },
    {
        "id": "2cf9b70bdef24d6db17d08f9f64c98c7",
        "title": "Anime Battle Arena",
        "category": "battle",
        "description": "Compete in an epic battle arena with your favorite anime-inspired characters. Master unique abilities and dominate the battlefield!",
        "tags": ["Battle", "Arena", "Multiplayer"]
    },
    {
        "id": "7e3d4f2a8bc54612a9f8e753b28e5a0c",
        "title": "Neko Adventure",
        "category": "adventure",
        "description": "Join a cute cat-girl on her adventure through a magical world. Solve puzzles, defeat enemies, and collect rare items!",
        "tags": ["Adventure", "Platformer", "Cute"]
    },
    {
        "id": "6d5e4f3c2b1a4987c6d5e4f3c2b1a987",
        "title": "Samurai Slash",
        "category": "action",
        "description": "Become a skilled samurai and slash through waves of enemies. Perfect your technique and become a legendary warrior!",
        "tags": ["Action", "Samurai", "Combat"]
    },
    {
        "id": "3b2a1c7d9e8f4506b15d2e8c7a9f6b0d",
        "title": "Mecha Warriors",
        "category": "strategy",
        "description": "Command powerful anime-style mechs in strategic turn-based combat. Upgrade your mechs and defeat enemy forces!",
        "tags": ["Mecha", "Strategy", "Turn-based"]
    },
    {
        "id": "eeefb95abbc04b3fbae8c84cc6b5ae12",
        "title": "Fantasy School Life",
        "category": "simulation",
        "description": "Experience life as a student in a fantasy anime school. Study magic, make friends, join clubs, and maybe even find romance!",
        "tags": ["School", "Simulation", "Romance"]
    },
    {
        "id": "33c4942945a2451189610f4effdda4eb",
        "title": "Kings and Queens Match 2",
        "category": "puzzle",
        "description": "Join the royal adventure in this match-3 puzzle game featuring cute anime-style princesses and princes. Match gems, use power-ups, and complete challenging levels in a magical kingdom!",
        "tags": ["Puzzle", "Match-3", "Royal"]
    },
    {
        "id": "60e9d5d6300b41778dfdfd4ec86d32cb",
        "title": "Lady Pool",
        "category": "sports",
        "description": "Enjoy a stylish pool game featuring anime-styled characters. Show off your skills in various game modes, challenge friends, and become the ultimate Lady Pool champion!",
        "tags": ["Sports", "Pool", "Billiards", "Anime"]
    },
    {
        "id": "096146cf258d4000a0ac904766059294",
        "title": "Ninja dash Cozy tactic puzzle",
        "category": "puzzle",
        "description": "A relaxing yet challenging puzzle game featuring ninja characters. Use tactics and strategy to solve puzzles, dash through obstacles, and complete missions in this cozy ninja adventure!",
        "tags": ["Puzzle", "Ninja", "Tactics", "Cozy"]
    }
]

# User-Agent list to rotate and avoid being blocked
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0"
]

def get_random_user_agent():
    """Return a random User-Agent"""
    return random.choice(USER_AGENTS)

def download_game_image(game):
    """Download game image from URL"""
    try:
        image_url = f"https://img.gamedistribution.com/{game['id']}.jpg"
        response = requests.get(image_url, headers=get_headers())
        if response.status_code == 200:
            return response.content
        else:
            print(f"Unable to download image: {image_url}, status code: {response.status_code}")
            # Create placeholder image
            return create_placeholder_image(game['title'])
    except Exception as e:
        print(f"Error downloading image: {e}")
        return create_placeholder_image(game['title'])

def create_placeholder_image(title):
    """Create a placeholder image when download fails"""
    try:
        placeholder_path = os.path.join(OUTPUT_DIR, 'images', 'placeholder.jpg')
        if os.path.exists(placeholder_path):
            return placeholder_path
        
        # Create a new image
        width, height = 640, 480
        img = Image.new('RGB', (width, height), color=(18, 18, 18))
        
        # Add text
        d = ImageDraw.Draw(img)
        d.text((width//2-100, height//2-10), f"Anime Game: {title}", fill=(66, 211, 255), font=ImageFont.load_default())
        img.save(placeholder_path)
        
        return placeholder_path
    except:
        return None

def get_headers():
    """Return headers for HTTP requests"""
    return {
        "User-Agent": get_random_user_agent(),
        "Referer": "https://gamedistribution.com/"
    }

def process_game(game):
    """Process a single game entry"""
    print(f"Processing game: {game['title']}")
    
    # Ensure all required fields exist
    if 'category' not in game:
        game['category'] = 'anime' # Default category
    if 'tags' not in game:
        game['tags'] = ['anime', 'game']
    if 'plays' not in game:
        game['plays'] = random.randint(100, 10000)
    if 'rating' not in game:
        game['rating'] = round(random.uniform(3.0, 5.0), 1)
    if 'description' not in game or not game['description']:
        game['description'] = f"Play {game['title']} online for free. Enjoy this amazing anime game!"
    
    # Generate unique ID if not exists
    if 'id' not in game:
        game['id'] = generate_unique_id()
    
    # Validate iframe source
    if 'iframe_src' not in game or not game['iframe_src']:
        print(f"Warning: No iframe_src for {game['title']}")
        game['iframe_src'] = "about:blank"  # Default fallback
    
    # Process image
    if 'user_provided_image' in game and game['user_provided_image']:
        # Use user provided image
        process_user_provided_image(game)
    elif 'image' in game and game['image']:
        # Download image from URL
        process_image_from_url(game)
    else:
        # Create a placeholder image
        create_placeholder_image(game)
    
    return game

def generate_html(games_data):
    """Generate HTML page"""
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, 'games'), exist_ok=True)
    
    # Index HTML template
    index_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anime Games Hub | Anime Games Center</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Zen+Maru+Gothic:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary-color: #42D3FF;
                --accent-color: #FF42B0;
                --background-color: #0a0a12;
                --card-background: rgba(25, 25, 35, 0.7);
                --text-color: #E0E0E0;
                --button-gradient: linear-gradient(to right, #42D3FF, #3ba8cc);
            }
            
            body {
                font-family: 'Zen Maru Gothic', sans-serif;
                background-color: var(--background-color);
                color: var(--text-color);
                margin: 0;
                padding: 0;
                line-height: 1.6;
                background-image: linear-gradient(to bottom, #0a0a18, #141428);
            }
            
            /* Container styles */
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }
            
            /* Header navigation styles */
            header {
                background-color: rgba(10, 10, 25, 0.9);
                padding: 15px 0;
                border-bottom: 1px solid var(--primary-color);
                box-shadow: 0 0 15px rgba(66, 211, 255, 0.3);
                position: sticky;
                top: 0;
                z-index: 100;
                backdrop-filter: blur(10px);
            }
            
            header .container {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .logo {
                display: flex;
                flex-direction: column;
            }
            
            .logo-text {
                font-family: 'Press Start 2P', cursive;
                color: var(--primary-color);
                font-size: 1.5rem;
                text-shadow: 0 0 10px rgba(66, 211, 255, 0.5);
                animation: glow 2s ease-in-out infinite alternate;
            }
            
            .logo-tagline {
                color: var(--accent-color);
                font-size: 0.8rem;
                margin-top: 5px;
            }
            
            nav {
                display: flex;
                gap: 20px;
            }
            
            nav a {
                color: var(--text-color);
                text-decoration: none;
                padding: 5px 10px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            nav a:hover, nav a.active {
                background-color: rgba(66, 211, 255, 0.2);
                color: var(--primary-color);
            }
            
            /* Main content styles */
            main {
                padding: 40px 0;
            }
            
            .hero {
                text-align: center;
                margin-bottom: 60px;
                padding: 40px 0;
            }
            
            .hero h1 {
                font-size: 2.5rem;
                margin-bottom: 20px;
                color: var(--text-color);
            }
            
            .hero .highlight {
                color: var(--primary-color);
                text-shadow: 0 0 10px rgba(66, 211, 255, 0.5);
            }
            
            .hero p {
                font-size: 1.2rem;
                margin-bottom: 30px;
                color: rgba(224, 224, 224, 0.8);
            }
            
            .search-bar {
                max-width: 600px;
                margin: 0 auto;
                display: flex;
                overflow: hidden;
                border-radius: 50px;
                border: 1px solid rgba(66, 211, 255, 0.3);
                background-color: rgba(25, 25, 35, 0.5);
                backdrop-filter: blur(5px);
            }
            
            .search-bar input {
                flex: 1;
                padding: 15px 20px;
                border: none;
                background: transparent;
                color: var(--text-color);
                font-size: 1rem;
                outline: none;
            }
            
            .search-bar button {
                padding: 15px 30px;
                border: none;
                background: linear-gradient(to right, var(--primary-color), #3ba8cc);
                color: #111;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .search-bar button:hover {
                background: linear-gradient(to right, #3ba8cc, var(--primary-color));
            }
            
            /* Game grid styles */
            .games-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 30px;
            }
            
            .game-card {
                background-color: var(--card-background);
                border-radius: 10px;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 1px solid rgba(66, 211, 255, 0.2);
                height: 100%;
                display: flex;
                flex-direction: column;
                backdrop-filter: blur(10px);
                cursor: pointer;
            }
            
            .game-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 10px 30px rgba(66, 211, 255, 0.2);
            }
            
            .game-image {
                position: relative;
                height: 200px;
                overflow: hidden;
            }
            
            .game-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.5s ease;
            }
            
            .game-card:hover .game-image img {
                transform: scale(1.05);
            }
            
            .game-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .game-card:hover .game-overlay {
                opacity: 1;
            }
            
            .play-button {
                padding: 10px 25px;
                background: linear-gradient(to right, var(--primary-color), var(--accent-color));
                color: #fff;
                border: none;
                border-radius: 50px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
            }
            
            .play-button:hover {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(66, 211, 255, 0.5);
            }
            
            .game-info {
                padding: 20px;
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            
            .game-info h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: var(--primary-color);
                font-size: 1.3rem;
                text-shadow: 0 0 5px rgba(66, 211, 255, 0.3);
            }
            
            .game-info p {
                margin-bottom: 20px;
                color: rgba(224, 224, 224, 0.8);
                flex: 1;
            }
            
            .game-meta {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                color: rgba(224, 224, 224, 0.7);
                font-size: 0.9rem;
            }
            
            .players-count, .rating {
                display: flex;
                align-items: center;
            }
            
            .icon {
                margin-right: 5px;
                font-style: normal;
            }
            
            .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .tags span {
                background: rgba(66, 211, 255, 0.1);
                color: var(--primary-color);
                padding: 3px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                transition: background 0.3s ease;
            }
            
            .tags span:hover {
                background: rgba(66, 211, 255, 0.2);
            }
            
            /* Footer styles */
            footer {
                background-color: rgba(10, 10, 25, 0.9);
                padding: 30px 0;
                text-align: center;
                border-top: 1px solid var(--primary-color);
                margin-top: 60px;
            }
            
            footer p {
                color: rgba(224, 224, 224, 0.6);
                font-size: 0.9rem;
            }
            
            /* Animation effects */
            @keyframes glow {
                from {
                    text-shadow: 0 0 5px rgba(66, 211, 255, 0.5),
                                0 0 10px rgba(66, 211, 255, 0.3);
                }
                to {
                    text-shadow: 0 0 10px rgba(66, 211, 255, 0.7),
                                0 0 20px rgba(66, 211, 255, 0.5),
                                0 0 30px rgba(66, 211, 255, 0.3);
                }
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .games-grid {
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                }
                
                .logo-text {
                    font-size: 1.2rem;
                }
                
                nav {
                    gap: 10px;
                }
                
                .hero h1 {
                    font-size: 2rem;
                }
            }
            
            @media (max-width: 576px) {
                header .container {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .game-controls {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .control-btn {
                    width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <div class="logo">
                    <div class="logo-text">Anime Games Hub</div>
                    <div class="logo-tagline">Anime Games Center</div>
                </div>
                <nav>
                    <a href="#" class="active">Home</a>
                    <a href="#">Categories</a>
                    <a href="#">Popular</a>
                    <a href="#">New Games</a>
                </nav>
            </div>
        </header>
        
        <main>
            <div class="container">
                <section class="hero">
                    <h1>Explore the Amazing <span class="highlight">Anime Games</span> World</h1>
                    <p>Play various anime style games directly in your browser, no download required!</p>
                    <div class="search-bar">
                        <input type="text" placeholder="Search for games...">
                        <button>Search</button>
                    </div>
                </section>
                
                <section class="games-grid">
                    {% for game in games %}
                    <div class="game-card">
                        <div class="game-image">
                            <img src="{{ game.local_image }}" alt="{{ game.title }}">
                            <div class="game-overlay">
                                <a href="games/{{ game.id }}.html" class="play-button">Play Now</a>
                            </div>
                        </div>
                        <div class="game-info">
                            <h3>{{ game.title }}</h3>
                            <p>{{ game.description[:100] }}{% if game.description|length > 100 %}...{% endif %}</p>
                            <div class="game-meta">
                                <div class="players-count">
                                    <i class="icon">👤</i> {{ game.plays }}
                                </div>
                                <div class="rating">
                                    <i class="icon">⭐</i> {{ game.rating }}
                                </div>
                            </div>
                            <div class="tags">
                                {% for tag in game.tags[:3] %}
                                <span>{{ tag }}</span>
                                {% endfor %}
                            </div>
                        </div>
                    </div>
                    {% endfor %}
                </section>
            </div>
        </main>
        
        <footer>
            <div class="container">
                <p>&copy; 2025 Anime Games Hub | Anime Games Center</p>
            </div>
        </footer>
        
        <script>
            // Search functionality
            document.querySelector('.search-bar button').addEventListener('click', () => {
                const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
                const gameCards = document.querySelectorAll('.game-card');
                
                gameCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('p').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
            
            // Add click effect for game cards
            const gameCards = document.querySelectorAll('.game-card');
            gameCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    // If not clicking the play button, navigate to game page
                    if (!e.target.classList.contains('play-button')) {
                        const gameLink = card.querySelector('.play-button').getAttribute('href');
                        window.location.href = gameLink;
                    }
                });
            });
        </script>
    </body>
    </html>
    """
    
    # Game detail page template
    game_detail_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ game.title }} | Anime Games Hub</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Zen+Maru+Gothic:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary-color: #42D3FF;
                --accent-color: #FF42B0;
                --background-color: #0a0a12;
                --card-background: rgba(25, 25, 35, 0.7);
                --text-color: #E0E0E0;
                --button-gradient: linear-gradient(to right, #42D3FF, #3ba8cc);
            }
            
            body {
                font-family: 'Zen Maru Gothic', sans-serif;
                background-color: var(--background-color);
                color: var(--text-color);
                margin: 0;
                padding: 0;
                line-height: 1.6;
                background-image: linear-gradient(to bottom, #0a0a18, #141428);
                min-height: 100vh;
            }
            
            /* Container styles */
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }
            
            /* Header navigation styles */
            header {
                background-color: rgba(10, 10, 25, 0.9);
                padding: 15px 0;
                border-bottom: 1px solid var(--primary-color);
                box-shadow: 0 0 15px rgba(66, 211, 255, 0.3);
                position: sticky;
                top: 0;
                z-index: 100;
                backdrop-filter: blur(10px);
            }
            
            header .container {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .logo {
                display: flex;
                flex-direction: column;
            }
            
            .logo-text {
                font-family: 'Press Start 2P', cursive;
                color: var(--primary-color);
                font-size: 1.5rem;
                text-shadow: 0 0 10px rgba(66, 211, 255, 0.5);
                animation: glow 2s ease-in-out infinite alternate;
            }
            
            .logo-tagline {
                color: var(--accent-color);
                font-size: 0.8rem;
                margin-top: 5px;
            }
            
            nav {
                display: flex;
                gap: 20px;
            }
            
            nav a {
                color: var(--text-color);
                text-decoration: none;
                padding: 5px 10px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            nav a:hover, nav a.active {
                background-color: rgba(66, 211, 255, 0.2);
                color: var(--primary-color);
            }
            
            /* Main content styles */
            main {
                padding: 40px 0;
            }
            
            .back-button {
                margin-bottom: 30px;
            }
            
            .back-button a {
                color: var(--primary-color);
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                transition: all 0.3s ease;
            }
            
            .back-button a:hover {
                color: var(--accent-color);
                transform: translateX(-5px);
            }
            
            .game-detail {
                background-color: var(--card-background);
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(66, 211, 255, 0.2);
                backdrop-filter: blur(10px);
            }
            
            .game-header {
                margin-bottom: 30px;
            }
            
            .game-header h1 {
                font-size: 2rem;
                color: var(--primary-color);
                margin-top: 0;
                margin-bottom: 15px;
                text-shadow: 0 0 10px rgba(66, 211, 255, 0.3);
            }
            
            .game-meta {
                display: flex;
                gap: 20px;
                margin-bottom: 15px;
            }
            
            .players-count, .rating {
                display: flex;
                align-items: center;
                color: rgba(224, 224, 224, 0.8);
                font-size: 0.9rem;
            }
            
            .icon {
                margin-right: 5px;
                font-style: normal;
            }
            
            .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .tags span {
                background: rgba(66, 211, 255, 0.1);
                color: var(--primary-color);
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            
            .tags span:hover {
                background: rgba(66, 211, 255, 0.2);
            }
            
            .game-description {
                margin-bottom: 30px;
                line-height: 1.8;
                color: rgba(224, 224, 224, 0.9);
            }
            
            .game-controls {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .control-btn {
                padding: 10px 20px;
                background: linear-gradient(to right, var(--primary-color), #3ba8cc);
                color: #111;
                border: none;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .control-btn:hover {
                background: linear-gradient(to right, #3ba8cc, var(--primary-color));
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(66, 211, 255, 0.3);
            }
            
            .game-container {
                border-radius: 10px;
                overflow: hidden;
                background-color: #000;
                height: 0;
                padding-bottom: 56.25%; /* 16:9 aspect ratio */
                position: relative;
            }
            
            #gameFrame {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            #gameIframe {
                width: 100%;
                height: 100%;
                border: none;
            }
            
            /* Footer styles */
            footer {
                background-color: rgba(10, 10, 25, 0.9);
                padding: 30px 0;
                text-align: center;
                border-top: 1px solid var(--primary-color);
                margin-top: 60px;
            }
            
            footer p {
                color: rgba(224, 224, 224, 0.6);
                font-size: 0.9rem;
            }
            
            /* Animation effects */
            @keyframes glow {
                from {
                    text-shadow: 0 0 5px rgba(66, 211, 255, 0.5),
                                0 0 10px rgba(66, 211, 255, 0.3);
                }
                to {
                    text-shadow: 0 0 10px rgba(66, 211, 255, 0.7),
                                0 0 20px rgba(66, 211, 255, 0.5),
                                0 0 30px rgba(66, 211, 255, 0.3);
                }
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .game-header h1 {
                    font-size: 1.7rem;
                }
                
                .logo-text {
                    font-size: 1.2rem;
                }
                
                nav {
                    gap: 10px;
                }
                
                .game-detail {
                    padding: 20px;
                }
            }
            
            @media (max-width: 576px) {
                header .container {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .game-controls {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .control-btn {
                    width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <div class="logo">
                    <div class="logo-text">Anime Games Hub</div>
                    <div class="logo-tagline">Anime Games Center</div>
                </div>
                <nav>
                    <a href="../index.html">Home</a>
                    <a href="#">Categories</a>
                    <a href="#">Popular</a>
                    <a href="#">New Games</a>
                </nav>
            </div>
        </header>
        
        <main>
            <div class="container">
                <div class="back-button">
                    <a href="../index.html">← Back to Game List</a>
                </div>
                
                <section class="game-detail">
                    <div class="game-header">
                        <div class="game-info">
                            <h1>{{ game.title }}</h1>
                            <div class="game-meta">
                                <div class="players-count">
                                    <i class="icon">👤</i> {{ game.plays }} players
                                </div>
                                <div class="rating">
                                    <i class="icon">⭐</i> {{ game.rating }}
                                </div>
                            </div>
                            <div class="tags">
                                {% for tag in game.tags %}
                                <span>{{ tag }}</span>
                                {% endfor %}
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-description">
                        <p>{{ game.description }}</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="fullscreenBtn" class="control-btn">Fullscreen</button>
                        <button id="reloadBtn" class="control-btn">Reload</button>
                    </div>
                    
                    <div class="game-container">
                        <div id="loadingMessage" class="game-loading">Loading game...</div>
                        <div id="fallbackMessage" class="game-fallback" style="display: none;">
                            <h2>{{ game.title }} IS NOT AVAILABLE HERE</h2>
                            <p>IF YOU WANT TO PLAY {{ game.title }}, CLICK HERE TO PLAY:</p>
                            <img src="../{{ game.local_image }}" alt="{{ game.title }}" style="max-width: 200px; margin: 20px auto; display: block;">
                            <a href="{{ game.iframe_src }}" target="_blank" class="play-direct-btn">PLAY</a>
                        </div>
                        <iframe id="gameIframe" src="{{ game.iframe_src }}" frameborder="0" scrolling="no" allowfullscreen></iframe>
                    </div>
                </section>
            </div>
        </main>
        
        <footer>
            <div class="container">
                <p>&copy; 2025 Anime Games Hub | Anime Games Center</p>
            </div>
        </footer>
        
        <script>
            // Load game directly to avoid 403 errors
            window.onload = function() {
                // Game is already loaded in the iframe
                // No need for additional loadGameFrame function call
            };
            
            // Fullscreen functionality
            document.getElementById('fullscreenBtn').addEventListener('click', function() {
                const gameIframe = document.getElementById('gameIframe');
                if (gameIframe.requestFullscreen) {
                    gameIframe.requestFullscreen();
                } else if (gameIframe.webkitRequestFullscreen) { /* Safari */
                    gameIframe.webkitRequestFullscreen();
                } else if (gameIframe.msRequestFullscreen) { /* IE11 */
                    gameIframe.msRequestFullscreen();
                }
            });
            
            // Reload functionality
            document.getElementById('reloadBtn').addEventListener('click', function() {
                const gameIframe = document.getElementById('gameIframe');
                gameIframe.src = gameIframe.src;
            });
        </script>
    </body>
    </html>
    """
    
    # Render index page
    template = Template(index_template)
    html_content = template.render(games=games_data)
    
    # Write to index.html
    with open(os.path.join(OUTPUT_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"HTML page generated: {os.path.join(OUTPUT_DIR, 'index.html')}")
    
    # Generate detail pages for each game
    game_detail_tmpl = Template(game_detail_template)
    success_count = 0
    
    for game in games_data:
        game_html = game_detail_tmpl.render(game=game)
        game_file_path = os.path.join(OUTPUT_DIR, 'games', f"{game['id']}.html")
        
        with open(game_file_path, 'w', encoding='utf-8') as f:
            f.write(game_html)
        success_count += 1
    
    print(f"Successfully generated detail pages for {success_count} games")
    
    # Generate individual game detail pages
    # generate_detail_pages(games_data)

def import_games_from_desktop():
    """Import games from desktop folders and process them"""
    print("Importing games from desktop folders...")
    
    desktop_folder = "/Users/athena/Desktop/anime"
    if not os.path.exists(desktop_folder):
        print(f"Desktop folder {desktop_folder} not found!")
        return []
    
    imported_games = []
    
    for game_folder in os.listdir(desktop_folder):
        folder_path = os.path.join(desktop_folder, game_folder)
        
        if not os.path.isdir(folder_path):
            continue
            
        try:
            txt_file = None
            for file in os.listdir(folder_path):
                if file.endswith(".txt"):
                    txt_file = os.path.join(folder_path, file)
                    break
            
            if not txt_file:
                print(f"Skipping {game_folder} - no text file found")
                continue
                
            with open(txt_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            iframe_match = re.search(r'<iframe[^>]*src=[\'"]([^\'"]+)[\'"]', content, re.IGNORECASE)
            if not iframe_match:
                print(f"Skipping {game_folder} - cannot extract iframe source")
                continue
                
            iframe_src = iframe_match.group(1)
            
            image_path = None
            for file in os.listdir(folder_path):
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    image_path = os.path.join(folder_path, file)
                    break
            
            title = game_folder.replace('_', ' ')
            if title.endswith("_images"):
                title = title[:-7]  # Remove "_images" suffix
                
            game = {
                'id': generate_unique_id(),
                'title': title,
                'description': f"Enjoy playing {title} online for free! This anime-style game provides an immersive experience with beautiful graphics and engaging gameplay.",
                'tags': ['anime', 'online', 'free'],
                'iframe_src': iframe_src,
                'plays': random.randint(1000, 10000),
                'rating': round(random.uniform(3.5, 5.0), 1)
            }
            
            if image_path:
                game['user_provided_image'] = image_path
            
            imported_games.append(game)
            print(f"Successfully imported: {title}")
            
        except Exception as e:
            print(f"Error importing {game_folder}: {e}")
    
    print(f"Imported {len(imported_games)} games from desktop folders")
    return imported_games

def process_game_data(games_data):
    """Process game data and generate HTML page"""
    print("Starting to process anime game data...")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, 'games'), exist_ok=True)
    
    processed_games = []
    for game in games_data:
        processed_game = process_game(game)
        processed_games.append(processed_game)
    
    print(f"Total games: {len(processed_games)}")
    
    with open(os.path.join(OUTPUT_DIR, 'games_data.json'), 'w', encoding='utf-8') as f:
        json.dump(processed_games, f, ensure_ascii=False, indent=4)
    
    return processed_games

def generate_unique_id():
    """Generate a unique ID"""
    import uuid
    return str(uuid.uuid4())

def generate_detail_pages(games):
    """Generate individual detail page for each game"""
    games_dir = os.path.join(OUTPUT_DIR, 'games')
    os.makedirs(games_dir, exist_ok=True)
    
    detail_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ game.title }} | Anime Games Hub</title>
        <link rel="icon" href="../favicon.ico" type="image/x-icon">
        <style>
            :root {
                --primary: #42D3FF;
                --secondary: #FF42B0;
                --bg-dark: #121212;
                --bg-light: #1E1E1E;
                --text: #FFFFFF;
                --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: var(--bg-dark);
                color: var(--text);
                line-height: 1.6;
            }
            
            header {
                background-color: var(--bg-light);
                padding: 1rem 0;
                box-shadow: var(--shadow);
                position: relative;
                z-index: 100;
            }
            
            .container {
                width: 100%;
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1rem;
            }
            
            header .container {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .logo {
                font-size: 1.8rem;
                font-weight: bold;
                background: linear-gradient(to right, var(--primary), var(--secondary));
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 10px rgba(66, 211, 255, 0.7);
            }
            
            .logo-text {
                font-size: 0.9rem;
                color: var(--text);
                opacity: 0.8;
            }
            
            nav ul {
                display: flex;
                list-style: none;
                gap: 1.5rem;
            }
            
            nav a {
                color: var(--text);
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s;
            }
            
            nav a:hover {
                color: var(--primary);
            }
            
            main {
                padding: 2rem 0;
            }
            
            .game-container {
                background-color: var(--bg-light);
                border-radius: 8px;
                overflow: hidden;
                box-shadow: var(--shadow);
                margin-bottom: 2rem;
            }
            
            .game-info {
                padding: 1.5rem;
            }
            
            .game-title {
                font-size: 2rem;
                margin-bottom: 1rem;
                color: var(--primary);
            }
            
            .game-description {
                margin-bottom: 1.5rem;
                font-size: 1.1rem;
            }
            
            .game-stats {
                display: flex;
                gap: 2rem;
                margin-bottom: 1.5rem;
                color: rgba(255, 255, 255, 0.8);
            }
            
            .game-stat {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .game-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }
            
            .tag {
                background-color: rgba(66, 211, 255, 0.2);
                color: var(--primary);
                padding: 0.3rem 0.8rem;
                border-radius: 50px;
                font-size: 0.9rem;
            }
            
            .game-frame-container {
                width: 100%;
                height: 600px;
                position: relative;
                background-color: black;
                margin-bottom: 1rem;
            }
            
            #gameFrame {
                width: 100%;
                height: 100%;
                border: none;
            }
            
            .game-controls {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .control-btn {
                background-color: var(--primary);
                color: black;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                transition: background-color 0.3s;
            }
            
            .control-btn:hover {
                background-color: #2cb5e0;
            }
            
            footer {
                background-color: var(--bg-light);
                padding: 1.5rem 0;
                text-align: center;
                margin-top: 2rem;
            }
            
            footer p {
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.9rem;
            }
            
            /* Animation effects */
            @keyframes glow {
                from {
                    text-shadow: 0 0 5px rgba(66, 211, 255, 0.5),
                                0 0 10px rgba(66, 211, 255, 0.3);
                }
                to {
                    text-shadow: 0 0 10px rgba(66, 211, 255, 0.7),
                                0 0 20px rgba(66, 211, 255, 0.5),
                                0 0 30px rgba(66, 211, 255, 0.3);
                }
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .game-frame-container {
                    height: 400px;
                }
            }
            
            @media (max-width: 576px) {
                header .container {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .game-controls {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .control-btn {
                    width: 100%;
                }
            }
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <div>
                    <h1 class="logo">Anime Games Hub</h1>
                    <p class="logo-text">Anime Games Center</p>
                </div>
                <nav>
                    <ul>
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="#">Categories</a></li>
                        <li><a href="#">Popular</a></li>
                        <li><a href="#">New Games</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        
        <main>
            <div class="container">
                <div class="back-button">
                    <a href="../index.html">← Back to Games</a>
                </div>
                
                <section class="game-detail">
                    <div class="game-header">
                        <div class="game-info">
                            <h1>{{ game.title }}</h1>
                            <div class="game-meta">
                                <div class="players-count">
                                    <i class="icon">👤</i> {{ game.plays }} players
                                </div>
                                <div class="rating">
                                    <i class="icon">⭐</i> {{ game.rating }}
                                </div>
                            </div>
                            <div class="tags">
                                {% for tag in game.tags %}
                                <span>{{ tag }}</span>
                                {% endfor %}
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-description">
                        <p>{{ game.description }}</p>
                    </div>
                    
                    <div class="game-controls">
                        <button id="fullscreenBtn" class="control-btn">Fullscreen</button>
                        <button id="reloadBtn" class="control-btn">Reload</button>
                    </div>
                    
                    <div class="game-container">
                        <div id="loadingMessage" class="game-loading">Loading game...</div>
                        <div id="fallbackMessage" class="game-fallback" style="display: none;">
                            <h2>{{ game.title }} IS NOT AVAILABLE HERE</h2>
                            <p>IF YOU WANT TO PLAY {{ game.title }}, CLICK HERE TO PLAY:</p>
                            <img src="../{{ game.local_image }}" alt="{{ game.title }}" style="max-width: 200px; margin: 20px auto; display: block;">
                            <a href="{{ game.iframe_src }}" target="_blank" class="play-direct-btn">PLAY</a>
                        </div>
                        <iframe id="gameFrame" src="{{ game.iframe_src }}" frameborder="0" scrolling="no" allowfullscreen></iframe>
                    </div>
                </section>
            </div>
        </main>
        
        <footer>
            <div class="container">
                <p>&copy; 2025 Anime Games Hub | Anime Games Center</p>
            </div>
        </footer>
        
        <script>
            // Wait for the iframe to load
            window.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                    checkIframeLoading();
                }, 3000); // Allow 3 seconds for iframe to load
            });
            
            function checkIframeLoading() {
                const gameFrame = document.getElementById('gameFrame');
                const loadingMessage = document.getElementById('loadingMessage');
                const fallbackMessage = document.getElementById('fallbackMessage');
                
                try {
                    // Try to access the iframe content
                    const iframeDoc = gameFrame.contentDocument || gameFrame.contentWindow.document;
                    
                    // Hide loading message if iframe loaded
                    loadingMessage.style.display = 'none';
                } catch (e) {
                    // If cannot access iframe content due to CORS, assume game is loading
                    console.log("Game iframe might still be loading or has CORS restrictions");
                    
                    // After waiting, check if iframe has a src but is potentially blocked
                    if (gameFrame.getAttribute('src')) {
                        // Hide iframe and loading message
                        gameFrame.style.display = 'none';
                        loadingMessage.style.display = 'none';
                        
                        // Show fallback message with direct link
                        fallbackMessage.style.display = 'block';
                    }
                }
            }
            
            function toggleFullscreen() {
                const gameContainer = document.querySelector('.game-frame-container');
                
                if (!document.fullscreenElement) {
                    if (gameContainer.requestFullscreen) {
                        gameContainer.requestFullscreen();
                    } else if (gameContainer.webkitRequestFullscreen) {
                        gameContainer.webkitRequestFullscreen();
                    } else if (gameContainer.msRequestFullscreen) {
                        gameContainer.msRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
            }
            
            function reloadGame() {
                const gameFrame = document.getElementById('gameFrame');
                const src = gameFrame.src;
                gameFrame.src = '';
                
                setTimeout(function() {
                    gameFrame.src = src;
                }, 100);
                
                // Show loading message again
                document.getElementById('loadingMessage').style.display = 'block';
                document.getElementById('fallbackMessage').style.display = 'none';
                gameFrame.style.display = 'block';
                
                // Check loading status again after a delay
                setTimeout(function() {
                    checkIframeLoading();
                }, 3000);
            }
        </script>
    </body>
    </html>
    """
    
    success_count = 0
    
    for game in games:
        try:
            detail_path = os.path.join(games_dir, f"{game['id']}.html")
            
            template = Template(detail_template)
            html_content = template.render(game=game)
            
            with open(detail_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            success_count += 1
            
        except Exception as e:
            print(f"Error generating detail page for {game['title']}: {e}")
    
    print(f"Successfully generated detail pages for {success_count} games")

def process_user_provided_image(game):
    """Process a user-provided image"""
    try:
        source_path = game['user_provided_image']
        
        dest_dir = os.path.join(OUTPUT_DIR, 'images')
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, f"{game['id']}.jpg")
        
        shutil.copy(source_path, dest_path)
        
        game['local_image'] = f"images/{game['id']}.jpg"
        print(f"Copied user-provided image for {game['title']}")
        
    except Exception as e:
        print(f"Error processing user-provided image for {game['title']}: {e}")
        create_placeholder_image(game)

def process_image_from_url(game):
    """Download and process image from URL"""
    try:
        image_url = game['image']
        
        dest_dir = os.path.join(OUTPUT_DIR, 'images')
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, f"{game['id']}.jpg")
        
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            with open(dest_path, 'wb') as f:
                response.raw.decode_content = True
                shutil.copyfileobj(response.raw, f)
            
            game['local_image'] = f"images/{game['id']}.jpg"
            print(f"Downloaded image for {game['title']}")
        else:
            print(f"Unable to download image: {image_url}, status code: {response.status_code}")
            create_placeholder_image(game)
            
    except Exception as e:
        print(f"Error downloading image for {game['title']}: {e}")
        create_placeholder_image(game)

def create_placeholder_image(game):
    """Create a placeholder image for a game"""
    try:
        dest_dir = os.path.join(OUTPUT_DIR, 'images')
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, f"{game['id']}.jpg")
        
        width, height = 300, 200
        
        img = Image.new('RGB', (width, height), color=(40, 40, 40))
        
        d = ImageDraw.Draw(img)
        d.text((width//2-100, height//2-10), f"Anime Game: {game['title']}", fill=(66, 211, 255), font=ImageFont.load_default())
        img.save(dest_path)
        
        game['local_image'] = f"images/{game['id']}.jpg"
        print(f"Created placeholder image for {game['title']}")
        
    except:
        game['local_image'] = "images/placeholder.jpg"
        
        default_placeholder = os.path.join(OUTPUT_DIR, 'images', 'placeholder.jpg')
        if not os.path.exists(default_placeholder):
            try:
                os.makedirs(os.path.dirname(default_placeholder), exist_ok=True)
                with open(default_placeholder, 'wb') as f:
                    Image.new('RGB', (300, 200), color=(40, 40, 40)).save(f, 'JPEG')
            except:
                print("Failed to create default placeholder image")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, 'games'), exist_ok=True)
    os.makedirs(USER_PROVIDED_IMAGES_DIR, exist_ok=True)
    
    games_data = import_games_from_desktop()
    
    games_data = process_game_data(games_data)
    
    with open(os.path.join(OUTPUT_DIR, 'games_data.json'), 'w', encoding='utf-8') as f:
        json.dump(games_data, f, ensure_ascii=False, indent=4)
    
    generate_html(games_data)
    
    print("Web scraping and HTML generation completed")
    print(f"Output directory: {os.path.abspath(OUTPUT_DIR)}")
