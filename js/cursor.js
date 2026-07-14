/* ========================================
   自定义光标 - 鼠标跟随与悬停变形
   ======================================== */
(function () {
    'use strict';

    // 移动端不启用
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    // 鼠标移动监听
    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // 小圆点即时跟随
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // 大圆环平滑插值跟随
    function animateRing() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // 鼠标离开页面时隐藏
    document.addEventListener('mouseleave', function () {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

    // 鼠标按下时缩小
    document.addEventListener('mousedown', function () {
        ring.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    document.addEventListener('mouseup', function () {
        ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // 悬停可交互元素时变形
    const hoverSelector = '[data-cursor="hover"], a, button';
    const viewSelector = '[data-cursor="view"]';

    document.querySelectorAll(hoverSelector).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            ring.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', function () {
            ring.classList.remove('cursor-hover');
        });
    });

    document.querySelectorAll(viewSelector).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            ring.classList.add('cursor-view');
        });
        el.addEventListener('mouseleave', function () {
            ring.classList.remove('cursor-view');
        });
    });

    // 动态添加的元素也支持(委托)
    document.body.addEventListener('mouseenter', function (e) {
        const target = e.target;
        if (target.matches && target.matches(hoverSelector)) {
            ring.classList.add('cursor-hover');
        }
        if (target.matches && target.matches(viewSelector)) {
            ring.classList.add('cursor-view');
        }
    }, true);

    document.body.addEventListener('mouseleave', function (e) {
        const target = e.target;
        if (target.matches && target.matches(hoverSelector)) {
            ring.classList.remove('cursor-hover');
        }
        if (target.matches && target.matches(viewSelector)) {
            ring.classList.remove('cursor-view');
        }
    }, true);
})();
