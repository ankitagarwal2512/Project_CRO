document.addEventListener('DOMContentLoaded', function () {
    // Home Templates slider 1
    const scrollContainer = document.getElementById('scrollContainerVertical');
    const scrollSpeed = 0.5;

    if (!scrollContainer) return;
    function cloneItems(container) {
        const items = container.querySelectorAll('.template-card');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            container.appendChild(clone);
        });
    }

    cloneItems(scrollContainer);

    function autoScroll() {
        if (scrollContainer.scrollTop >= (scrollContainer.scrollHeight / 2)) {
            scrollContainer.scrollTop = 0;
        }
        scrollContainer.scrollTop += scrollSpeed;
        requestAnimationFrame(autoScroll);
    }

    autoScroll();

    // Hr Commune image slides
    const scrollContainerone = document.querySelector('.awesome-experience-scroll');
    scrollContainer.innerHTML += scrollContainerone.innerHTML;

    // Home Templates slider 2 
    const scrollContainerUp = document.getElementById('scrollContainerUp');
    const scrollSpeed1 = 0.5; // adjust speed

    if (!scrollContainerUp) return;

    function cloneItems(container) {
        const items = container.querySelectorAll('.template-card');
        items.forEach(item => {
            const clone = item.cloneNode(true);
            container.appendChild(clone);
        });
    }

    cloneItems(scrollContainerUp);

    scrollContainerUp.scrollTop = scrollContainerUp.scrollHeight / 2;

    function autoScrollUp() {
        if (scrollContainerUp.scrollTop <= 0) {
            scrollContainerUp.scrollTop = scrollContainerUp.scrollHeight / 2;
        }
        scrollContainerUp.scrollTop -= scrollSpeed1;
        requestAnimationFrame(autoScrollUp);
    }

    autoScrollUp();
});

jQuery(document).ready(function ($) {

    // Home community slider
    $('.community-slick-slider').slick({
        slidesToShow: 6,
        slidesToScroll: 3,
        arrows: true,
        dots: false,
        autoplay: true,
        autoplaySpeed: 3000,
    });

    // commune home page slider
    $('.left_commune_slide').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dots: false,
        infinite: true,
        speed: 500,
        pauseOnHover: true,
    });

});