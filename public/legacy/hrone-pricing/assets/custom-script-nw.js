jQuery(document).ready(function ($) {

    const $modal = $('#partnerWPfstmodal');

    // Stop if modal doesn't exist on page
    if (!$modal.length) return;

    // OPEN MODAL
    $("#partnerWPfstbtn, #partnerWPfstbtn1, #partnerWPfstbtn2, #partnerWPfstbtn3").on('click', function () {
        $modal.fadeIn();
        $('body').addClass('scroll-hidden');
    });

    // CLOSE MODAL (X button)
    $(document).on('click', '#partnerWPfstmodal .close', function () {
        $modal.fadeOut();
        $('body').removeClass('scroll-hidden');
    });

});

jQuery(document).ready(function ($) {

    const $modal = $('#partnersocialmodal');

    // Stop if modal doesn't exist on page
    if (!$modal.length) return;

    // OPEN MODAL (event delegation - works for multiple buttons with same id)
    $(document).on('click', '[id="partnersocial"]', function () {
        $modal.fadeIn();
        $('body').addClass('scroll-hidden');
    });

    // CLOSE MODAL (X button)
    $(document).on('click', '#partnersocialmodal .close', function () {
        $modal.fadeOut();
        $('body').removeClass('scroll-hidden');
    });

});
