document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".hrresourec_dropdown_left li");
    const contents = document.querySelectorAll(".content-item");

    items.forEach((item, i) => {
        item.addEventListener("mouseenter", () => {
            items.forEach(li => li.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));
            item.classList.add("active");
            contents[i].classList.add("active");
        });
    });

    // One AI Page JS

    const openBtn = document.getElementById("openVideoBtn");
    const modal = document.getElementById("videoModalAi");
    const closeBtn = document.getElementById("closeBtnai");
    const video = document.getElementById("popupVideo");
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            modal.style.display = "flex";
            video.currentTime = 0;
            video.play();
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            video.pause();
            video.currentTime = 0;
        });
    }
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            video.pause();
            video.currentTime = 0;
        }
    });

    const videoai = document.getElementById('myVideoai');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            videoai.play();
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        });
    }
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            videoai.pause();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
        });
    }
    if (videoai) {
        videoai.addEventListener('ended', () => {
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
        });
    }
});

document.querySelectorAll('.mobile-version .has-content .li-head').forEach(head => {
    head.addEventListener('click', () => {
        const parent = head.parentElement;
        // close others
        document.querySelectorAll('.mobile-version .has-content').forEach(li => {
            if (li !== parent) li.classList.remove('active');
        });
        // toggle this one
        parent.classList.toggle('active');
    });
});

// Fix table of content JS and Mobile Popup of TOC
document.addEventListener("DOMContentLoaded", () => {

    const toc = document.querySelector('.hrone-blog-flex-item-posts-form');
    if (!toc || window.innerWidth > 767) return;

    const openBtnn = document.createElement('button');
    openBtnn.className = 'toc-toggle-btn';
    document.body.appendChild(openBtnn);


    const openImg = document.createElement('img');
    openImg.src = WPURLS.siteurl + '/wp-content/uploads/2026/01/plus-icon.png';
    openImg.alt = 'plus image';


    const openText = document.createElement('span');
    openText.className = 'toc-btn-text';
    openText.textContent = 'TOC';

    openBtnn.appendChild(openImg);
    openBtnn.appendChild(openText);


    const closeBtn = document.createElement('button');
    closeBtn.className = 'toc-close-btn';
    closeBtn.innerHTML = '&times;';
    toc.prepend(closeBtn);

    openBtnn.addEventListener('click', () => {
        toc.classList.add('mobile-active');
    });

    closeBtn.addEventListener('click', () => {
        toc.classList.remove('mobile-active');
    });
});

jQuery(document).ready(function ($) {
    // Top Bar slider JS
    $('.top-bar-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dots: false,
        pauseOnHover: true,
    });


    $(".read-more-btn").click(function () {

        const card = $(this).closest(".hrone-impact-grid-item");
        const text = card.find(".hrone-impact-grid-item-desc");

        text.toggleClass("expand");

        if (text.hasClass("expand")) {
            $(this).text("Read Less");
        } else {
            $(this).text("Read More");
        }

    });


    $('.chatgpt-btn').on('click', function () {
        var url = window.location.href;
        var text = "This blog seems insightful, can you read and summarise it so I can ask a few questions?\n\n" + url;
        var chatgptUrl = "https://chat.openai.com/?q=" + encodeURIComponent(text);
        window.open(chatgptUrl, '_blank');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }

    });

    // podcast tab slider
    function initTabSlider() {
        var totalItems = $('.tab-slider li').length;

        if (!$('.tab-slider').hasClass('slick-initialized')) {
            $('.tab-slider').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: false,
                swipeToSlide: true,
                arrows: true,
                prevArrow: `
                            <svg xmlns="http://www.w3.org/2000/svg" class="cur-prev" width="44" height="44" viewBox="0 0 44 44" fill="none">
                                <circle cx="21.8631" cy="21.8631" r="21.8631" fill="#1E6955"></circle>
                                <path d="M24.5971 30.062L16.3984 21.8633L24.5971 13.6647" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                    `,

                nextArrow: `
                        <svg xmlns="http://www.w3.org/2000/svg" class="cur-nxt" width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <circle cx="21.8631" cy="21.8631" r="21.8631" fill="#1E6955"></circle>
                            <path d="M20.4918 30.062L28.6905 21.8633L20.4918 13.6647" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    `,

                initialSlide: totalItems - 3
            });
        }
        else {
            if ($('.tab-slider').hasClass('slick-initialized')) {
                $('.tab-slider').slick('unslick');
            }
        }
    }

    initTabSlider();

    $(window).on('resize', function () {
        initTabSlider();
    });


    // hr software product scroll js
    $('.payroll-management-parent-child').click(function () {
        var relValue = $(this).attr('rel');
        var section = $('section[data-scroll="' + relValue + '"]');
        if (section.length) {
            $('html, body').animate({
                scrollTop: section.offset().top - 100
            }, 800);
        }
    });

    // home workplace tab js
    $('.workplace-tab').on('click', function () {
        let index = $(this).data('slide');

        $('.rev_slider').slick('slickGoTo', index);

        $('.workplace-tab').removeClass('active');
        $(this).addClass('active');
    });

    // Slide change → update active tab
    $('.rev_slider').on('afterChange', function (event, slick, currentSlide) {
        $('.workplace-tab').removeClass('active');
        $('.workplace-tab[data-slide="' + currentSlide + '"]').addClass('active');
    });


    // Navigation on in click
    $('.main-header .nav-ul li').click(function (e) {
        e.stopPropagation();

        $('.main-header .nav-ul li').not(this).removeClass('active');

        $(this).toggleClass('active');
    });
    $(document).click(function () {
        $('.main-header .nav-ul li').removeClass('active');
    });

    // Hide and show mobile request demno button on scroll
    $('.request_demo').addClass('hide');

    $(window).on('scroll', function () {
        if ($(window).scrollTop() >= 600) {
            $('.request_demo').removeClass('hide').addClass('show');
        } else {
            $('.request_demo').removeClass('show').addClass('hide');
        }
    });

});

$(window).on('load', function () {

    var slider = $('.hrresource-listblog-main');

    if (slider.hasClass('slick-initialized')) {
        slider.slick('unslick');
    }

    slider.slick({
        slidesToShow: 3,
        arrows: true,
        prevArrow: `<button class="slick-prev">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="21.8631" cy="21.8631" r="21.8631" fill="#1E6955" />
                <path d="M24.5971 30.062L16.3984 21.8633L24.5971 13.6647" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>`,
        nextArrow: `<button class="slick-next">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="21.8631" cy="21.8631" r="21.8631" fill="#1E6955" />
                <path d="M20.4918 30.062L28.6905 21.8633L20.4918 13.6647" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>`,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    arrows: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

});
