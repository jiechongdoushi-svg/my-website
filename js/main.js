/**
 * ============================================
 *  AI Learning Hub — 主脚本
 *  功能：AI工具加载、文章加载、导航、
 *        滚动动画、移动菜单、统计动画等
 * ============================================
 */

(function () {
    'use strict';

    // ==================== 1. 加载 AI 工具列表 ====================
    function loadTools() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/tools.json', true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    var tools = JSON.parse(xhr.responseText);
                    renderTools(tools);
                } catch (e) {
                    console.error('工具数据解析失败:', e);
                }
            }
        };
        xhr.onerror = function () {
            console.warn('工具数据加载失败');
        };
        xhr.send();
    }

    function renderTools(tools) {
        var container = document.getElementById('toolsContainer');
        if (!container) return;
        if (!tools || !tools.length) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">🔧 暂无工具数据</p>';
            return;
        }

        var tagClassMap = { vpn: 'tag-vpn', china: 'tag-china', free: 'tag-free', paid: 'tag-paid' };

        var html = '';
        tools.forEach(function (t) {
            var tagCls = tagClassMap[t.tag] || 'tag-free';
            html += ''
                + '<a href="' + escapeHTML(t.url) + '" target="_blank" rel="noopener" class="tool-card fade-in" title="' + escapeHTML(t.description) + '">'
                + '  <div class="tool-card-icon">' + (t.icon || '🔧') + '</div>'
                + '  <div class="tool-card-info">'
                + '    <h4>' + escapeHTML(t.name) + '</h4>'
                + '    <p>' + escapeHTML(t.description) + '</p>'
                + '    <span class="tool-card-tag ' + tagCls + '">' + escapeHTML(t.chinaAccess) + ' · ' + escapeHTML(t.price) + '</span>'
                + '  </div>'
                + '</a>';
        });
        container.innerHTML = html;

        // 触发淡入动画
        setTimeout(checkFadeIn, 100);
    }

    // ==================== 2. 加载文章列表 ====================
    function loadPosts() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/posts.json', true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    var posts = JSON.parse(xhr.responseText);
                    renderPosts(posts);
                } catch (e) {
                    console.error('文章数据解析失败:', e);
                }
            }
        };
        xhr.onerror = function () {
            console.warn('文章数据加载失败');
        };
        xhr.send();
    }

    function renderPosts(posts) {
        var container = document.getElementById('postsContainer');
        if (!container) return;
        if (!posts || !posts.length) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">📝 暂无文章，敬请期待...</p>';
            return;
        }

        var html = '';
        posts.forEach(function (post) {
            html += ''
                + '<article class="post-card fade-in">'
                + '  <div class="post-card-image">' + (post.emoji || '📄') + '</div>'
                + '  <div class="post-card-body">'
                + '    <span class="post-card-tag">' + escapeHTML(post.tag || '未分类') + '</span>'
                + '    <h3>' + escapeHTML(post.title || '无标题') + '</h3>'
                + '    <p>' + escapeHTML(post.summary || '') + '</p>'
                + '    <div class="post-card-meta">'
                + '      <span>' + escapeHTML(post.date || '') + '</span>'
                + '      <span>' + escapeHTML(post.readTime || '') + '</span>'
                + '    </div>'
                + '  </div>'
                + '</article>';
        });
        container.innerHTML = html;

        setTimeout(checkFadeIn, 100);
    }

    // ==================== 3. 导航滚动效果 ====================
    var nav = document.querySelector('.nav');
    var backToTop = document.getElementById('backToTop');

    function handleScroll() {
        var scrollY = window.scrollY;

        if (nav) {
            nav.classList.toggle('scrolled', scrollY > 50);
        }

        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
        }

        // 高亮当前导航
        document.querySelectorAll('.nav-links a').forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            var section = document.querySelector(href);
            if (!section) return;
            var rect = section.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== 4. 淡入动画 ====================
    var fadeEls = document.querySelectorAll('.fade-in');

    function checkFadeIn() {
        document.querySelectorAll('.fade-in').forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.88) {
                el.classList.add('visible');
            }
        });
    }

    checkFadeIn();
    window.addEventListener('scroll', checkFadeIn, { passive: true });

    // ==================== 5. 移动端菜单 ====================
    var menuBtn = document.getElementById('menuBtn');
    var navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
            });
        });

        document.addEventListener('click', function (e) {
            if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }

    // ==================== 6. 统计数字动画 ====================
    function animateStats() {
        document.querySelectorAll('.stat-number').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            if (!target || el.dataset.animated) return;
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                el.dataset.animated = '1';
                var current = 0;
                var duration = 1500;
                var startTime = performance.now();
                function step(ts) {
                    var elapsed = ts - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    current = Math.round(target * eased);
                    el.textContent = current;
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    }
                }
                requestAnimationFrame(step);
            }
        });
    }
    animateStats();
    window.addEventListener('scroll', animateStats, { passive: true });

    // ==================== 7. 订阅表单 ====================
    var newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = newsletterForm.querySelector('input');
            if (input && input.value.trim()) {
                var btn = newsletterForm.querySelector('.btn');
                var originalText = btn.textContent;
                btn.textContent = '✅ 已订阅！';
                btn.style.background = 'linear-gradient(135deg, #00E676, #00C853)';
                input.value = '';
                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // ==================== 8. 工具函数 ====================
    function escapeHTML(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // ==================== 9. 启动 ====================
    loadTools();
    loadPosts();

    console.log('%c🤖 AI Learning Hub 已就绪 %c| %c探索 AI 的世界！',
        'font-size:1.2em;color:#00E5FF;', '', 'color:#7C4DFF;');
    console.log('%c💡 欢迎贡献工具和教程 → github.com/jiechongdoushi-svg/my-website', 'color:#888;');

})();
