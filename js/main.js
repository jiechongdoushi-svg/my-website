/**
 * ============================================
 *  我的个人网站 — 主脚本
 *  功能：主题切换、粒子背景、滚动动画、
 *        文章加载、移动菜单、回到顶部等
 * ============================================
 */

(function () {
    'use strict';

    // ==================== 1. 主题切换 ====================
    const THEME_KEY = 'site-theme';
    const themeToggle = document.getElementById('themeToggle');

    // 读取保存的主题
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? '' : 'light';  // '' = 默认深色
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem(THEME_KEY, next || 'dark');
            updateThemeIcon(next || 'dark');
        });

        // 初始图标
        updateThemeIcon(savedTheme || 'dark');
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }

    // ==================== 2. 粒子背景 ====================
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // 创建粒子
        function createParticles() {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 12000);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 1.8 + 0.5,
                });
            }
        }
        createParticles();
        window.addEventListener('resize', createParticles);

        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const color = isLight ? '108, 99, 255' : '108, 99, 255';

            particles.forEach(function (p) {
                p.x += p.vx;
                p.y += p.vy;

                // 边界反弹
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + color + ', ' + (isLight ? 0.25 : 0.5) + ')';
                ctx.fill();
            });

            // 连线
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(' + color + ', ' + (1 - dist / 120) * 0.18 + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        }
        animate();
    }

    // ==================== 3. 滚动动画 ====================
    const fadeEls = document.querySelectorAll('.fade-in');

    function checkFadeIn() {
        fadeEls.forEach(function (el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight * 0.88) {
                el.classList.add('visible');
            }
        });
    }
    checkFadeIn();
    window.addEventListener('scroll', checkFadeIn, { passive: true });

    // ==================== 4. 导航栏滚动效果 ====================
    const nav = document.querySelector('.nav');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // 导航阴影
        if (nav) {
            nav.classList.toggle('scrolled', scrollY > 50);
        }

        // 回到顶部按钮
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
        }

        // 高亮当前区域对应的导航链接
        document.querySelectorAll('.nav-links a').forEach(function (link) {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const section = document.querySelector(href);
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 回到顶部
    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==================== 5. 移动端菜单 ====================
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });

        // 点击链接后关闭菜单
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
            });
        });

        // 点击外部关闭菜单
        document.addEventListener('click', function (e) {
            if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }

    // ==================== 6. 数字滚动动画 ====================
    function animateStats() {
        document.querySelectorAll('.stat-number').forEach(function (el) {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (!target || el.dataset.animated) return;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                el.dataset.animated = '1';
                let current = 0;
                const duration = 1500;
                const start = performance.now();
                function step(ts) {
                    const elapsed = ts - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // ease-out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    current = Math.round(target * eased);
                    el.textContent = current + '+';
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

    // ==================== 7. 加载文章列表 ====================
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
            console.warn('文章数据加载失败，将在稍后重试。');
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
                + '      <span>' + (post.readTime || '') + '</span>'
                + '    </div>'
                + '  </div>'
                + '</article>';
        });
        container.innerHTML = html;

        // 让新加载的文章也能触发淡入动画
        setTimeout(function () {
            checkFadeIn();
        }, 100);
    }

    function escapeHTML(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    loadPosts();

    // ==================== 8. 订阅表单 ====================
    var newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = newsletterForm.querySelector('input');
            if (input && input.value.trim()) {
                // 模拟订阅（后期可接入真实 API）
                var btn = newsletterForm.querySelector('.btn');
                var originalText = btn.textContent;
                btn.textContent = '✅ 已订阅！';
                btn.style.background = '#00C853';
                input.value = '';

                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // ==================== 9. 初始化日志 ====================
    console.log('%c🚀 网站已就绪 %c| %c欢迎查看源码！%c github.com/jiechongdoushi-svg/my-website',
        'font-size:1.2em;', '', 'color:#6C63FF;', '');
    console.log('%c💡 提示：点击右上角的 ☀️/🌙 可以切换主题哦~', 'color:#FF6B9D;');

})();
