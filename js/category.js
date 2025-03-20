document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryDescription = document.getElementById('categoryDescription');
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
    const categoryGamesContainer = document.getElementById('categoryGames');
    const gamesCount = document.getElementById('gamesCount');
    const sortBySelect = document.getElementById('sortBy');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const paginationInfo = document.getElementById('paginationInfo');
    const categorySchema = document.getElementById('categorySchema');
    
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'rpg'; // Default to RPG if no category is specified
    
    // Pagination state
    let currentPage = 1;
    const gamesPerPage = 12;
    let totalPages = 1;
    let allGames = [];
    
    // Category metadata
    const categoryMeta = {
        'rpg': {
            title: 'RPG Games',
            description: 'Immerse yourself in character-driven role-playing games with captivating anime worlds and stories.',
            icon: '🎭'
        },
        'romance': {
            title: 'Romance Games',
            description: 'Find love and adventure in our selection of anime romance visual novels and dating simulations.',
            icon: '💖'
        },
        'tower-defense': {
            title: 'Tower Defense Games',
            description: 'Strategic defense games with anime characters and enemies. Build, upgrade, and defend!',
            icon: '🏰'
        },
        'adventure': {
            title: 'Adventure Games',
            description: 'Embark on epic quests and journeys in these anime adventure games full of excitement.',
            icon: '🗺️'
        },
        'idle': {
            title: 'Idle Games',
            description: 'Relaxing anime-themed idle games that progress while you\'re away. Perfect for casual gaming.',
            icon: '⏳'
        },
        'action': {
            title: 'Action Games',
            description: 'Fast-paced action games with anime aesthetics. Test your reflexes and skill!',
            icon: '⚔️'
        },
        'puzzle': {
            title: 'Puzzle Games',
            description: 'Brain-teasing anime puzzle games that will challenge your mind and creativity.',
            icon: '🧩'
        },
        'simulation': {
            title: 'Simulation Games',
            description: 'Live different lives and scenarios in these anime-style simulation games.',
            icon: '🏙️'
        }
    };
    
    // Initialize category page
    function initCategoryPage() {
        const meta = categoryMeta[category] || {
            title: 'Games',
            description: 'Browse our collection of anime-style games.',
            icon: '🎮'
        };
        
        // Set page title and description
        document.title = `${meta.title} - AnimeGamesHub`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', meta.description);
        }
        
        // Update page elements
        categoryTitle.textContent = meta.title;
        categoryDescription.textContent = meta.description;
        categoryBreadcrumb.textContent = meta.title;
        
        // Update Schema.org structured data
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${meta.title} - AnimeGamesHub`,
            "description": meta.description,
            "url": `https://animegameshub.com/category.html?category=${category}`
        };
        categorySchema.textContent = JSON.stringify(schemaData);
        
        // Load category games
        loadCategoryGames();
        
        // Add event listeners
        sortBySelect.addEventListener('change', function() {
            sortGames(this.value);
        });
        
        prevPageButton.addEventListener('click', function() {
            if (currentPage > 1) {
                changePage(currentPage - 1);
            }
        });
        
        nextPageButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                changePage(currentPage + 1);
            }
        });
    }
    
    // Load category games
    function loadCategoryGames() {
        // In a real app, you would fetch data from an API
        // For now, using mock data generation
        allGames = generateMockGames(50, category);
        totalPages = Math.ceil(allGames.length / gamesPerPage);
        
        // Update games count
        gamesCount.textContent = `${allGames.length} Games`;
        
        // Sort games by default option
        sortGames(sortBySelect.value);
        
        // Display first page
        changePage(1);
    }
    
    // Sort games
    function sortGames(sortBy) {
        switch(sortBy) {
            case 'popular':
                allGames.sort((a, b) => b.plays - a.plays);
                break;
            case 'newest':
                allGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'rating':
                allGames.sort((a, b) => b.rating - a.rating);
                break;
            case 'az':
                allGames.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        
        // Refresh current page
        displayGames(currentPage);
    }
    
    // Change page
    function changePage(page) {
        currentPage = page;
        displayGames(page);
        
        // Update pagination UI
        prevPageButton.disabled = page <= 1;
        nextPageButton.disabled = page >= totalPages;
        paginationInfo.textContent = `Page ${page} of ${totalPages}`;
    }
    
    // Display games for the current page
    function displayGames(page) {
        // Clear container
        categoryGamesContainer.innerHTML = '';
        
        // Calculate start and end indices
        const startIndex = (page - 1) * gamesPerPage;
        const endIndex = Math.min(startIndex + gamesPerPage, allGames.length);
        
        // Get games for current page
        const pageGames = allGames.slice(startIndex, endIndex);
        
        // Render games
        pageGames.forEach(game => {
            const gameCard = createGameCard(game);
            categoryGamesContainer.appendChild(gameCard);
        });
    }
    
    // Create a game card
    function createGameCard(game) {
        const template = document.getElementById('game-card-template');
        const gameCard = document.importNode(template.content, true).querySelector('.game-card');
        
        // Set game data
        gameCard.querySelector('.game-title').textContent = game.title;
        gameCard.querySelector('.game-image').src = game.image;
        gameCard.querySelector('.game-image').alt = game.title;
        gameCard.querySelector('.game-category').textContent = game.category;
        gameCard.querySelector('.plays-count').textContent = formatNumber(game.plays);
        gameCard.querySelector('.rating-count').textContent = `(${game.ratingCount})`;
        
        // Create stars for rating
        const starsContainer = gameCard.querySelector('.stars');
        const rating = Math.round(game.rating * 2) / 2; // Round to nearest 0.5
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            if (i <= rating) {
                star.className = 'star full';
                star.innerHTML = '★';
            } else if (i - 0.5 === rating) {
                star.className = 'star half';
                star.innerHTML = '★';
            } else {
                star.className = 'star empty';
                star.innerHTML = '☆';
            }
            starsContainer.appendChild(star);
        }
        
        // Add click event
        gameCard.querySelector('.play-button').addEventListener('click', function() {
            window.location.href = `game-detail.html?id=${game.id}`;
        });
        
        return gameCard;
    }
    
    // Format number with k/m for thousands/millions
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'm';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
    
    // Generate mock games
    function generateMockGames(count, categoryFilter) {
        const games = [];
        const categories = ['rpg', 'romance', 'tower-defense', 'adventure', 'idle', 'action', 'puzzle', 'simulation'];
        const titles = [
            'Cyber Samurai', 'Neon Academy', 'Magical Quest', 'Spirit Hunters', 
            'Tokyo Love Story', 'Dragon Soul', 'Pixel Warriors', 'Mecha Titans',
            'Fantasy World', 'Space Explorers', 'Ninja Path', 'Demon Slayer RPG',
            'Kawaii Defense', 'School Days', 'Robot Battle', 'Vampire Kingdom',
            'Crystal Saga', 'Dark Prophecy', 'Hero\'s Journey', 'Celestial Legends'
        ];
        
        for (let i = 1; i <= count; i++) {
            // If category filter is provided, use it, otherwise pick random category
            const gameCategory = categoryFilter && categoryMeta[categoryFilter] ? 
                categoryFilter : categories[Math.floor(Math.random() * categories.length)];
            
            // Generate a random title or combine existing ones for variety
            let gameTitle;
            if (Math.random() > 0.7) {
                // Combine two titles
                const title1 = titles[Math.floor(Math.random() * titles.length)];
                const title2 = titles[Math.floor(Math.random() * titles.length)];
                gameTitle = `${title1}: ${title2}`;
            } else {
                gameTitle = titles[Math.floor(Math.random() * titles.length)];
            }
            
            // Add a number to ensure uniqueness
            gameTitle += ` ${Math.floor(Math.random() * 5) + 1}`;
            
            const game = {
                id: i,
                title: gameTitle,
                category: gameCategory,
                image: `images/games/game${(i % 8) + 1}.jpg`, // Cycle through 8 game images
                plays: Math.floor(Math.random() * 900000) + 100000, // Random plays between 100k and 1M
                rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
                ratingCount: Math.floor(Math.random() * 5000) + 100, // Random rating count
                releaseDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
            };
            
            games.push(game);
        }
        
        return games;
    }
    
    // Initialize the page
    initCategoryPage();
    
    // Initialize shared components (from app.js)
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    
    if (typeof initNewsletter === 'function') {
        initNewsletter();
    }
});
