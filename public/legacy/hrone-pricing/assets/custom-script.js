var maxWidth = 100; // Adjust as needed
var maxHeight = 100;

var companyLogoBase64 = '';
var letterHeadBase64 = '';

var loadFile = function (event) {

    var output = document.getElementById('complany_logo');
    var outputimage = document.getElementById('logo');
    var file = event.target.files[0];

    if (!file) return false;

    var allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
        alert('Invalid file type! Please upload only PNG, JPEG, or WebP images.');
        outputimage.value = '';
        return false;
    }

    if (file.size > (1 * 1024 * 1024)) {
        alert('File size exceeds the limit of 1 MB.');
        outputimage.value = '';
        return false;
    }

    var reader = new FileReader();

    reader.onload = function (e) {

        companyLogoBase64 = e.target.result;

        output.src = companyLogoBase64;

        $('.selected-image').text(file.name);

    };

    reader.readAsDataURL(file);
};
var loadHeadFile = function (event) {

    var output = document.getElementById('letter_head_img');
    var file = event.target.files[0];

    if (!file) return false;

    var allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
        alert('Invalid file type! Please upload only PNG, JPEG, or WebP images.');
        event.target.value = '';
        return false;
    }

    if (file.size > (1 * 1024 * 1024)) {
        alert('File size exceeds the limit of 1 MB.');
        event.target.value = '';
        return false;
    }

    var reader = new FileReader();

    reader.onload = function (e) {

        letterHeadBase64 = e.target.result;

        output.src = letterHeadBase64;

    };

    reader.readAsDataURL(file);
};


$(document).ready(function () {
    $(".datepicker").datepicker({
        onSelect: function () {
            var inputId = $(this).attr("id");
            // console.log(inputId.replace('_', ''));
            $("." + inputId.replace('_', '')).text($(this).val());

        }
    });
    $(".form-control").keyup(function () {
        var inputId = $(this).attr("id");
        $("." + inputId.replace('_', '')).text($(this).val());
    });

    $('#doc_req').select2({
        closeOnSelect: false,
        placeholder: "Select Documents Required for Joining",
        allowHtml: true,
        allowClear: true,
        tags: true,
        width: '100%',
    });
});

jQuery(document).ready(function ($) {
    $("#work_email").keyup(function () {
        var email = $('#work_email').val();
        var fields = email.split('@');
        if ((fields[1] == 'gmail.com' || fields[1] == 'yopmail.com')) {
            $('#work_email').val('');
            $('.work_email_error').html('Please enter valid work email.');
        } else {
            $('.work_email_error').html('');
        }
    });


    //     console.log("PDF FORM SUBMITTED");
    //     e.preventDefault();
    //     var formData = new FormData(this);
    //     formData.append('action', 'custom_letter_generator');
    //     formData.append('security', hroneAjaxSecurity.letter_generator);
    //     $.ajax({
    //         url: admin_url.ajaxUrl,
    //         type: 'POST',
    //         data: formData,
    //         beforeSend: function () {
    //             $("#submit-btn").html('Wait....');
    //         },
    //         success: function (response) {

    //             if (response.success === true) {
    //                 $("#customModal").fadeOut();
    //                 if (response.data.pdf_base64 && response.data.pdf_filename) {
    //                     var byteCharacters = atob(response.data.pdf_base64);
    //                     var byteNumbers = new Array(byteCharacters.length);
    //                     for (var i = 0; i < byteCharacters.length; i++) {
    //                         byteNumbers[i] = byteCharacters.charCodeAt(i);
    //                     }
    //                     var byteArray = new Uint8Array(byteNumbers);
    //                     var blob = new Blob([byteArray], { type: 'application/pdf' });
    //                     var url = window.URL.createObjectURL(blob);
    //                     var a = document.createElement('a');
    //                     a.href = url;
    //                     a.download = response.data.pdf_filename;
    //                     document.body.appendChild(a);
    //                     a.click();
    //                     document.body.removeChild(a);

    //                     window.URL.revokeObjectURL(url);
    //                 } else if (response.data.pdf_url) {

    //                     var a = document.createElement('a');
    //                     a.href = response.data.pdf_url;
    //                     a.download = 'generated_pdf.pdf';
    //                     document.body.appendChild(a);
    //                     a.click();
    //                     document.body.removeChild(a);
    //                 }

    //                 document.getElementById('offerForm').reset();
    //             } else {
    //                 if (response.data == 'Image dimensions must be within 300x200 pixels.') {
    //                     $(".pdf_for_error").html(response.data);
    //                     $('html, body').animate({
    //                         scrollTop: ($('.pdf_for_error').offset().top - 300)
    //                     }, 2000);
    //                     $("#customModal").fadeOut();
    //                 } else {
    //                     $("#customModal").fadeOut();
    //                     for (var key in response.data) {
    //                         var errorMessage = response.data[key][0];
    //                         $("." + key).html(errorMessage);
    //                     }
    //                 }
    //             }

    //             $("#submit-btn").html('<i class="fa fa-download" aria-hidden="true"></i> Download');
    //         },
    //         cache: false,
    //         contentType: false,
    //         processData: false,
    //     });
    // });






    // Prevent form from submitting normally (CSP compliance)
    $("#popupDownload").on("submit", function (e) {
        e.preventDefault();
        return false;
    });

    $("#openModalBtn").click(function () {
        $("#customModal").fadeIn();
    });

    $(".close").click(function () {
        $("#customModal").fadeOut();
        $("#partnerWPfstmodal").fadeOut();
    });

    // Close the modal if the overlay is clicked
    $(window).click(function (e) {
        if ($(e.target).is("#customModal")) {
            $("#customModal").fadeOut();
        }
    });

    // 🔓 Utility functions
    function openModal(modalId) {
        $(modalId).fadeIn();
        $('body').addClass('scroll-hidden');
    }

    function closeAllModals() {
        $('.modal').fadeOut();
        $('body').removeClass('scroll-hidden');
    }

    $('#requestJoin').on('click', function (e) {
        if (!e.isTrusted) return;
        openModal('#requestJoinModel');
    });

    // ❌ One close handler ONLY
    $('.close').on('click', function () {
        closeAllModals();
    });


});

// Validate Company Phone Number
$('#company_contactno').on('input', function () {
    var phoneNum = $(this).val();
    // Remove non-numeric characters
    phoneNum = phoneNum.replace(/\D/g, '');
    // Ensure the phone number starts with 6, 7, 8, or 9
    if (/^[6-9]/.test(phoneNum)) {
        // Limit the phone number to 10 digits
        phoneNum = phoneNum.slice(0, 10);
        $(this).removeClass('error');
        $('.phone_error').html('');
    } else {
        // If the number doesn't start with 6, 7, 8, or 9, clear the input
        phoneNum = '';
        $(this).addClass('error');
        $('.phone_error').html('Insert valid number start from 6/7/8/9');

    }
    // Update the input value
    $(this).val(phoneNum);
});

// Validate Phone Number
$('#phone_number').on('input', function () {
    var phoneNum = $('#phone_number').val();
    phoneNum = phoneNum.replace(/\D/g, '');
    if (/^[6-9]/.test(phoneNum)) {
        phoneNum = phoneNum.slice(0, 10);
        $('#phone_number').removeClass('error');
        $('.phone_number_error').html('');
    } else {
        phoneNum = '';
        $('#phone_number').addClass('error');
        $('.phone_number_error').html('Insert valid number start from 6/7/8/9');

    }
    $('#phone_number').val(phoneNum);
});


$(document).ready(function () {
    function captureAllFormData(formId) {
        const formData = {};
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="number"]');
            inputs.forEach(input => {
                formData[input.name] = input.value;
            });
        } else {
            // console.error('Form not found with ID:', formId);
        }
        return formData;
    }
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale;
    var animating;


    var baseDomains = [];
    var baseDomainsLoaded = false;
    function loadBaseDomains() {
        var rootUrl = WPURLS.siteurl;
        var fileUrl = rootUrl + '/basedomain.txt';

        return $.get(fileUrl).then(function (data) {
            baseDomains = data.split('\n').map(function (domain) {
                return domain.trim().toLowerCase();
            });
            baseDomainsLoaded = true;
            $(".next-step").prop("disabled", false);
        }).fail(function () {
            //console.error('Failed to load base domains file.');
        });
    }
    loadBaseDomains();
    // Function to validate the email
    function validateEmail(email) {
        var atIndex = email.indexOf('@');
        var dotIndex = email.lastIndexOf('.');
        if (atIndex === -1 || dotIndex === -1 || atIndex > dotIndex) {
            isValid = false;
            return false;
        }

        var domain = email.slice(atIndex + 1).toLowerCase();

        // List of accepted TLDs
        var acceptedTLDs = [
            'com', 'shop', 'life', 'us', 'ai', 'biz', 'name', 'in', 'ca', 'co.in', 'net', 'org', 'edu', 'ac.in',
            'one', 'online', 'cloud', 'tech', 'co', 'info', 'world', 'io', 'com.au', 'au', 'eu',

            // Additional commonly used TLDs
            'me', 'app', 'dev', 'xyz', 'site', 'store', 'digital', 'media', 'live', 'news', 'club',
            'space', 'agency', 'solutions', 'website', 'tools', 'software', 'design', 'academy', 'cafe', 'care', 'bike', 'bio',

            // Additional ccTLDs and second-level ccTLDs
            'uk', 'co.uk', 'org.uk', 'gov.uk', 'nz', 'de', 'fr', 'it', 'es', 'nl', 'ch', 'jp', 'kr', 'cn',
            'gov.in', 'org.in', 'net.au', 'org.au'
        ];
        if (
            email.trim() === '' ||
            isNotAcceptedDomain(domain) ||
            !validateDomainStructure(domain, acceptedTLDs) ||
            email.includes('..')
        ) {

            return false;
        } else {
            return true;
        }
    }
    function isNotAcceptedDomain(domain) {
        return baseDomains.some(function (baseDomain) {
            // Check if the domain starts with or matches the base domain
            var domainParts = domain.split('.');
            return domainParts[0] === baseDomain;
        });
    }

    function validateDomainStructure(domain, acceptedTLDs) {
        var domainRegex = /^[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!domainRegex.test(domain) || domain.includes('..')) {
            return false;
        }
        // Check if TLD is in the accepted list
        var tld = domain.split('.').pop();
        return acceptedTLDs.indexOf(tld) !== -1;
    }

    // Function to load the base domains from the file
    $(".next-step-PPC").click(function (e) {
        e.preventDefault(); // Prevent form submission
        var formId = $(this).closest("form").attr("id");

        const formData = captureAllFormData(formId);
        var current_fs = $(this).parent();
        var next_fs = $(this).parent().next();
        var isValid = true;
        // Check if base domains are loaded
        if (!baseDomainsLoaded) {
            $('.email_error').html('Please wait while the email domains are being loaded. Try again.');
            isValid = false;
        }
        // Check for empty fields and mark them with an error class
        current_fs.find("input[type='text'], input[type='email']").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // Check email validation only if the current fieldset contains email input
        if (current_fs.find("#ppc_email").length > 0) {
            var email = $('#ppc_email').val().trim().toLowerCase();
            if (!validateEmail(email)) {
                isValid = false;
                $('.email_error').html('Invalid Email Format');
                $('#ppc_email').addClass('error');

            } else {
                $('#ppc_email').removeClass('error');
                $('.email_error').html('');
            }
        }
        // Load the base domains before allowing any form submission
        loadBaseDomains();
        if (current_fs.find("#phone_ppc").length > 0) {
            var phoneNum = $('#phone_ppc').val();
            // Remove non-numeric characters
            phoneNum = phoneNum.replace(/\D/g, '');
            // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 2 to 10 digits
            if (/^[6-9]\d{1,9}$/.test(phoneNum)) {
                // Limit the phone number to 10 digits
                phoneNum = phoneNum.slice(0, 10);
                // Check if the phone number length is less than 10
                if (phoneNum.length < 10) {
                    $('#phone_ppc').addClass('error');
                    isValid = false;
                    $('.phone_error_PPC').html('Phone number must be exactly 10 digits long');
                } else {
                    $('#phone_ppc').removeClass('error');
                    $('.phone_error_PPC').html('');
                }
            } else {
                // If the number doesn't start with 6, 7, 8, or 9, clear the input
                phoneNum = '';
                isValid = false;
                $('#phone_ppc').addClass('error');
                $('.phone_error_PPC').html('Insert a valid number starting with 6/7/8/9');
            }
        }
        var form = document.getElementById(formId);
        var no_of_employee_exists = form.querySelector('#no_of_employee') !== null;
        if (no_of_employee_exists) {
            var no_of_employee_field = $('#no_of_employee');
            if (no_of_employee_field.length > 0) {
                var no_of_employee = no_of_employee_field.val();
                if (!no_of_employee) {
                    isValid = false;
                    no_of_employee_field.addClass('error');
                    $('.employee_error').html('Please select the number of employees.');
                } else {
                    no_of_employee_field.removeClass('error');
                    $('.employee_error').html('');
                }
            }
        }
        // Proceed to the next step if all validations pass
        if (isValid) {
            $("#progressbar li.active").last().addClass("completed");
            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            var curr_val = $('#progBar').val();
            var new_val = Number(curr_val) + 33;
            $('#progBar').attr('value', new_val);
            $("#progBar").css('width', new_val + '%');

            // Show the next fieldset
            next_fs.show();
            // Hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // For making fieldset appear animation
                    opacity = 1 - now;
                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
        }
    });

    $(".next-step").click(function (e) {
        e.preventDefault(); // Prevent form submission
        var formId = $(this).closest("form").attr("id");

        const formData = captureAllFormData(formId);
        var current_fs = $(this).parent();
        var next_fs = $(this).parent().next();
        var isValid = true;
        // Check if base domains are loaded
        if (!baseDomainsLoaded) {
            $('.email_error').html('Please wait while the email domains are being loaded. Try again.');
            isValid = false;
        }


        current_fs.find("input[type='text']:not(#company_website), input[type='file'], input[type='email'], textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // Validate number fields like CTC
        current_fs.find("input[type='number']").each(function () {

            const inputId = $(this).attr('id');
            const inputValue = $(this).val().trim();

            // Required number fields
            if ($(this).prop('required') && inputValue === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }

            // Specific validation for CTC fields
            if (
                inputId === 'ctc_total' ||
                inputId === 'ctc_fixed' ||
                inputId === 'ctc_veri'
            ) {

                if (
                    inputValue === '' ||
                    isNaN(inputValue) ||
                    Number(inputValue) <= 0
                ) {
                    isValid = false;
                    $(this).addClass('error');
                } else {
                    $(this).removeClass('error');
                }
            }
        });
        // Check email validation only if the current fieldset contains email input
        if (current_fs.find("#official_email").length > 0) {
            var email = $('#official_email').val().trim().toLowerCase();
            if (!validateEmail(email)) {
                isValid = false;
                $('.email_error').html('Invalid Email Format');
                $('#official_email').addClass('error');

            } else {
                $('#official_email').removeClass('error');
                $('.email_error').html('');
            }
        }

        // Initially disable the next-step button
        $(".next-step").prop("disabled", true);

        // Load the base domains before allowing any form submission
        loadBaseDomains();

        if (current_fs.find("#popup_phone_nu").length > 0) {
            var phoneNum = $('#popup_phone_nu').val();
            // Remove non-numeric characters
            phoneNum = phoneNum.replace(/\D/g, '');
            // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 2 to 10 digits
            if (/^[6-9]\d{1,9}$/.test(phoneNum)) {
                // Limit the phone number to 10 digits
                phoneNum = phoneNum.slice(0, 10);
                // Check if the phone number length is less than 10
                if (phoneNum.length < 10) {
                    $('#popup_phone_nu').addClass('error');
                    isValid = false;
                    $('.popup_phone_error').html('Phone number must be exactly 10 digits long');
                } else {
                    $('#popup_phone_nu').removeClass('error');
                    $('.popup_phone_error').html('');
                }
            } else {
                // If the number doesn't start with 6, 7, 8, or 9, clear the input
                phoneNum = '';
                isValid = false;
                $('#popup_phone_nu').addClass('error');
                $('.popup_phone_error').html('Insert a valid number starting with 6/7/8/9');
            }
        }
        var form = document.getElementById(formId);
        var phoneNuElement = form.querySelector('#phone_nu');
        if (phoneNuElement !== null) {
            var phoneNum = $('#phone_nu').val();
            // Remove non-numeric characters
            phoneNum = phoneNum.replace(/\D/g, '');
            // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 10 digits
            if (/^[6-9]\d{9}$/.test(phoneNum)) {
                // Limit the phone number to 10 digits
                phoneNum = phoneNum.slice(0, 10);
                $('#phone_nu').removeClass('error');
                $('.phone_error').html('');
            } else {
                $('#phone_nu').addClass('error');
                isValid = false;
                if (phoneNum.length < 10) {
                    $('.phone_error').html('Phone number must be exactly 10 digits long');
                } else {
                    $('.phone_error').html('Insert a valid number starting with 6/7/8/9');
                }
            }
        }

        // Check email validation only if the current fieldset contains email input
        if (current_fs.find("#popup_official_email").length > 0) {
            var email = $('#popup_official_email').val().trim().toLowerCase();
            if (!validateEmail(email)) {
                isValid = false;
                $('#popup_official_email').addClass('error');
                $('.pop_email_error').html('Please enter a valid work email.');
            } else {
                $('#popup_official_email').removeClass('error');
                $('.pop_email_error').html('');
            }
        }

        var form = document.getElementById(formId);
        var no_of_employee_exists = form.querySelector('#no_of_employee') !== null;
        if (no_of_employee_exists) {
            var no_of_employee_field = $('#no_of_employee');
            if (no_of_employee_field.length > 0) {
                var no_of_employee = no_of_employee_field.val();
                if (!no_of_employee) {
                    isValid = false;
                    no_of_employee_field.addClass('error');
                    $('.employee_error').html('Please select the number of employees.');
                } else {
                    no_of_employee_field.removeClass('error');
                    $('.employee_error').html('');
                }
            }
        }

        var no_of_employee_exists = form.querySelector('#popup_no_of_employee') !== null;
        if (no_of_employee_exists) {
            var no_of_employee_field = $('#popup_no_of_employee');
            if (no_of_employee_field.length > 0) {
                var no_of_employee = no_of_employee_field.val();
                if (!no_of_employee) {
                    isValid = false;
                    no_of_employee_field.addClass('error');
                    $('.popup_employee_error').html('Please select the number of employees.');
                } else {
                    no_of_employee_field.removeClass('error');
                    $('.popup_employee_error').html('');
                }
            }
        }
        // Proceed to the next step if all validations pass
        if (isValid) {
            $("#progressbar li.active").last().addClass("completed");
            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            var curr_val = $('#progBar').val();
            var new_val = Number(curr_val) + 33;
            $('#progBar').attr('value', new_val);
            $("#progBar").css('width', new_val + '%');

            // Show the next fieldset
            next_fs.show();
            // Hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // For making fieldset appear animation
                    opacity = 1 - now;
                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
        }
    });

    $(".next-step-generator").click(function (e) {
        e.preventDefault(); // Prevent form submission
        var formId = $(this).closest("form").attr("id");

        const formData = captureAllFormData(formId);
        var current_fs = $(this).parent();
        var next_fs = $(this).parent().next();
        var isValid = true;

        // Check if base domains are loaded
        if (!baseDomainsLoaded) {
            $('.email_error').html('Please wait while the email domains are being loaded. Try again.');
            isValid = false;
        }
        // Check for empty fields and mark them with an error class
        current_fs.find("input[type='text'], input[type='email'],input, select, input[id='emp_accountNumber'],input[id='basic_salary']").each(function () {
            var inputId = $(this).attr("id");
            var inputValue = $(this).val().trim();

            if (inputValue === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
            if (inputId === 'emp_accountNumber') {
                // Validate account number (minimum 6 digits, only numbers allowed)
                if (!/^\d{6,}$/.test(inputValue)) {
                    isValid = false;
                    $(this).addClass('error');
                    $('.account_number_error').html('Account number must be at least 6 digits and contain only numbers.');
                } else {
                    $(this).removeClass('error');
                    $('.account_number_error').html('');
                }
            }
        });
        // Check email validation only if the current fieldset contains email input
        if (current_fs.find("#official_email").length > 0) {
            var email = $('#official_email').val().trim().toLowerCase();
            if (!validateEmail(email)) {
                isValid = false;
                $('.email_error').html('Invalid Email Format');
                $('#official_email').addClass('error');

            } else {
                $('#official_email').removeClass('error');
                $('.email_error').html('');
            }
        }

        // Initially disable the next-step button
        $(".next-step").prop("disabled", true);

        // Load the base domains before allowing any form submission
        loadBaseDomains();

        if (current_fs.find("#popup_phone_nu").length > 0) {
            var phoneNum = $('#popup_phone_nu').val();
            // Remove non-numeric characters
            phoneNum = phoneNum.replace(/\D/g, '');
            // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 2 to 10 digits
            if (/^[6-9]\d{1,9}$/.test(phoneNum)) {
                // Limit the phone number to 10 digits
                phoneNum = phoneNum.slice(0, 10);
                // Check if the phone number length is less than 10
                if (phoneNum.length < 10) {
                    $('#popup_phone_nu').addClass('error');
                    isValid = false;
                    $('.popup_phone_error').html('Phone number must be exactly 10 digits long');
                } else {
                    $('#popup_phone_nu').removeClass('error');
                    $('.popup_phone_error').html('');
                }
            } else {
                // If the number doesn't start with 6, 7, 8, or 9, clear the input
                phoneNum = '';
                isValid = false;
                $('#popup_phone_nu').addClass('error');
                $('.popup_phone_error').html('Insert a valid number starting with 6/7/8/9');
            }
        }
        var form = document.getElementById(formId);
        var phoneNuElement = form.querySelector('#phone_nu');
        if (phoneNuElement !== null) {
            var phoneNum = $('#phone_nu').val();
            // Remove non-numeric characters
            phoneNum = phoneNum.replace(/\D/g, '');
            // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 10 digits
            if (/^[6-9]\d{9}$/.test(phoneNum)) {
                // Limit the phone number to 10 digits
                phoneNum = phoneNum.slice(0, 10);
                $('#phone_nu').removeClass('error');
                $('.phone_error').html('');
            } else {
                $('#phone_nu').addClass('error');
                isValid = false;
                if (phoneNum.length < 10) {
                    $('.phone_error').html('Phone number must be exactly 10 digits long');
                } else {
                    $('.phone_error').html('Insert a valid number starting with 6/7/8/9');
                }
            }
        }

        // Check email validation only if the current fieldset contains email input
        if (current_fs.find("#popup_official_email").length > 0) {
            var email = $('#popup_official_email').val().trim().toLowerCase();
            if (!validateEmail(email)) {
                isValid = false;
                $('#popup_official_email').addClass('error');
                $('.pop_email_error').html('Please enter a valid work email.');
            } else {
                $('#popup_official_email').removeClass('error');
                $('.pop_email_error').html('');
            }
        }
        const ctc_total_FieldExists = Object.keys(formData).some(key => {
            const input = document.querySelector(`form input[name="${key}"]`);
            return input.name === 'ctc_total';
        });
        var form = document.getElementById(formId);
        var no_of_employee_exists = form.querySelector('#no_of_employee') !== null;
        if (no_of_employee_exists) {
            var no_of_employee_field = $('#no_of_employee');
            if (no_of_employee_field.length > 0) {
                var no_of_employee = no_of_employee_field.val();
                if (!no_of_employee) {
                    isValid = false;
                    no_of_employee_field.addClass('error');
                    $('.employee_error').html('Please select the number of employees.');
                } else {
                    no_of_employee_field.removeClass('error');
                    $('.employee_error').html('');
                }
            }
        }

        var no_of_employee_exists = form.querySelector('#popup_no_of_employee') !== null;
        if (no_of_employee_exists) {
            var no_of_employee_field = $('#popup_no_of_employee');
            if (no_of_employee_field.length > 0) {
                var no_of_employee = no_of_employee_field.val();
                if (!no_of_employee) {
                    isValid = false;
                    no_of_employee_field.addClass('error');
                    $('.popup_employee_error').html('Please select the number of employees.');
                } else {
                    no_of_employee_field.removeClass('error');
                    $('.popup_employee_error').html('');
                }
            }
        }
        var no_of_employee_exists_auto = form.querySelector('#autopopup_no_of_employee') !== null;
        if (no_of_employee_exists_auto) {
            var no_of_employee_field = $('#autopopup_no_of_employee');
            if (no_of_employee_field.length > 0) {
                var no_of_employee = no_of_employee_field.val();
                if (!no_of_employee) {
                    isValid = false;
                    no_of_employee_field.addClass('error');
                    $('.popup_employee_error').html('Please select the number of employees.');
                } else {
                    no_of_employee_field.removeClass('error');
                    $('.popup_employee_error').html('');
                }
            }
        }
        // Proceed to the next step if all validations pass
        if (isValid) {
            $("#progressbar li.active").last().addClass("completed");
            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            var curr_val = $('#progBar').val();
            var new_val = Number(curr_val) + 33;
            $('#progBar').attr('value', new_val);
            $("#progBar").css('width', new_val + '%');

            // Show the next fieldset
            next_fs.show();
            // Hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // For making fieldset appear animation
                    opacity = 1 - now;
                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
        }
    });

    $(".next-step-invoicegenerator").click(function (e) {
        e.preventDefault(); // Prevent form submission
        var formId = $(this).closest("form").attr("id");
        var state = $('#inputinvoicesender_boxcity').attr('data-state');
        var states = $('#inputinvoicereciever_boxcity').attr('data-state');
        const formData = captureAllFormData(formId);
        var current_fs = $(this).parent();
        var next_fs = $(this).parent().next();
        var isValid = true;


        // Check for empty fields and mark them with an error class
        current_fs.find("input[required], select[required], textarea[required]").each(function () {

            if (!$(this).is(':visible')) {
                return true;
            }

            let value = $(this).val();
            value = value ? value.toString().trim() : '';

            if (value === '') {

                isValid = false;
                $(this).addClass('error');

            } else {

                $(this).removeClass('error');
            }
        });



        // Load the base domains before allowing any form submission
        if (typeof loadBaseDomains === 'function') {
            loadBaseDomains();
        }

        function validatePhoneNumber(phoneNumberSelector, errorSelector) {
            var phoneNum = $(phoneNumberSelector).val();
            phoneNum = phoneNum.replace(/\D/g, '');

            if (/^[6-9]\d{1,9}$/.test(phoneNum)) {
                phoneNum = phoneNum.slice(0, 10);
                if (phoneNum.length < 10) {
                    $(phoneNumberSelector).addClass('error');
                    $(errorSelector).html('Phone number must be exactly 10 digits long');
                    return false;
                } else {
                    $(phoneNumberSelector).removeClass('error');
                    $(errorSelector).html('');
                    return true;
                }
            } else {
                $(phoneNumberSelector).addClass('error');
                $(errorSelector).html('Insert a valid number starting with 6/7/8/9');
                return false;
            }
        }

        // Validate phone numbers
        if (current_fs.find('#company_contact').length > 0) {
            isValid = validatePhoneNumber('#company_contact', '.phone_error') && isValid;
        }

        if (current_fs.find('#receiver_phone').length > 0) {
            isValid = validatePhoneNumber('#receiver_phone', '.phone_error') && isValid;
        }

        function validateZipCode(zipCodeSelector, errorSelector) {
            var zipCode = $(zipCodeSelector).val();
            var zipcodeError = $(errorSelector);

            if (/^\d{6}$/.test(zipCode)) {
                zipcodeError.hide();
                $(zipCodeSelector).removeClass('error');
                zipcodeError.html('');
                return true;
            } else {
                zipcodeError.show();
                $(zipCodeSelector).addClass('error');
                zipcodeError.html('Invalid ZIP Code. Must be 6 digits (0-9).');
                return false;
            }
        }
        // Validate ZIP codes
        if (current_fs.find('#company_addressZipcode').length) {
            isValid = validateZipCode('#company_addressZipcode', '.Zipcode-error') && isValid;
        }

        if (current_fs.find('#receiver_zipcode').length) {
            isValid = validateZipCode('#receiver_zipcode', '.Zipcode-error') && isValid;
        }



        // Function to validate city input
        function validateCity(inputElement) {

            if (typeof availableKeywords === 'undefined') {
                return true;
            }

            const inputCity = $(inputElement).val().trim();

            const cityExists = availableKeywords.some(function (item) {
                return item.city === inputCity;
            });

            if (!cityExists) {
                $(inputElement).addClass('error');
                return false;
            }

            $(inputElement).removeClass('error');
            return true;
        }

        // Validate city fields in the current step
        if (current_fs.find("#inputinvoicesender_boxcity").length > 0) {
            isValid = validateCity("#inputinvoicesender_boxcity") && isValid;
        }

        if (current_fs.find("#inputinvoicereciever_boxcity").length > 0) {
            isValid = validateCity("#inputinvoicereciever_boxcity") && isValid;
        }

        // --- GST Number Validation
        function validateGstNumber(gstNumberSelector) {

            var gstNumber = $(gstNumberSelector).val().trim().toUpperCase();

            const gstRegex =
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

            if (gstNumber === '') {

                $(gstNumberSelector).addClass('error');

                $('.gst-error').html('GST Number is required');

                return false;

            } else if (gstRegex.test(gstNumber)) {

                $(gstNumberSelector).removeClass('error');

                $('.gst-error').html('');

                return true;

            } else {

                $(gstNumberSelector).addClass('error');

                $('.gst-error').html(
                    'Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)'
                );

                return false;
            }
        }

        // --- PAN Number Validation
        function validatePanNumber(panNumberSelector, errorSelector) {

            var panNumber = $(panNumberSelector).val().trim().toUpperCase();
            var panError = $(errorSelector);

            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

            if (panNumber === '') {

                $(panNumberSelector).addClass('error');

                if ($(errorSelector).length) {
                    panError.show().html('PAN Number is required');
                }

                return false;
            }

            if (panRegex.test(panNumber)) {

                $(panNumberSelector).removeClass('error');

                if ($(errorSelector).length) {
                    panError.hide().html('');
                }

                return true;
            }

            $(panNumberSelector).addClass('error');

            if ($(errorSelector).length) {
                panError.show().html('Invalid PAN format (e.g. ABCDE1234F)');
            }

            return false;
        }

        // Company GST/PAN validation
        const companyType = current_fs.find('input[name="identification_type_company"]:checked').val();

        if (
            companyType === 'GSTcompany' &&
            current_fs.find('#company_gstno').length
        ) {

            isValid = validateGstNumber('#company_gstno') && isValid;

        } else if (
            companyType === 'PANcompany' &&
            current_fs.find('#company_pan').length
        ) {

            isValid = validatePanNumber('#company_pan', '#company_pan_error') && isValid;

        }

        // Receiver GST/PAN validation
        const receiverType = current_fs.find('input[name="identification_type_receiver"]:checked').val();

        if (
            receiverType === 'GSTreceiver' &&
            current_fs.find('#receiver_gstno').length
        ) {

            isValid = validateGstNumber('#receiver_gstno') && isValid;

        } else if (
            receiverType === 'PANreceiver' &&
            current_fs.find('#receiver_pan').length
        ) {

            isValid = validatePanNumber('#receiver_pan', '#receiver_pan_error') && isValid;

        }

        console.log('FINAL isValid =', isValid);

        if (!isValid) {
            console.log('company_contact', $('#company_contact').val());
            console.log('company_zip', $('#company_addressZipcode').val());
            console.log('company_city', $('#inputinvoicesender_boxcity').val());
            console.log('company_gst', $('#company_gstno').val());
            e.preventDefault(); // Prevent moving to the next step if validation fails
            return false;
        }

        // Proceed to the next step if all validations pass
        if (isValid) {
            next_fs.show();
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    opacity = 1 - now;
                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
        }
    });

    $(".next-step-propel").click(function (e) {
        e.preventDefault(); // Prevent form submission
        var formId = $(this).closest("form").attr("id");

        const formData = captureAllFormData(formId);
        var current_fs = $(this).parent();
        var next_fs = $(this).parent().next();
        var isValid = true;
        // Check if base domains are loaded
        if (!baseDomainsLoaded) {
            $('.email_error').html('Please wait while the email domains are being loaded. Try again.');
            isValid = false;
        }
        // Check for empty fields and mark them with an error class
        current_fs.find("input[type='text'], input[type='email']").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        //Check email validation only if the current fieldset contains email input
        if (current_fs.find("#official_email").length > 0) {
            var email = $('#official_email').val().trim().toLowerCase();
            if (!validateEmail(email)) {
                isValid = false;
                $('.email_error').html('Invalid Email Format');
                $('#official_email').addClass('error');

            } else {
                $('#official_email').removeClass('error');
                $('.email_error').html('');
            }
        }



        // Load the base domains before allowing any form submission
        loadBaseDomains();

        var form = document.getElementById(formId);
        var phoneNuElement = form.querySelector('#phone_nu');
        if (phoneNuElement !== null) {
            var phoneNum = $('#phone_nu').val();
            // Remove non-numeric characters
            phoneNum = phoneNum.replace(/\D/g, '');
            // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 10 digits
            if (/^[6-9]\d{9}$/.test(phoneNum)) {
                // Limit the phone number to 10 digits
                phoneNum = phoneNum.slice(0, 10);
                $('#phone_nu').removeClass('error');
                $('.phone_error').html('');
            } else {
                $('#phone_nu').addClass('error');
                isValid = false;
                if (phoneNum.length < 10) {
                    $('.phone_error').html('Phone number must be exactly 10 digits long');
                } else {
                    $('.phone_error').html('Insert a valid number starting with 6/7/8/9');
                }
            }
        }
        // Proceed to the next step if all validations pass
        if (isValid) {
            $("#progressbar li.active").last().addClass("completed");
            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            var curr_val = $('#progBar').val();
            var new_val = Number(curr_val) + 33;
            $('#progBar').attr('value', new_val);
            $("#progBar").css('width', new_val + '%');

            // Show the next fieldset
            next_fs.show();
            // Hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // For making fieldset appear animation
                    opacity = 1 - now;
                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
        }
    });

    $(".next-step-propel-masterclass").click(function (e) {
        e.preventDefault(); // Prevent form submission
        var formId = $(this).closest("form").attr("id");

        const formData = captureAllFormData(formId);
        var current_fs = $(this).parent();
        var next_fs = $(this).parent().next();
        var isValid = true;
        // Check if base domains are loaded
        if (!baseDomainsLoaded) {
            $('.email_error').html('Please wait while the email domains are being loaded. Try again.');
            isValid = false;
        }
        // Check for empty fields and mark them with an error class
        current_fs.find("input[type='text'], input[type='email']").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        //Check email validation only if the current fieldset contains email input
        if (current_fs.find("#official_email").length > 0) {
            var email = $('#official_email').val().trim().toLowerCase();
            if (!validateEmail(email)) {
                isValid = false;
                $('.email_error').html('Invalid Email Format');
                $('#official_email').addClass('error');

            } else {
                $('#official_email').removeClass('error');
                $('.email_error').html('');
            }
        }



        // Load the base domains before allowing any form submission
        loadBaseDomains();

        var form = document.getElementById(formId);
        var phoneNuElement = form.querySelector('#phone_nu');
        if (phoneNuElement !== null) {
            var phoneNum = $('#phone_nu').val();
            // Remove non-numeric characters
            phoneNum = phoneNum.replace(/\D/g, '');
            // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 10 digits
            if (/^[6-9]\d{9}$/.test(phoneNum)) {
                // Limit the phone number to 10 digits
                phoneNum = phoneNum.slice(0, 10);
                $('#phone_nu').removeClass('error');
                $('.phone_error').html('');
            } else {
                $('#phone_nu').addClass('error');
                isValid = false;
                if (phoneNum.length < 10) {
                    $('.phone_error').html('Phone number must be exactly 10 digits long');
                } else {
                    $('.phone_error').html('Insert a valid number starting with 6/7/8/9');
                }
            }
        }
        // var form = document.getElementById(formId);
        // var no_of_employee_exists = form.querySelector('#no_of_employee') !== null;
        // if (no_of_employee_exists) {
        //     var no_of_employee_field = $('#no_of_employee');
        // if (no_of_employee_field.length > 0) {
        //     var no_of_employee = no_of_employee_field.val();
        //     if (!no_of_employee) {
        //         isValid = false;
        //         no_of_employee_field.addClass('error');
        //         $('.employee_error').html('Please select the number of employees.');
        //     } else {
        //         no_of_employee_field.removeClass('error');
        //         $('.employee_error').html('');
        //     }
        // }
        // }


        // Proceed to the next step if all validations pass
        if (isValid) {
            $("#progressbar li.active").last().addClass("completed");
            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            var curr_val = $('#progBar').val();
            var new_val = Number(curr_val) + 33;
            $('#progBar').attr('value', new_val);
            $("#progBar").css('width', new_val + '%');

            // Show the next fieldset
            next_fs.show();
            // Hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // For making fieldset appear animation
                    opacity = 1 - now;
                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
        }
    });

    $(".next-stepautopop").click(function (e) {
        e.preventDefault(); // Prevent form submission
        var formId = $(this).closest("form").attr("id");

        const formData = captureAllFormData(formId);
        var current_fs = $(this).parent();
        var next_fs = $(this).parent().next();
        var isValid = true;
        // Check if base domains are loaded
        if (!baseDomainsLoaded) {
            $('.email_error').html('Please wait while the email domains are being loaded. Try again.');
            isValid = false;
        }
        // Check for empty fields and mark them with an error class
        current_fs.find("input[type='text'], input[type='email']").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // Load the base domains before allowing any form submission
        loadBaseDomains();
        var form = document.getElementById(formId);
        var phoneNuElement = form.querySelector('#Autopopup_phone');
        if (phoneNuElement !== null) {
            var phoneNum = $('#Autopopup_phone').val();
            // Remove non-numeric characters
            phoneNum = phoneNum.replace(/\D/g, '');
            // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 10 digits
            if (/^[6-9]\d{9}$/.test(phoneNum)) {
                // Limit the phone number to 10 digits
                phoneNum = phoneNum.slice(0, 10);
                $('#Autopopup_phone').removeClass('error');
                $('.phone_error').html('');
            } else {
                $('#Autopopup_phone').addClass('error');
                isValid = false;
                if (phoneNum.length < 10) {
                    $('.phone_error').html('Phone number must be exactly 10 digits long');
                } else {
                    $('.phone_error').html('Insert a valid number starting with 6/7/8/9');
                }
            }
        }
        // Check email validation only if the current fieldset contains email input
        if (current_fs.find("#auto_popup_email").length > 0) {
            var email = $('#auto_popup_email').val().trim().toLowerCase();
            if (!validateEmail(email)) {
                isValid = false;
                $('.email_error').html('Invalid Email Format');
                $('#auto_popup_email').addClass('error');

            } else {
                $('#auto_popup_email').removeClass('error');
                $('.email_error').html('');
            }
        }
        // var form = document.getElementById(formId);
        // var no_of_employee_exists = form.querySelector('#no_of_employee') !== null;
        // if (no_of_employee_exists) {
        //     var no_of_employee_field = $('#no_of_employee');
        // if (no_of_employee_field.length > 0) {
        //     var no_of_employee = no_of_employee_field.val();
        //     if (!no_of_employee) {
        //         isValid = false;
        //         no_of_employee_field.addClass('error');
        //         $('.employee_error').html('Please select the number of employees.');
        //     } else {
        //         no_of_employee_field.removeClass('error');
        //         $('.employee_error').html('');
        //     }
        // }
        // }


        // Proceed to the next step if all validations pass
        if (isValid) {
            $("#progressbar li.active").last().addClass("completed");
            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            var curr_val = $('#progBar').val();
            var new_val = Number(curr_val) + 33;
            $('#progBar').attr('value', new_val);
            $("#progBar").css('width', new_val + '%');

            // Show the next fieldset
            next_fs.show();
            // Hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // For making fieldset appear animation
                    opacity = 1 - now;
                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
        }
    });

    function validateZipCode(inputId, errorClass) {
        const inputField = document.getElementById(inputId);
        const errorMessage = inputField.parentElement.querySelector(`.${errorClass}`);

        inputField.addEventListener('input', function () {
            const zipCode = inputField.value;

            if (/^\d{6}$/.test(zipCode)) {
                errorMessage.style.display = 'none';
                inputField.setCustomValidity('');
                inputField.classList.remove('error');
                errorMessage.innerHTML = '';
            } else {
                errorMessage.style.display = 'block';
                inputField.setCustomValidity('Invalid ZIP Code. Must be 6 digits (0-9).');
                inputField.classList.add('error');
                isValid = false;
                errorMessage.innerHTML = 'Invalid ZIP Code. Must be 6 digits (0-9).';
            }
        });
    }

    //first step skip employee details
    $(".next-step-first").click(function () {
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        console.log(formData);
        var current_fs = $(this).parent();
        var next_fs = $(this).parent().next();
        var isValid = true;

        // Check for empty fields and mark them with an error class
        current_fs.find("input[type='text']:not(#company_website), input[type='file'], input[type='email']").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });

        // Check email validation only if the current fieldset contains email input
        if (current_fs.find("#official_email").length > 0) {
            var email = $('#official_email').val();
            var atIndex = email.indexOf('@');
            var dotIndex = email.lastIndexOf('.');
            var notAcceptedDomains = ['gmail.com', 'yopmail.com', 'yahoo.com', 'aol.com', 'outlook.com', 'hotmail.com', 'icloud.com'];

            if (
                email.trim() === '' ||
                atIndex === -1 ||
                dotIndex === -1 ||
                atIndex > dotIndex ||
                notAcceptedDomains.indexOf(email.slice(atIndex + 1)) !== -1 ||
                dotIndex === email.length - 1
            ) {
                $('#official_email').addClass('error');
                $('.email_error').html('Please enter a valid work email.');
                isValid = false;
            } else {
                $('#official_email').removeClass('error');
                $('.email_error').html('');
            }
        }

        const ctc_total_FieldExists = Object.keys(formData).some(key => {
            const input = document.querySelector(`form input[name="${key}"]`);
            return input.name === 'ctc_total';
        });

        // Check total CTC
        if (ctc_total_FieldExists) {
            var ctc_total = $('#ctc_total').val();
            if (!ctc_total) {
                //isValid = false;
                $('#ctc_total').addClass('error');
            } else {
                $('#ctc_total').removeClass('error');
            }
        }

        if (isValid) {
            // Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            var curr_val = $('#progBar').val();
            var new_val = Number(curr_val) + 33;
            $('#progBar').attr('value', new_val);
            $("#progBar").css('width', new_val + '%');

            // Show the next fieldset
            next_fs.show();
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    opacity = 1 - now;
                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
        }
    });

    $(".previous-step").click(function () {
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        // Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        $("#progressbar li.active").last().removeClass("completed");
        var curr_val = $('#progBar').val();
        var new_val = Number(curr_val) - 33;
        $('#progBar').attr('value', new_val);
        $("#progBar").css('width', new_val + '%');
        // Show the previous fieldset
        previous_fs.show();

        current_fs.animate({ opacity: 0 }, {
            step: function (now) {

                opacity = 1 - now;
                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
    });

});



// Download Pdf of tools letter

jQuery(document).ready(function ($) {
    defaultOfferBody = $('#offerBody').html();
    // console.log(defaultOfferBody);
    async function downloadOfferPdf() {
        let isValid = true;

        $('#offerForm')
            .find("input[required]:not(.optional-field), input[type='file'], select[required], textarea[required]")
            .each(function () {

                const value = $(this).val();
                if (
                    value === null ||
                    value === '' ||
                    (Array.isArray(value) && value.length === 0)
                ) {
                    isValid = false;

                    $(this).addClass('error');

                    if ($(this).hasClass('js-select2')) {
                        $(this).next('.select2').find('.select2-selection')
                            .addClass('error');
                    }

                } else {

                    $(this).removeClass('error');

                    if ($(this).hasClass('js-select2')) {
                        $(this).next('.select2').find('.select2-selection')
                            .removeClass('error');
                    }
                }

            });
        // STOP PDF generation if validation fails
        if (!isValid) {
            return;
        }
        const card = document.getElementById('offerBody');
        const $btn = $('#submitbtn');
        const originalLabel = $btn.val();

        try {

            $btn.prop('disabled', true).val('Generating...');
            const canvas = await html2canvas(card, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const margin = 10;
            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(
                imgData,
                'PNG',
                margin,
                position + margin,
                imgWidth,
                imgHeight
            );

            heightLeft -= pageHeight;
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(
                    imgData,
                    'PNG',
                    margin,
                    position + margin,
                    imgWidth,
                    imgHeight
                );

                heightLeft -= pageHeight;
            }
            const employeeName =
                ($('#employee_name').val?.() || '').trim() || 'offer-letter';

            pdf.save(
                'offer-letter-' +
                employeeName.replace(/[^a-z0-9]/gi, '-').toLowerCase() +
                '.pdf'
            );

            setTimeout(function () {
                resetOfferForm();
            }, 1000);

            function resetOfferForm() {
                // Reset form fields
                $('#offerForm')[0].reset();
                $('#offerBody').html(defaultOfferBody);
                console.log(defaultOfferBody);

            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate PDF');

        } finally {
            $btn.prop('disabled', false).val(originalLabel);
            $('#offerBody').html(defaultOfferBody);
        }
    }

    $('#submitbtn').on('click', function (e) {
        e.preventDefault();
        downloadOfferPdf();
    });

});

// Pdf download for calculator
jQuery(document).ready(function ($) {

    defaultOfferBody = $('#gratuityBody').html();

    async function downloadGratuityPdf() {
        let isValid = true;
        const $form = $('#gratuityForm');

        // Required field validation
        $form.find(
            "input[required]:not(.optional-field), input[type='file'], select[required], textarea[required]"
        ).each(function () {

            const value = $(this).val();

            if (
                value === null ||
                value === '' ||
                (Array.isArray(value) && value.length === 0)
            ) {

                isValid = false;

                $(this).addClass('error');

                if ($(this).hasClass('js-select2')) {
                    $(this)
                        .next('.select2')
                        .find('.select2-selection')
                        .addClass('error');
                }

            } else {

                $(this).removeClass('error');

                if ($(this).hasClass('js-select2')) {
                    $(this)
                        .next('.select2')
                        .find('.select2-selection')
                        .removeClass('error');
                }
            }
        });

        // Gratuity years validation (only if field exists)
        if ($('#no_of_service_years').length) {

            const years =
                parseInt($('#no_of_service_years').val()) || 0;

            if (years < 5) {

                $('#no_of_service_years').addClass('error');

                $('#error_message').text(
                    'Minimum 5 years of service required.'
                );

                isValid = false;

            } else {

                $('#error_message').text('');
            }
        }

        // TDS radio validation (only if radios exist)
        if ($form.find('input[name="tds_for"]').length) {

            if (!$form.find('input[name="tds_for"]:checked').length) {

                $form.find('input[name="tds_for"]')
                    .closest('.radio-combo-black')
                    .find('.floating-radio-alert')
                    .text('Please select an option');

                isValid = false;

            } else {

                $form.find('input[name="tds_for"]')
                    .closest('.radio-combo-black')
                    .find('.floating-radio-alert')
                    .text('');
            }
        }

        if ($form.find('input[name="pan_avail"]').length) {

            if (!$form.find('input[name="pan_avail"]:checked').length) {

                $form.find('input[name="pan_avail"]')
                    .closest('.radio-combo-black')
                    .find('.floating-radio-alert')
                    .text('Please select an option');

                isValid = false;

            } else {

                $form.find('input[name="pan_avail"]')
                    .closest('.radio-combo-black')
                    .find('.floating-radio-alert')
                    .text('');
            }
        }

        // STOP PDF if validation fails
        if (!isValid) {
            return;
        }

        const card = document.getElementById('gratuityBody');

        const $btn = $('#gratuityBtn');
        const originalLabel = $btn.val();

        try {

            $btn.prop('disabled', true).val('Generating...');

            const canvas = await html2canvas(card, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                ignoreElements: function (element) {
                    return element.classList &&
                        element.classList.contains('calculator-sidebar-img');
                }
            });

            const imgData = canvas.toDataURL('image/png');

            const { jsPDF } = window.jspdf;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const margin = 10;

            const maxWidth = pageWidth - (margin * 2);
            const maxHeight = pageHeight - (margin * 2);

            let imgWidth = maxWidth;
            let imgHeight =
                (canvas.height * imgWidth) / canvas.width;

            if (imgHeight > maxHeight) {
                imgHeight = maxHeight;
                imgWidth =
                    (canvas.width * imgHeight) / canvas.height;
            }

            pdf.addImage(
                imgData,
                'PNG',
                margin,
                margin,
                imgWidth,
                imgHeight
            );

            pdf.save('calculator.pdf');

            setTimeout(function () {

                $form[0].reset();

                $form.find('.error').removeClass('error');

                $('#error_message').text('');
                $('.floating-radio-alert').text('');

            }, 1000);

        } catch (error) {

            console.error(error);

            alert('Failed to generate PDF');

        } finally {
            $btn.prop('disabled', false).val(originalLabel);
            $('#gratuityBody').html(defaultOfferBody);
        }
    }

    $('#gratuityBtn').on('click', function (e) {

        e.preventDefault();
        downloadGratuityPdf();

    });

    // Remove radio errors on selection
    $(document).on(
        'change',
        'input[name="tds_for"], input[name="pan_avail"]',
        function () {

            $(this)
                .closest('.radio-combo-black')
                .find('.floating-radio-alert')
                .text('');
        }
    );

});


// adjust bottom stciky button on mobile

// Add active
document.querySelector("img.hrone-mob-nav.menu")?.addEventListener("click", function () {
    document.querySelector(".request_demo")?.classList.add("active");
});

// Remove active
document.querySelector("img.hrone-mob-nav-logo-cross")?.addEventListener("click", function () {
    document.querySelector(".request_demo")?.classList.remove("active");
});

// SCRIPT 2 — BOTTOM OF PAGE BASED
window.addEventListener("scroll", function () {

    const threshold = 128.5;
    const btn = document.querySelector(".request_demo");
    if (!btn) return;

    const scrollPos = window.scrollY || window.pageYOffset;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    const nearBottom = scrollPos + winHeight >= docHeight - threshold;

    if (nearBottom) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }
});
