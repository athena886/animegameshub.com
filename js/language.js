/**
 * Language switcher functionality
 * Provides multi-language support for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Available languages
    const languages = {
        'en': {
            name: 'English',
            translations: {
                // Navigation
                'nav.home': 'Home',
                'nav.categories': 'Categories',
                'nav.about': 'About Us',
                'nav.contact': 'Contact',
                
                // Common elements
                'common.search': 'Search',
                'common.loading': 'Loading...',
                'common.read_more': 'Read More',
                'common.play_now': 'Play Now',
                'common.view_all': 'View All',
                
                // Homepage
                'home.hero.title': 'The Ultimate Anime Games Hub',
                'home.hero.subtitle': 'Find and play the best anime-themed games all in one place',
                'home.featured': 'Featured Games',
                'home.newest': 'Latest Releases',
                'home.top_rated': 'Top Rated',
                'home.categories': 'Game Categories',
                'home.newsletter': 'Subscribe to our Newsletter',
                'home.newsletter.placeholder': 'Enter your email',
                'home.newsletter.button': 'Subscribe',
                
                // Footer
                'footer.about': 'About AnimeGamesHub',
                'footer.about.text': 'Your go-to destination for the best collection of anime-themed games, created with love for anime fans around the world.',
                'footer.links': 'Quick Links',
                'footer.categories': 'Categories',
                'footer.legal': 'Legal',
                'footer.legal.terms': 'Terms of Service',
                'footer.legal.privacy': 'Privacy Policy',
                'footer.legal.cookies': 'Cookie Policy',
                'footer.copyright': '© 2025 AnimeGamesHub. All rights reserved.',
                
                // Contact page
                'contact.title': 'Get in Touch',
                'contact.subtitle': 'Have questions, feedback, or just want to say hello? Reach out to us!',
                'contact.form.title': 'Send us a Message',
                'contact.form.name': 'Your Name',
                'contact.form.email': 'Your Email',
                'contact.form.subject': 'Subject',
                'contact.form.message': 'Your Message',
                'contact.form.submit': 'Send Message',
                'contact.info.title': 'Contact Information',
                'contact.info.address': 'Address',
                'contact.info.email': 'Email',
                'contact.info.phone': 'Phone',
                'contact.info.social': 'Social Media',
                'contact.faq.title': 'Frequently Asked Questions'
            }
        },
        
        'zh': {
            name: '中文',
            translations: {
                // Navigation
                'nav.home': '首页',
                'nav.categories': '类别',
                'nav.about': '关于我们',
                'nav.contact': '联系我们',
                
                // Common elements
                'common.search': '搜索',
                'common.loading': '加载中...',
                'common.read_more': '阅读更多',
                'common.play_now': '立即游玩',
                'common.view_all': '查看全部',
                
                // Homepage
                'home.hero.title': '终极动漫游戏中心',
                'home.hero.subtitle': '在一个地方找到并玩最好的动漫主题游戏',
                'home.featured': '精选游戏',
                'home.newest': '最新发布',
                'home.top_rated': '最高评分',
                'home.categories': '游戏类别',
                'home.newsletter': '订阅我们的通讯',
                'home.newsletter.placeholder': '输入您的邮箱',
                'home.newsletter.button': '订阅',
                
                // Footer
                'footer.about': '关于 AnimeGamesHub',
                'footer.about.text': '您的首选动漫主题游戏集合目的地，专为全球动漫粉丝精心打造。',
                'footer.links': '快速链接',
                'footer.categories': '类别',
                'footer.legal': '法律信息',
                'footer.legal.terms': '服务条款',
                'footer.legal.privacy': '隐私政策',
                'footer.legal.cookies': 'Cookie 政策',
                'footer.copyright': '© 2025 AnimeGamesHub。保留所有权利。',
                
                // Contact page
                'contact.title': '联系我们',
                'contact.subtitle': '有问题、反馈或只是想打个招呼？请联系我们！',
                'contact.form.title': '给我们发消息',
                'contact.form.name': '您的姓名',
                'contact.form.email': '您的邮箱',
                'contact.form.subject': '主题',
                'contact.form.message': '您的留言',
                'contact.form.submit': '发送消息',
                'contact.info.title': '联系信息',
                'contact.info.address': '地址',
                'contact.info.email': '邮箱',
                'contact.info.phone': '电话',
                'contact.info.social': '社交媒体',
                'contact.faq.title': '常见问题'
            }
        }
    };
    
    // Get the current language from localStorage or default to English
    let currentLang = localStorage.getItem('preferredLanguage') || 'en';
    
    // Update all text elements on the page
    function updatePageLanguage(lang) {
        const translations = languages[lang].translations;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                // If it's an input placeholder
                if (element.hasAttribute('placeholder')) {
                    element.setAttribute('placeholder', translations[key]);
                } else {
                    element.textContent = translations[key];
                }
            }
        });
        
        // Update language switcher text
        document.querySelectorAll('.language-switcher .current-lang').forEach(el => {
            el.textContent = languages[lang].name;
        });
        
        // Save preference
        localStorage.setItem('preferredLanguage', lang);
        currentLang = lang;
    }
    
    // Create language switcher if it doesn't exist
    function createLanguageSwitcher() {
        // Check if language switcher already exists
        if (document.querySelector('.language-switcher')) {
            return;
        }
        
        const header = document.querySelector('header');
        if (!header) return;
        
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        
        const currentLangEl = document.createElement('span');
        currentLangEl.className = 'current-lang';
        currentLangEl.textContent = languages[currentLang].name;
        
        const dropdown = document.createElement('div');
        dropdown.className = 'lang-dropdown';
        
        // Add language options
        Object.keys(languages).forEach(langCode => {
            const option = document.createElement('a');
            option.href = '#';
            option.setAttribute('data-lang', langCode);
            option.textContent = languages[langCode].name;
            
            option.addEventListener('click', function(e) {
                e.preventDefault();
                updatePageLanguage(langCode);
            });
            
            dropdown.appendChild(option);
        });
        
        switcher.appendChild(currentLangEl);
        switcher.appendChild(dropdown);
        
        // Add it to the header
        const headerRight = document.querySelector('header .header-right');
        if (headerRight) {
            headerRight.prepend(switcher);
        } else {
            header.appendChild(switcher);
        }
        
        // Toggle dropdown on click
        currentLangEl.addEventListener('click', function() {
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!switcher.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // Initialize
    createLanguageSwitcher();
    updatePageLanguage(currentLang);
});
