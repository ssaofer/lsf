/* ========================================
   主逻辑 - 导航、滚动、交互
   ======================================== */
(function () {
    'use strict';

    // ---------- 导航栏滚动联动 ----------
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    let lastScroll = 0;

    function handleScroll() {
        const scrollTop = window.scrollY;

        // 滚动时改变导航栏样式
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 向下滚动隐藏导航栏,向上滚动显示
        if (scrollTop > 300) {
            if (scrollTop > lastScroll) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
        } else {
            navbar.classList.remove('nav-hidden');
        }

        lastScroll = scrollTop;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---------- 导航高亮当前区块 ----------
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('data-section') === id);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    // ---------- 平滑滚动(锚点) ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offset = 70;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPos,
                behavior: 'smooth'
            });

            // 关闭移动端菜单
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // ---------- 移动端汉堡菜单 ----------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // ---------- 回到顶部 ----------
    const backTop = document.getElementById('backTop');
    if (backTop) {
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- 兴趣卡片翻转 ----------
    const lifeCards = document.querySelectorAll('.life-card');
    lifeCards.forEach(function (card) {
        card.addEventListener('click', function () {
            card.classList.toggle('flipped');
        });
    });

    // ---------- 联系方式复制 ----------
    const toast = document.getElementById('toast');
    let toastTimer = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove('show');
        }, 2200);
    }

    document.querySelectorAll('[data-copy]').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const text = this.getAttribute('data-copy');

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    showToast('已复制:' + text);
                }).catch(function () {
                    fallbackCopy(text);
                });
            } else {
                fallbackCopy(text);
            }
        });
    });

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('已复制:' + text);
        } catch (err) {
            showToast('复制失败,请手动复制');
        }
        document.body.removeChild(textarea);
    }

    // ---------- 简历下载按钮 ----------
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function () {
            showToast('正在下载简历 PDF');
        });
    }

    // ---------- 营销策划案下载 ----------
    const marketingCard = document.querySelector('.marketing-card');
    if (marketingCard) {
        marketingCard.addEventListener('click', function () {
            showToast('正在下载营销策划案 PPTX');
        });
    }

    // ---------- 头像点击彩蛋 ----------
    const avatar = document.querySelector('.avatar-img');
    if (avatar) {
        let clickCount = 0;
        avatar.addEventListener('click', function () {
            clickCount++;
            avatar.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            avatar.style.transform = 'rotate(' + (clickCount * 360) + 'deg) scale(0.96)';
            if (clickCount >= 3) {
                showToast('发现彩蛋!你很有好奇心 ✦');
                clickCount = 0;
            }
        });
    }

    // ---------- 作品分类多级切换 ----------
    const level1Cards = document.getElementById('level1Cards');
    const designSubCategory = document.getElementById('designSubCategory');
    const worksDetail = document.getElementById('worksDetail');
    const categoryCards = document.querySelectorAll('.category-card');
    const subCards = document.querySelectorAll('.sub-card');
    const detailBackBtns = document.querySelectorAll('.detail-back');

    // 状态管理:记录当前层级 (1, 2, 3)
    let currentLevel = 1;
    // 记录从哪个一级分类进入的二级(用于返回)
    let fromCategory = null;

    function showLevel2Design() {
        if (level1Cards) level1Cards.style.display = 'none';
        if (designSubCategory) {
            designSubCategory.classList.add('active');
            designSubCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(function () {
                const reveals = designSubCategory.querySelectorAll('.reveal');
                reveals.forEach(function (el) {
                    el.classList.add('visible');
                });
            }, 200);
        }
        currentLevel = 2;
        fromCategory = 'design';
    }

    function showLevel1() {
        if (designSubCategory) designSubCategory.classList.remove('active');
        if (worksDetail) {
            worksDetail.classList.remove('active');
            const allPanels = worksDetail.querySelectorAll('.detail-panel');
            allPanels.forEach(function (p) {
                p.classList.remove('active');
            });
        }
        if (level1Cards) {
            level1Cards.style.display = '';
            level1Cards.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        currentLevel = 1;
        fromCategory = null;
    }

    function showWorksPanel(panelId, backTo) {
        if (backTo === 'level1') {
            if (level1Cards) level1Cards.style.display = 'none';
        } else if (backTo === 'sub') {
            if (designSubCategory) designSubCategory.classList.remove('active');
        }

        if (worksDetail) {
            const allPanels = worksDetail.querySelectorAll('.detail-panel');
            allPanels.forEach(function (p) {
                p.classList.remove('active');
            });

            const targetPanel = document.getElementById('panel-' + panelId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            worksDetail.classList.add('active');
            worksDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });

            setTimeout(function () {
                const reveals = worksDetail.querySelectorAll('.reveal');
                reveals.forEach(function (el) {
                    el.classList.add('visible');
                });
            }, 300);
        }
        currentLevel = 3;
    }

    function backFromWorks() {
        if (worksDetail) worksDetail.classList.remove('active');

        if (fromCategory === 'video') {
            showLevel1();
        } else if (fromCategory === 'design') {
            showLevel2Design();
        }
    }

    // 一级分类卡片点击
    categoryCards.forEach(function (card) {
        card.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            fromCategory = category;

            if (category === 'video') {
                showWorksPanel('video', 'level1');
            } else if (category === 'design') {
                showLevel2Design();
            }
        });
    });

    // 二级子分类卡片点击
    subCards.forEach(function (card) {
        card.addEventListener('click', function () {
            const sub = this.getAttribute('data-sub');
            showWorksPanel(sub, 'sub');
        });
    });

    // 返回按钮
    detailBackBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const backTarget = this.getAttribute('data-back');

            if (backTarget === 'level1') {
                showLevel1();
            } else if (backTarget === 'parent') {
                backFromWorks();
            }
        });
    });

    // ---------- 视频播放交互 ----------
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(function (card) {
        const video = card.querySelector('video');
        if (!video) return;

        card.addEventListener('mouseenter', function () {
            video.muted = true;
            video.loop = true;
            video.play().catch(function () {});
        });

        card.addEventListener('mouseleave', function () {
            video.pause();
            video.currentTime = 0;
        });

        card.addEventListener('click', function (e) {
            e.preventDefault();
            const source = video.querySelector('source');
            if (source) {
                window.open(source.src, '_blank');
            }
        });
    });

    // ---------- 图片卡片点击查看原图 ----------
    const imageCards = document.querySelectorAll('.design-card:not(.marketing-card)');
    imageCards.forEach(function (card) {
        const img = card.querySelector('.thumb-img');
        if (!img) return;

        card.style.cursor = 'pointer';
        card.addEventListener('click', function () {
            window.open(img.src, '_blank');
        });
    });

    // ---------- 画册排版双列分布 ----------
    function distributeBrochureItems() {
        const container = document.querySelector('#panel-brochure .projects-grid');
        if (!container) return;

        const items = Array.from(container.querySelectorAll('.project-card'));
        if (items.length === 0) return;

        container.innerHTML = '';

        const column1 = document.createElement('div');
        column1.className = 'column';
        const column2 = document.createElement('div');
        column2.className = 'column';

        items.forEach(function (item, index) {
            if (index % 2 === 0) {
                column1.appendChild(item);
            } else {
                column2.appendChild(item);
            }
        });

        container.appendChild(column1);
        container.appendChild(column2);
    }

    // ---------- 页面加载完成动画 ----------
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
        distributeBrochureItems();
    });
})();
