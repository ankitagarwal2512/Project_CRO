/**
 * Popup Form Submission Handler
 * Submits form directly to HubSpot API (no AJAX/backend required)
 */

(function ($) {
    'use strict';

    /**
     * Lightweight client-side sanitizers to avoid pushing unsafe/unexpected values
     * into 3rd-party APIs. Server-side sanitization should still be enforced.
     */
    function sanitizePlainText(value, maxLen = 250) {
        if (value === null || value === undefined) return '';
        let str = String(value);
        // Strip HTML tags
        str = str.replace(/<[^>]*>/g, '');
        // Remove ASCII control chars
        str = str.replace(/[\u0000-\u001F\u007F]/g, '');
        // Collapse whitespace
        str = str.replace(/\s+/g, ' ').trim();
        if (maxLen && str.length > maxLen) str = str.slice(0, maxLen);
        return str;
    }

    function sanitizeEmail(value) {
        // Keep it simple: trim, lower-case, remove spaces/control chars/tags.
        const email = sanitizePlainText(value, 320).toLowerCase();
        return email.replace(/\s+/g, '');
    }

    function sanitizePhoneIN(value) {
        // Digits only, keep last 10 digits (common when country code is included)
        const digits = String(value ?? '').replace(/\D/g, '');
        return digits.length <= 10 ? digits : digits.slice(-10);
    }

    function sanitizeUrl(value) {
        const raw = sanitizePlainText(value, 2000);
        if (!raw) return '';
        try {
            const u = new URL(raw, window.location.origin);
            // Only allow http/https URLs in payloads
            if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
            return u.href;
        } catch (e) {
            return '';
        }
    }

    function sanitizePopupFormData(formData) {
        const safe = { ...(formData || {}) };

        safe.popup_name = sanitizePlainText(safe.popup_name, 120);
        safe.popup_official_email = sanitizeEmail(safe.popup_official_email);
        safe.popup_phone = sanitizePhoneIN(safe.popup_phone);
        safe.city_popup = sanitizePlainText(safe.city_popup, 120);
        safe.state_code = sanitizePlainText(safe.state_code, 50);
        safe.popup_number_of_employee_v1 = sanitizePlainText(safe.popup_number_of_employee_v1, 50);

        safe.utm_source = sanitizePlainText(safe.utm_source, 120);
        safe.utm_medium = sanitizePlainText(safe.utm_medium, 120);
        safe.utm_campaign = sanitizePlainText(safe.utm_campaign, 120);
        safe.utm_content = sanitizePlainText(safe.utm_content, 120);
        safe.utm_term = sanitizePlainText(safe.utm_term, 120);

        safe.popup_permalink = sanitizeUrl(safe.popup_permalink);
        safe.popup_page_title = sanitizePlainText(safe.popup_page_title, 200);

        return safe;
    }

    // HubSpot API Configuration
    const HUBSPOT_PORTAL_ID = '7277696';
    const HUBSPOT_FORM_GUID = '6a8e8749-b385-4c50-b604-0a4564eeb452';
    const HUBSPOT_API_URL = 'https://api.hsforms.com/submissions/v3/integration/submit/' + HUBSPOT_PORTAL_ID + '/' + HUBSPOT_FORM_GUID;

    $(document).ready(function () {
        // Popup Form Submit Handler
        $("#popupFormSubmit").click(function (event) {
            event.preventDefault();
            var state = $('#input-box-city-popup').attr('data-state');
            var isValid = true;
            var email = $('#popup_official_email').val();

            // Validate form fields
            $(this).parent().find("input[type='text'], input[type='email']").each(function () {
                if ($(this).val().trim() === '') {
                    isValid = false;
                    $(this).addClass('error');
                } else {
                    $(this).removeClass('error');
                }

                var phoneNum = $('#popup_phone_nu').val();
                var phoneRegex = /^[6-9]\d{9}$/;
                if (!phoneRegex.test(phoneNum)) {
                    $('#popup_phone_nu').addClass('error');
                    isValid = false;
                } else {
                    $('#popup_phone_nu').removeClass('error');
                }
            });

            // Validate city
            function validateCity() {
                if (typeof inputBox_popup !== 'undefined' && typeof availableKeywords !== 'undefined') {
                    const inputCity = inputBox_popup.value.trim();
                    const cityExists = availableKeywords.some(({ city }) => city === inputCity);
                    if (!cityExists) {
                        $('.city-error-popup').html('City not found in the list. Please select a valid city.');
                        return false;
                    }
                }
                return true;
            }

            if (!validateCity()) {
                isValid = false;
                event.preventDefault();
            }

            if (!isValid) {
                return false;
            }

            // Capture form data
            const formData = captureFormData();
            formData.state_code = state;
            const sanitizedFormData = sanitizePopupFormData(formData);
            const isEmpty = Object.values(sanitizedFormData).some(value => value !== '');

            if (isEmpty) {
                document.getElementById("popupFormSubmit").disabled = true;
                document.getElementById("loaderpopup2").style.display = "block";

                // Get HubSpot tracking cookie (hubspotutk) for API context
                function getCookie(name) {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop().split(';').shift();
                    return '';
                }

                const hubspotCookie = getCookie('hubspotutk') || '';

                // Parse name into firstname and lastname
                const name = sanitizedFormData.popup_name || '';
                let firstname = '';
                let lastname = '';
                if (name) {
                    const nameParts = name.trim().split(' ');
                    firstname = nameParts[0] || '';
                    lastname = nameParts.slice(1).join(' ') || '';
                }

                // Prepare data for HubSpot API
                const hubspotData = {
                    "submittedAt": new Date().toISOString(),
                    "fields": [
                        { "objectTypeId": "0-1", "name": "firstname", "value": firstname },
                        { "objectTypeId": "0-1", "name": "lastname", "value": lastname },
                        { "objectTypeId": "0-1", "name": "email", "value": sanitizedFormData.popup_official_email || '' },
                        { "objectTypeId": "0-1", "name": "phone", "value": "+91" + (sanitizedFormData.popup_phone || '') },
                        { "objectTypeId": "0-1", "name": "city", "value": sanitizedFormData.city_popup || '' },
                        { "objectTypeId": "0-1", "name": "state_sap__cloned_", "value": state || '' },
                        { "objectTypeId": "0-1", "name": "country", "value": "India" },
                        { "objectTypeId": "0-1", "name": "number_of_employee_v1", "value": sanitizedFormData.popup_number_of_employee_v1 || '' },
                        { "objectTypeId": "0-1", "name": "utm_source", "value": sanitizedFormData.utm_source || '' },
                        { "objectTypeId": "0-1", "name": "utm_medium", "value": sanitizedFormData.utm_medium || '' },
                        { "objectTypeId": "0-1", "name": "utm_campaign", "value": sanitizedFormData.utm_campaign || '' },
                        { "objectTypeId": "0-1", "name": "utm_content", "value": sanitizedFormData.utm_content || '' },
                        { "objectTypeId": "0-1", "name": "utm_term", "value": sanitizedFormData.utm_term || '' }
                    ],
                    "context": {
                        "hutk": hubspotCookie,
                        "pageUri": sanitizedFormData.popup_permalink || window.location.href,
                        "pageName": sanitizedFormData.popup_page_title || document.title
                    },
                    "legalConsentOptions": {
                        "consent": {
                            "consentToProcess": true,
                            "text": "I agree to allow HROne to store and process my personal data."
                        }
                    }
                };

                // Submit directly to HubSpot API (no AJAX/backend)
                fetch(HUBSPOT_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(hubspotData)
                })
                    .then(response => response.json())
                    .then(data => {
                        // Reset form and show success
                        $('#popupForm')[0].reset();
                        document.getElementById("popupFormSubmit").disabled = false;
                        document.getElementById("loaderpopup2").style.display = "none";

                        // Show success message
                        if (data.inlineMessage) {
                            $('.popupformresponse').html('<div class="hm-banner-msg"><div class="success-msg"> <h2>Success!</h2>' + data.inlineMessage + ' </div></div>');
                        } else {
                            $('.popupformresponse').html('<div class="hm-banner-msg"><div class="success-msg"> <h2>Success!</h2>Thank you for your submission!</div></div>');
                        }

                        // Redirect to thank you page
                        setTimeout(function () {
                            const thankYouUrl = (typeof hronePopupForm !== 'undefined' && hronePopupForm.thankYouUrl)
                                ? hronePopupForm.thankYouUrl
                                : window.location.origin + '/thankyou';
                            window.location.href = thankYouUrl;
                        }, 1000);
                    })
                    .catch(error => {
                        console.error('Error submitting form:', error);
                        document.getElementById("popupFormSubmit").disabled = false;
                        document.getElementById("loaderpopup2").style.display = "none";
                        $('.popupformresponse').html('<div class="hm-banner-msg"><div class="error-msg"> <h2>Error!</h2>There was an error submitting your form. Please try again.</div></div>');
                    });
            }
        });
    });

})(jQuery);

