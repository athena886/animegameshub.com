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
    // In a real app, you would fetch this data from your backend or a game API
    // For now, we'll use mock data
    
    const mockGames = {
        featured: generateMockGames(8, true),
        newest: generateMockGames(8),
        topRated: generateMockGames(8, false, true)
    };
    
    // Render games to their respective sections
    renderGames(mockGames.featured, '.featured-games');
    renderGames(mockGames.newest, '.newest-games');
    renderGames(mockGames.topRated, '.top-rated-games');
}

/**
 * Generate mock game data
 * @param {number} count - Number of games to generate
 * @param {boolean} featured - Whether these are featured games
 * @param {boolean} topRated - Whether these are top rated games
 * @returns {Array} Array of game objects
 */
function generateMockGames(count, featured = false, topRated = false) {
    const games = [];
    const categories = ['rpg', 'romance', 'tower-defense', 'adventure', 'idle'];
    const titles = [
        'Cyberpunk Samurai', 'Neon Academy', 'Magical Quest', 'Spirit Hunters', 
        'Tokyo Love Story', 'Dragon Soul', 'Pixel Warriors', 'Mecha Titans'
    ];
    
    for (let i = 1; i <= count; i++) {
        const rating = topRated ? (Math.random() * 1) + 4 : (Math.random() * 2) + 3; // 3-5 or 4-5 for top rated
        const game = {
            id: i,
            title: titles[Math.floor(Math.random() * titles.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            image: `images/placeholder.svg`, // 使用占位图片
            featured: featured,
            plays: Math.floor(Math.random() * 900000) + 100000, // Random plays between 100k and 1M
            rating: rating.toFixed(1),
            ratingCount: Math.floor(Math.random() * 5000) + 100 // Random rating count
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
