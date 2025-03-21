/**
 * AnimeGamesHub - Main JavaScript File
 * Handles navigation, game loading, and UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const searchContainer = document.querySelector('.search-container');
    const categoriesBtn = document.getElementById('categoriesBtn');
    const categoriesDropdown = document.getElementById('categoriesDropdown');
    const featuredGamesGrid = document.querySelector('.featured-games');
    const newestGamesGrid = document.querySelector('.newest-games');
    const topRatedGamesGrid = document.querySelector('.top-rated-games');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            searchContainer.classList.toggle('active');
        });
    }
    
    // Categories dropdown toggle
    if (categoriesBtn && categoriesDropdown) {
        categoriesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            categoriesDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#categoriesBtn') && !e.target.closest('#categoriesDropdown')) {
                categoriesDropdown.classList.remove('active');
            }
        });
    }
    
    // Load games data if we're on the homepage
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        loadGames();
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                // In a real app, you would send this to your backend
                alert('Thank you for subscribing! You\'ll receive updates on the latest games.');
                emailInput.value = '';
            }
        });
    }
    
    // Game card click event delegation for the entire page
    document.addEventListener('click', function(e) {
        // Find closest game card or play button
        const gameCard = e.target.closest('.game-card');
        const playButton = e.target.closest('.play-button');
        
        if (gameCard || playButton) {
            e.preventDefault();
            const targetCard = gameCard || playButton.closest('.game-card');
            const gameId = targetCard.getAttribute('data-id');
            if (gameId) {
                window.location.href = `game-detail.html?id=${gameId}`;
            }
        }
    });
    
    // Category cards click event
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            window.location.href = `category.html?category=${category}`;
        });
    });
});

/**
 * Load game data from API or mock data
 */
function loadGames() {
    // 检查是否有桌面导入的游戏数据
    if (typeof window.desktopGames !== 'undefined' && window.desktopGames.length > 0) {
        console.log('桌面游戏数据已加载:', window.desktopGames.length);
        
        // 使用桌面导入的游戏数据
        const desktopGameData = {
            featured: window.desktopGames.filter(game => game.featured),
            newest: window.desktopGames.slice(0, 8),  // 取前8个作为最新游戏
            topRated: window.desktopGames.sort((a, b) => b.rating - a.rating).slice(0, 8)  // 评分最高的8个游戏
        };
        
        // 渲染游戏到各自的区域
        renderGames(desktopGameData.featured, '.featured-games');
        renderGames(desktopGameData.newest, '.newest-games');
        renderGames(desktopGameData.topRated, '.top-rated-games');
    } else {
        // 如果没有桌面导入的游戏数据，则使用模拟数据
        const mockGames = {
            featured: generateMockGames(8, true),
            newest: generateMockGames(8),
            topRated: generateMockGames(8, false, true)
        };
        
        // 渲染游戏到各自的区域
        renderGames(mockGames.featured, '.featured-games');
        renderGames(mockGames.newest, '.newest-games');
        renderGames(mockGames.topRated, '.top-rated-games');
    }
}

/**
 * 生成模拟游戏数据，包含GameDistribution的真实游戏链接
 * @param {number} count - 要生成的游戏数量
 * @param {boolean} featured - 是否为精选游戏
 * @param {boolean} topRated - 是否为高评分游戏
 * @returns {Array} 游戏数组
 */
function generateMockGames(count, featured = false, topRated = false) {
    const realAnimeGames = [
        {
            title: "Anime Fantasy RPG",
            category: "rpg",
            image: "images/games/anime-fantasy-rpg.jpg",
            description: "探索奇幻世界，体验奇妙的动漫角色冒险。结交伙伴，战胜强大的敌人，拯救世界！",
            iframeUrl: "https://html5.gamedistribution.com/5b0abd4f0faa4f5eb190a9a16d5a1b4c/"
        },
        {
            title: "Anime Battle Arena",
            category: "action",
            image: "images/games/anime-battle.jpg",
            description: "选择你最喜欢的动漫角色，在竞技场中与其他角色战斗。使用强大的技能和连击赢得胜利！",
            iframeUrl: "https://html5.gamedistribution.com/bf1268dccb5d43e7970bb3edaa64b3cd/"
        },
        {
            title: "Manga Coloring Book",
            category: "casual",
            image: "images/games/manga-coloring.jpg",
            description: "为你喜爱的动漫角色上色，展示你的创意！选择不同的笔刷和颜色，创造独特的作品。",
            iframeUrl: "https://html5.gamedistribution.com/30fb65745ace4ca28dab7ec9103f323d/"
        },
        {
            title: "Chibi Knight",
            category: "adventure",
            image: "images/games/chibi-knight.jpg",
            description: "在这款可爱的冒险游戏中扮演小小骑士，探索神秘的世界并击败怪物。",
            iframeUrl: "https://html5.gamedistribution.com/849b591bf5f7413b8a4ca43fc378e40c/"
        },
        {
            title: "Kawaii Dress Up",
            category: "romance",
            image: "images/games/kawaii-dressup.jpg",
            description: "为可爱的动漫角色装扮，选择漂亮的服装、发型和配饰。创造你自己的时尚风格！",
            iframeUrl: "https://html5.gamedistribution.com/5b0abd4f0faa4f5eb190a9a16d5a1b4c/"
        },
        {
            title: "Magical School",
            category: "rpg",
            image: "images/games/magical-school.jpg",
            description: "进入魔法学校，学习咒语，结交新朋友，解开学校的秘密。成为最伟大的魔法师！",
            iframeUrl: "https://html5.gamedistribution.com/c84aa267dd0d4c7c8ef5c16c600a3adb/"
        },
        {
            title: "Anime Tower Defense",
            category: "tower-defense",
            image: "images/games/anime-tower.jpg",
            description: "使用各种动漫角色作为防御塔，阻止敌人入侵。升级你的角色并解锁特殊能力！",
            iframeUrl: "https://html5.gamedistribution.com/f804d079d0984f88a0e3c4f6e9956fd3/"
        },
        {
            title: "Pixel Ninja",
            category: "adventure",
            image: "images/games/pixel-ninja.jpg",
            description: "控制像素风格的忍者角色，闯过各种障碍，收集宝物，击败敌人。体验刺激的忍者冒险！",
            iframeUrl: "https://html5.gamedistribution.com/4b6f97415000460a909ddbf2ad13895c/"
        },
        {
            title: "Anime Racing Stars",
            category: "racing",
            image: "images/games/anime-racing.jpg",
            description: "选择你喜爱的动漫角色参加疯狂的赛车比赛。使用特殊道具和技能超越对手，赢得冠军！",
            iframeUrl: "https://html5.gamedistribution.com/5569bd8e16c548ce9241a4d3a29e1cf5/"
        },
        {
            title: "Anime Puzzle Challenge",
            category: "puzzle",
            image: "images/games/anime-puzzle.jpg",
            description: "挑战各种与动漫相关的益智游戏，包括拼图、配对和解谜。锻炼你的大脑，享受乐趣！",
            iframeUrl: "https://html5.gamedistribution.com/f2af2d56e7e4462cb477850ebb994172/"
        }
    ];
    
    // 确保真实游戏数据有足够的条目
    while (realAnimeGames.length < count) {
        realAnimeGames.push(...realAnimeGames);
    }
    
    // 生成游戏数据
    const games = [];
    for (let i = 0; i < count; i++) {
        // 使用真实游戏数据的基础上添加随机元素
        const baseGame = realAnimeGames[i % realAnimeGames.length];
        const rating = topRated ? (Math.random() * 1) + 4 : (Math.random() * 2) + 3; // 3-5 or 4-5 for top rated
        
        const game = {
            id: i + 1,
            title: baseGame.title,
            category: baseGame.category,
            image: baseGame.image || "images/placeholder.svg", // 如果没有图片则使用占位图
            featured: featured || (Math.random() > 0.8), // 20%的概率成为精选
            plays: Math.floor(Math.random() * 900000) + 100000, // 随机播放次数
            rating: rating.toFixed(1),
            ratingCount: Math.floor(Math.random() * 5000) + 100, // 随机评分数量
            description: baseGame.description || "一款好玩的动漫游戏。",
            iframeUrl: baseGame.iframeUrl
        };
        
        games.push(game);
    }
    
    return games;
}

/**
 * Render games to the specified container
 * @param {Array} games - Array of game objects
 * @param {string} containerSelector - CSS selector for the container
 */
function renderGames(games, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const template = document.getElementById('game-card-template');
    if (!template) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Add each game to the container
    games.forEach(game => {
        const gameCard = document.importNode(template.content, true);
        
        // Set data attributes
        gameCard.querySelector('.game-card').setAttribute('data-id', game.id);
        
        // Set game image and alt text
        const gameImage = gameCard.querySelector('.game-image');
        gameImage.src = game.image;
        gameImage.alt = game.title;
        
        // Set category
        gameCard.querySelector('.game-category').textContent = game.category;
        
        // Set title
        gameCard.querySelector('.game-title').textContent = game.title;
        
        // Set rating
        const starsElement = gameCard.querySelector('.stars');
        const ratingValue = Math.round(game.rating);
        starsElement.setAttribute('data-rating', ratingValue);
        gameCard.querySelector('.rating-count').textContent = `(${game.ratingCount})`;
        
        // Set play count with formatting
        const playsCount = gameCard.querySelector('.plays-count');
        playsCount.textContent = formatNumber(game.plays);
        
        // Add "NEW" badge if it's a new game
        if (game.featured) {
            const newBadge = document.createElement('span');
            newBadge.className = 'new-badge';
            newBadge.textContent = 'NEW';
            gameCard.querySelector('.game-thumbnail').appendChild(newBadge);
        }
        
        // Append to container
        container.appendChild(gameCard);
    });
}

/**
 * Format number with commas for thousands
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Generate random avatars for user comments
 * @returns {string} URL for avatar image
 */
function getRandomAvatar() {
    const avatarId = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/150?img=${avatarId}`;
}
