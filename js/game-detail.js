/**
 * AnimeGamesHub - Game Detail Page JavaScript
 * Handles game loading, comments, ratings, and UI interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get game ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    
    if (!gameId) {
        // Redirect to home if no game ID is provided
        window.location.href = 'index.html';
        return;
    }
    
    // Load game details
    loadGameDetails(gameId);
    
    // Load related games
    loadRelatedGames();
    
    // Setup rating stars
    setupRatingStars();
    
    // Setup share buttons
    setupShareButtons();
    
    // Setup fullscreen button
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Setup like and favorite buttons
    const likeBtn = document.getElementById('likeBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            // In a real app, you would send this to your backend
        });
    }
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            // In a real app, you would send this to your backend
        });
    }
    
    // Submit rating
    const submitRatingBtn = document.querySelector('.submit-rating');
    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', submitRating);
    }
});

/**
 * Load game details from API or mock data
 * @param {string} gameId - Game ID
 */
function loadGameDetails(gameId) {
    // 首先检查是否存在桌面导入的游戏数据
    if (typeof window.desktopGames !== 'undefined' && window.desktopGames.length > 0) {
        // 从桌面导入的游戏中查找
        const desktopGame = window.desktopGames.find(game => game.id === gameId);
        
        if (desktopGame) {
            console.log('找到桌面导入的游戏:', desktopGame.title);
            
            // 更新页面游戏信息
            updateGameDetails(desktopGame);
            
            // 加载游戏iframe
            loadGameFrame(desktopGame.iframeUrl);
            
            // 加载评论
            loadComments(gameId);
            
            // 更新结构化数据
            updateStructuredData(desktopGame);
            
            return; // 已找到桌面游戏，无需继续处理
        }
    }
    
    // 如果没有找到桌面导入的游戏，使用模拟数据
    setTimeout(() => {
        const gameDetails = getMockGameDetails(gameId);
        
        // 更新页面游戏信息
        updateGameDetails(gameDetails);
        
        // 加载游戏iframe
        loadGameFrame(gameDetails.frameUrl);
        
        // 加载评论
        loadComments(gameId);
        
        // 更新结构化数据
        updateStructuredData(gameDetails);
        
    }, 500);
}

/**
 * Get mock game details
 * @param {string} gameId - Game ID
 * @returns {Object} Game details object
 */
function getMockGameDetails(gameId) {
    const id = parseInt(gameId, 10);
    const categories = ['RPG', 'Romance', 'Adventure', 'Tower Defense', 'Idle', 'Action', 'Puzzle', 'Simulation'];
    const gameNames = [
        'Cyber Ninja Academy', 'Neon Dreams', 'Tokyo Drift Racing', 
        'Magical Girl Revolution', 'Dragon Soul', 'Sword of the Ancients',
        'Pixel Kingdom', 'Mecha Warriors', 'Space Odyssey', 'Cyberpunk Rebels',
        'Anime High School', 'Demon Hunter Chronicles', 'Spirit Summoner',
        'Endless Dungeon', 'Idle Anime Heroes', 'Waifu Collector',
        'Samurai\'s Path', 'Witch\'s Apprentice', 'Galactic Princess',
        'Phantom Thief Adventure', 'Drift City', 'Neon Street Racing'
    ];
    
    // Generate a consistent index based on the ID
    const nameIndex = (id - 1) % gameNames.length;
    const categoryIndex = (id - 1) % categories.length;
    
    // Generate game descriptions based on the category
    const descriptions = {
        'RPG': 'Immerse yourself in a captivating world filled with anime characters and exciting quests. Level up your hero, collect powerful items, and form alliances with other players in this enchanting RPG. With stunning visuals and an engaging storyline, this game offers countless hours of gameplay as you explore vast landscapes and battle formidable foes.',
        'Romance': 'Experience a heartwarming love story where your choices matter. Build relationships with charming characters, each with their own unique personality and storyline. Navigate through romantic scenarios, unlock special events, and discover multiple endings based on your decisions. Perfect for fans of visual novels and dating sims!',
        'Adventure': 'Embark on an epic journey through beautiful anime-inspired landscapes. Solve puzzles, discover hidden treasures, and encounter memorable characters along the way. With intuitive controls and a compelling narrative, this adventure game will keep you engaged from start to finish.',
        'Tower Defense': 'Strategically place your anime defenders to protect your base from waves of adorable yet dangerous enemies. Upgrade your towers, unlock special abilities, and employ different tactics to overcome increasingly challenging levels. Can you create the ultimate defense system?',
        'Idle': 'Build and manage your own anime empire even while you\'re away! This idle game features automatic progression, allowing you to earn resources and level up your characters even when not actively playing. Check back regularly to collect rewards and make strategic decisions to accelerate your growth.',
        'Action': 'Test your reflexes in this fast-paced action game featuring fluid combat mechanics and flashy special moves. Chain combos, dodge attacks, and defeat powerful bosses in style. With responsive controls and spectacular visual effects, every battle feels satisfying and intense.',
        'Puzzle': 'Challenge your mind with creative puzzles featuring cute anime characters. Each level presents a unique challenge that requires logical thinking and careful planning. With hundreds of levels and increasing difficulty, this puzzle game provides the perfect mental workout wrapped in a charming anime aesthetic.',
        'Simulation': 'Create and customize your own anime world in this detailed simulation game. Build relationships, decorate your space, and participate in various activities within a vibrant community. Express yourself through character customization and watch your virtual life evolve based on your choices.'
    };
    
    // Game controls based on category
    const controls = {
        'RPG': ['WASD or Arrow Keys: Move character', 'Mouse: Interact with objects and NPCs', 'E: Open inventory', 'Space: Jump', 'Left Click: Attack'],
        'Romance': ['Mouse: Click to progress dialogue', 'Number Keys (1-4): Select dialogue options', 'ESC: Open menu', 'S: Save game', 'L: Load game'],
        'Adventure': ['WASD or Arrow Keys: Move character', 'Space: Jump', 'E: Interact', 'Q: Use special ability', 'Tab: Open map'],
        'Tower Defense': ['Mouse: Place and upgrade towers', 'Number Keys (1-5): Select tower types', 'Space: Start next wave', 'P: Pause game'],
        'Idle': ['Mouse: Click to collect resources', 'Number Keys (1-5): Switch between areas', 'A: Auto-collect toggle', 'U: Upgrades menu'],
        'Action': ['WASD or Arrow Keys: Move character', 'J/K/L: Different attacks', 'Space: Dodge', 'Q/E: Special abilities', 'Shift: Sprint'],
        'Puzzle': ['Mouse: Select and move pieces', 'R: Reset level', 'Space: Hint', 'Arrow Keys: Navigate puzzle grid'],
        'Simulation': ['WASD or Arrow Keys: Move character', 'Mouse: Interact with objects', 'E: Use items', 'Tab: Open inventory', 'C: Open character customization']
    };
    
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const ratingCount = Math.floor(Math.random() * 1000) + 100;
    const plays = Math.floor(Math.random() * 100000) + 10000;
    
    return {
        id: id,
        title: gameNames[nameIndex],
        category: categories[categoryIndex],
        description: descriptions[categories[categoryIndex]],
        controls: controls[categories[categoryIndex]],
        image: `https://via.placeholder.com/600x400/1a1a2e/ffffff?text=${encodeURIComponent(gameNames[nameIndex])}`,
        frameUrl: 'https://www.gamearter.com/game/embed/memory-match-pixel-art/',
        rating: parseFloat(rating),
        ratingCount: ratingCount,
        plays: plays
    };
}

/**
 * Update page with game details
 * @param {Object} game - Game details object
 */
function updateGameDetails(game) {
    // Update page title
    document.title = `${game.title} - AnimeGamesHub`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `Play ${game.title} - ${game.description.substring(0, 150)}... Free online anime games at AnimeGamesHub.com`);
    }
    
    // Update breadcrumbs
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
    const gameTitleBreadcrumb = document.getElementById('gameTitleBreadcrumb');
    
    if (categoryBreadcrumb) {
        categoryBreadcrumb.textContent = game.category;
        categoryBreadcrumb.setAttribute('href', `category.html?category=${game.category.toLowerCase()}`);
    }
    
    if (gameTitleBreadcrumb) {
        gameTitleBreadcrumb.textContent = game.title;
    }
    
    // Update game info
    document.getElementById('gameTitle').textContent = game.title;
    document.getElementById('gameCategory').textContent = game.category;
    document.getElementById('gameCover').src = game.image;
    document.getElementById('gameCover').alt = game.title;
    document.getElementById('gameDescription').textContent = game.description;
    
    // Update rating
    const gameRatingStars = document.getElementById('gameRatingStars');
    const ratingValue = Math.round(game.rating);
    gameRatingStars.setAttribute('data-rating', ratingValue);
    document.getElementById('gameRatingCount').textContent = `(${game.ratingCount} ratings)`;
    
    // Update play count
    document.getElementById('gamePlaysCount').textContent = `${formatNumber(game.plays)} plays`;
    
    // Update controls
    const gameControls = document.getElementById('gameControls');
    gameControls.innerHTML = '';
    
    game.controls.forEach(control => {
        const li = document.createElement('li');
        li.textContent = control;
        gameControls.appendChild(li);
    });
}

/**
 * 加载游戏iframe
 * @param {string} iframeUrl - iframe URL
 */
function loadGameFrame(iframeUrl) {
    const gameFrame = document.getElementById('gameFrame');
    const gameLoading = document.getElementById('gameLoading');
    
    if (!gameFrame) return;
    
    try {
        // 默认的iframe URL，当提供的URL无效时使用
        const defaultIframeUrl = "https://html5.gamedistribution.com/rvvASMiM/c84aa267dd0d4c7c8ef5c16c600a3adb/";
        
        // 检查URL是否有效
        const finalUrl = iframeUrl || defaultIframeUrl;
        
        console.log('设置游戏iframe:', finalUrl);
        
        // 显示加载状态
        if (gameLoading) {
            gameLoading.style.display = 'flex';
            
            // 获取加载进度文本元素
            const loadingProgressText = document.getElementById('loadingProgressText');
            if (loadingProgressText) {
                loadingProgressText.innerText = 'Connecting to game server...';
                loadingProgressText.style.display = 'block';
            }
            
            // 模拟加载进度
            simulateLoadingProgress(loadingProgressText);
        }
        
        // 预先连接到游戏资源域，提高加载速度
        addPreconnect(extractDomain(finalUrl));
        
        // 监控iframe加载情况并设置超时处理
        const loadTimeout = setTimeout(() => {
            if (gameLoading && gameLoading.style.display !== 'none') {
                const loadingProgressText = document.getElementById('loadingProgressText');
                if (loadingProgressText) {
                    loadingProgressText.innerText = 'Game server is responding slowly. Please wait...';
                    loadingProgressText.style.color = '#FF42B0';
                }
            }
        }, 10000); // 10秒超时
        
        // 先清空iframe
        gameFrame.src = 'about:blank';
        
        // 适当延迟后设置新的src，以便重置iframe状态
        setTimeout(() => {
            // 设置iframe的src属性
            gameFrame.src = finalUrl;
            
            // 添加加载事件监听器
            gameFrame.onload = function() {
                console.log('游戏iframe加载完成');
                clearTimeout(loadTimeout);
                
                // 移除加载状态
                if (gameLoading) {
                    gameLoading.style.display = 'none';
                }
                
                // 显示游戏加载完成的通知
                showGameLoadedNotification();
            };
            
            // 添加错误处理
            gameFrame.onerror = function(error) {
                console.error('加载游戏iframe时出错:', error);
                clearTimeout(loadTimeout);
                
                const loadingProgressText = document.getElementById('loadingProgressText');
                if (loadingProgressText) {
                    loadingProgressText.innerText = 'Error loading game. Trying alternative source...';
                    loadingProgressText.style.color = '#FF42B0';
                }
                
                // 尝试使用默认iframe
                setTimeout(() => {
                    gameFrame.src = defaultIframeUrl;
                }, 1500);
            };
        }, 100);
        
    } catch (error) {
        console.error('设置游戏iframe时出错:', error);
        // 使用默认iframe
        gameFrame.src = defaultIframeUrl;
    }
}

/**
 * 从URL中提取域名
 * @param {string} url - 完整URL
 * @returns {string} 域名
 */
function extractDomain(url) {
    try {
        if (!url || url === 'about:blank') {
            return '';
        }
        
        const urlObj = new URL(url);
        return urlObj.origin;
    } catch (error) {
        console.error('提取域名时出错:', error);
        return '';
    }
}

/**
 * 添加预连接提示，提高加载速度
 * @param {string} domain - 需要预连接的域名
 */
function addPreconnect(domain) {
    if (!domain) return;
    
    // 检查是否已经存在预连接标签
    const existingLinks = document.head.querySelectorAll('link[rel="preconnect"]');
    for (const link of existingLinks) {
        if (link.href === domain) return;
    }
    
    // 添加预连接标签
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = domain;
    document.head.appendChild(preconnect);
    
    // 添加DNS预取
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = domain;
    document.head.appendChild(dnsPrefetch);
    
    console.log('添加预连接到:', domain);
}

/**
 * 模拟加载进度以提供更好的用户体验
 * @param {HTMLElement} loadingText - 加载文本元素
 */
function simulateLoadingProgress(loadingText) {
    if (!loadingText) return;
    
    const stages = [
        'Connecting to game server...',
        'Downloading game resources...',
        'Preparing game environment...',
        'Setting up game interface...',
        'Almost ready...'
    ];
    
    let stageIndex = 0;
    
    // 定时更新加载文本
    const progressInterval = setInterval(() => {
        if (loadingText.style.display === 'none' || stageIndex >= stages.length) {
            clearInterval(progressInterval);
            return;
        }
        
        loadingText.innerText = stages[stageIndex];
        stageIndex++;
    }, 2000); // 每2秒更新一次
}

/**
 * 显示游戏加载完成的通知
 */
function showGameLoadedNotification() {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.classList.add('notification', 'game-loaded-notification');
    notification.innerHTML = `
        <div class="notification-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#42D3FF" stroke-width="2"/>
                <path d="M8 12L10.5 14.5L16 9" stroke="#42D3FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="notification-content">
            <p>Game loaded successfully! Have fun playing!</p>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除通知
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Load comments for a game
 * @param {string} gameId - Game ID
 */
function loadComments(gameId) {
    // In a real app, you would fetch comments from your backend
    // For now, we'll generate random comments
    
    const commentsContainer = document.getElementById('commentsContainer');
    const noComments = document.getElementById('noComments');
    
    if (!commentsContainer) return;
    
    // Generate random number of comments (0-8)
    const commentCount = Math.floor(Math.random() * 9);
    
    if (commentCount === 0) {
        // No comments
        if (noComments) {
            noComments.style.display = 'block';
        }
        return;
    }
    
    // Hide "no comments" message
    if (noComments) {
        noComments.style.display = 'none';
    }
    
    // Generate and add comments
    const comments = generateMockComments(commentCount);
    renderComments(comments, commentsContainer);
}

/**
 * Generate mock comments
 * @param {number} count - Number of comments to generate
 * @returns {Array} Array of comment objects
 */
function generateMockComments(count) {
    const commentTexts = [
        "This game is amazing! The graphics are stunning and the gameplay is super addictive.",
        "I've been playing this for hours. Can't get enough of it!",
        "Good game but it gets a bit repetitive after a while.",
        "The art style is gorgeous. Perfectly captures the anime aesthetic.",
        "Challenging but fair. Definitely recommend for hardcore gamers.",
        "I love the character designs and story. Wish there were more games like this!",
        "Fun casual game to play when you have a few minutes to spare.",
        "The controls took some getting used to, but once I got the hang of it, it was very enjoyable.",
        "Great time killer! Simple yet entertaining.",
        "This is one of the best anime games I've played online. The attention to detail is impressive.",
        "Cute graphics and smooth gameplay. Perfect combination!",
        "Could use more levels, but what's there is really well designed.",
        "I keep coming back to this game. It's oddly satisfying.",
        "The music is fantastic! Really sets the mood for the gameplay."
    ];
    
    const names = [
        "AnimeLovers", "OtakuGamer", "SakuraChan", "NarutoFan", "MechaPilot",
        "TokyoDrifter", "WaifuHunter", "SenpaiNoticed", "AkiraYuki", "HimekoStar",
        "DragonSlayer", "MidnightSamurai", "KawaiiDesu", "MangaReader", "NyanCat",
        "VocaloidFan", "MaidCafe", "ShiroNeko", "TsundereQueen", "KuroNinja"
    ];
    
    return Array.from({ length: count }, (_, i) => {
        const randomTextIndex = Math.floor(Math.random() * commentTexts.length);
        const randomNameIndex = Math.floor(Math.random() * names.length);
        const rating = Math.floor(Math.random() * 5) + 1;
        
        // Generate a random date within the last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        return {
            id: i + 1,
            author: names[randomNameIndex],
            avatar: getRandomAvatar(),
            date: date,
            rating: rating,
            text: commentTexts[randomTextIndex]
        };
    });
}

/**
 * Render comments to the container
 * @param {Array} comments - Array of comment objects
 * @param {Element} container - Container element
 */
function renderComments(comments, container) {
    const template = document.getElementById('comment-template');
    if (!template) return;
    
    // Clear container except for the "no comments" message
    const noComments = document.getElementById('noComments');
    container.innerHTML = '';
    if (noComments) {
        container.appendChild(noComments);
    }
    
    // Add each comment to the container
    comments.forEach(comment => {
        const commentElement = document.importNode(template.content, true);
        
        // Set avatar
        const avatarImg = commentElement.querySelector('.comment-avatar img');
        avatarImg.src = comment.avatar;
        avatarImg.alt = comment.author;
        
        // Set author and date
        commentElement.querySelector('.comment-author').textContent = comment.author;
        commentElement.querySelector('.comment-date').textContent = formatDate(comment.date);
        
        // Set rating
        const starsElement = commentElement.querySelector('.stars');
        starsElement.setAttribute('data-rating', comment.rating);
        
        // Set comment text
        commentElement.querySelector('.comment-body').textContent = comment.text;
        
        // Append to container
        container.appendChild(commentElement);
    });
}

/**
 * Load related games
 */
function loadRelatedGames() {
    // In a real app, you would fetch related games based on the current game's category
    // For now, we'll use mock data
    
    const relatedGames = generateMockGames(6);
    renderGames(relatedGames, '.related-games');
}

/**
 * Generate mock game data (simplified version from app.js)
 * @param {number} count - Number of games to generate
 * @returns {Array} Array of game objects
 */
function generateMockGames(count = 6) {
    const categories = ['RPG', 'Romance', 'Adventure', 'Tower Defense', 'Idle', 'Action', 'Puzzle', 'Simulation'];
    const gameNames = [
        'Cyber Ninja Academy', 'Neon Dreams', 'Tokyo Drift Racing', 
        'Magical Girl Revolution', 'Dragon Soul', 'Sword of the Ancients',
        'Pixel Kingdom', 'Mecha Warriors', 'Space Odyssey', 'Cyberpunk Rebels',
        'Anime High School', 'Demon Hunter Chronicles', 'Spirit Summoner',
        'Endless Dungeon', 'Idle Anime Heroes', 'Waifu Collector',
        'Samurai\'s Path', 'Witch\'s Apprentice', 'Galactic Princess',
        'Phantom Thief Adventure', 'Drift City', 'Neon Street Racing'
    ];
    
    return Array.from({ length: count }, (_, i) => {
        const id = i + 10; // Offset to not conflict with current game
        const randomIndex = Math.floor(Math.random() * gameNames.length);
        const randomCategoryIndex = Math.floor(Math.random() * categories.length);
        const rating = (Math.random() * 2 + 3).toFixed(1);
        
        return {
            id: id,
            title: gameNames[randomIndex],
            category: categories[randomCategoryIndex],
            image: `https://via.placeholder.com/300x200/1a1a2e/ffffff?text=Anime+Game+${id}`,
            rating: parseFloat(rating),
            ratingCount: Math.floor(Math.random() * 500) + 50,
            plays: Math.floor(Math.random() * 50000) + 5000
        };
    });
}

/**
 * Render games to the specified container (simplified version from app.js)
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
        
        // Append to container
        container.appendChild(gameCard);
    });
}

/**
 * Format date to relative time
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
        return 'Today';
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else if (diffInDays < 30) {
        return `${diffInDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
}

/**
 * Format number with commas for thousands (duplicated from app.js)
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Generate random avatars for user comments (duplicated from app.js)
 * @returns {string} URL for avatar image
 */
function getRandomAvatar() {
    const avatarId = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/150?img=${avatarId}`;
}

/**
 * Setup rating stars interaction
 */
function setupRatingStars() {
    const stars = document.querySelectorAll('.rating-stars .star');
    let selectedRating = 0;
    
    stars.forEach(star => {
        // Hover effect
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'), 10);
            highlightStars(rating);
        });
        
        // Click to set rating
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'), 10);
            highlightStars(selectedRating);
            
            // Add active class to selected stars
            stars.forEach(s => {
                const sRating = parseInt(s.getAttribute('data-rating'), 10);
                if (sRating <= selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    // Reset stars on mouseout if no rating is selected
    const ratingContainer = document.querySelector('.rating-stars');
    if (ratingContainer) {
        ratingContainer.addEventListener('mouseout', function() {
            if (selectedRating > 0) {
                highlightStars(selectedRating);
            } else {
                highlightStars(0);
            }
        });
    }
    
    // Helper function to highlight stars up to a rating
    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'), 10);
            if (starRating <= rating) {
                star.style.color = '#f5c518';
            } else {
                star.style.color = 'rgba(255, 255, 255, 0.2)';
            }
        });
    }
}

/**
 * Submit rating and review
 */
function submitRating() {
    const activeStars = document.querySelectorAll('.rating-stars .star.active');
    const rating = activeStars.length;
    const reviewText = document.querySelector('.rate-game textarea').value;
    
    if (rating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    
    // In a real app, you would send this to your backend
    alert(`Thank you for your ${rating}-star review!${reviewText ? ' Your feedback is greatly appreciated.' : ''}`);
    
    // Reset form
    document.querySelectorAll('.rating-stars .star').forEach(star => {
        star.classList.remove('active');
        star.style.color = 'rgba(255, 255, 255, 0.2)';
    });
    document.querySelector('.rate-game textarea').value = '';
    
    // Add the review to the comments (mock behavior)
    const newComment = {
        id: Math.floor(Math.random() * 1000),
        author: 'You',
        avatar: getRandomAvatar(),
        date: new Date(),
        rating: rating,
        text: reviewText || 'Great game!'
    };
    
    const commentsContainer = document.getElementById('commentsContainer');
    const noComments = document.getElementById('noComments');
    
    if (noComments) {
        noComments.style.display = 'none';
    }
    
    renderComments([newComment], commentsContainer);
}

/**
 * Setup share buttons
 */
function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            let shareUrl = '';
            
            if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
            } else if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            } else if (this.classList.contains('tiktok')) {
                // TikTok doesn't have a direct share URL, so we'll copy to clipboard
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('URL copied to clipboard! You can now share it on TikTok.'))
                    .catch(err => console.error('Could not copy text: ', err));
                return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

/**
 * Toggle fullscreen for game iframe
 */
function toggleFullscreen() {
    const gameFrame = document.querySelector('.game-frame-container');
    
    if (!document.fullscreenElement) {
        if (gameFrame.requestFullscreen) {
            gameFrame.requestFullscreen();
        } else if (gameFrame.webkitRequestFullscreen) { /* Safari */
            gameFrame.webkitRequestFullscreen();
        } else if (gameFrame.msRequestFullscreen) { /* IE11 */
            gameFrame.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

/**
 * Update schema.org structured data
 * @param {Object} game - Game details object
 */
function updateStructuredData(game) {
    const schema = document.getElementById('gameSchema');
    if (!schema) return;
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        "name": game.title,
        "description": game.description,
        "image": game.image,
        "url": window.location.href,
        "genre": game.category,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": game.rating.toString(),
            "reviewCount": game.ratingCount.toString(),
            "bestRating": "5",
            "worstRating": "1"
        }
    };
    
    schema.textContent = JSON.stringify(structuredData);
}
