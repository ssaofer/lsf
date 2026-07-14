/* ========================================
   动画交互 - 滚动触发与3D效果
   ======================================== */
(function () {
    'use strict';

    // ---------- 元素进场动画 ----------
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');

                    // 技能条动画
                    if (entry.target.classList.contains('skill-item')) {
                        const fill = entry.target.querySelector('.skill-fill');
                        const width = fill.getAttribute('data-width');
                        if (width) {
                            setTimeout(function () {
                                fill.style.width = width + '%';
                            }, 200);
                        }
                    }

                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealEls.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // 不支持 IntersectionObserver 的浏览器直接显示
        revealEls.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // ---------- 3D 膨胀字体鼠标跟随倾斜 ----------
    const inflateEls = document.querySelectorAll('.inflate-text');

    if (window.matchMedia('(hover: hover)').matches) {
        inflateEls.forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const rotateY = (x / rect.width) * 12;
                const rotateX = -(y / rect.height) * 8;
                el.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(20px)';
            });

            el.addEventListener('mouseleave', function () {
                el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }

    // ---------- 作品卡片 3D 倾斜 ----------
    const projectCards = document.querySelectorAll('.project-card');

    if (window.matchMedia('(hover: hover)').matches) {
        projectCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = ((x - centerX) / centerX) * 6;
                const rotateX = -((y - centerY) / centerY) * 6;
                card.style.transform = 'translateY(-8px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    // ---------- 装饰元素视差 ----------
    const decos = document.querySelectorAll('.deco');
    if (decos.length > 0 && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', function (e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            decos.forEach(function (deco, i) {
                const depth = (i + 1) * 8;
                deco.style.translate = (x * depth) + 'px ' + (y * depth) + 'px';
            });
        });
    }

    // ---------- 滚动进度条 ----------
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
})();
