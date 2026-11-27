$(document).ready(function () {

    function captureAllFormData(formId) {
        const formData = {};
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], input[type="radio"], input[type="checkbox"], textarea, select');
            inputs.forEach(input => {
                if (input.type === "radio") {
                    if (input.checked) {
                        formData[input.name] = input.value; // Only add checked radio button value
                    }
                } else if (input.type === "checkbox") {
                    formData[input.name] = input.checked ? input.value : ''; // Capture only if checked
                } else {
                    formData[input.name] = input.value;
                }
            });
        } else {
            // console.error('Form not found with ID:', formId);
        }
        return formData;
    }
    $('#contact_personphone').keyup(function () {
        var phoneNum = $('#contact_personphone').val();
        phoneNum = phoneNum.replace(/\D/g, '');
        // Ensure the phone number starts with 6, 7, 8, or 9
        if (/^[6-9]/.test(phoneNum)) {
            // Limit the phone number to 10 digits
            phoneNum = phoneNum.slice(0, 10);
            $('#contact_personphone').removeClass('error');
            $('.phone_error').html('');
        } else {
            // If the number doesn't start with 6, 7, 8, or 9, clear the input
            phoneNum = '';
            $('#contact_personphone').addClass('error');
            $('.phone_error').html('Insert valid number start from 6/7/8/9');

        }
        $('#contact_personphone').val(phoneNum);
    });

    $(".next-step-policygenerator").click(function (e) {
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
        current_fs.find("input[id='company_name'], input[type='email'], input[type='number'], input[type='file'], input[id='employee_count'],input[id='policy_version'],input[id='contact_personNAme'],input[id='contact_personDesignation'],input[id='contact_personphone'],input[id='policy_createdName'],input[id='policy_createdDesignation'],input[id='policy_createddate']").each(function () {
            var inputId = $(this).attr("id");
            var inputValue = $(this).val().trim();

            if (inputValue === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }

            if (current_fs.find("#contact_personemail").length > 0) {
                var email = $('#contact_personemail').val().trim().toLowerCase();
                if (!validateEmail(email)) {
                    isValid = false;
                    $('.policyEmail_error').html('Invalid Email Format');
                    $('#contact_personemail').addClass('error');

                } else {
                    $('#contact_personemail').removeClass('error');
                    $('.policyEmail_error').html('');
                }
            }

            if (current_fs.find("#contact_personphone").length > 0) {
                var phoneNum = $('#contact_personphone').val();
                // Remove non-numeric characters
                phoneNum = phoneNum.replace(/\D/g, '');
                // Ensure the phone number starts with 6, 7, 8, or 9 and has a length of 10 digits
                if (/^[6-9]\d{9}$/.test(phoneNum)) {
                    // Limit the phone number to 10 digits
                    phoneNum = phoneNum.slice(0, 10);
                    $('#contact_personphone').removeClass('error');
                    $('.phone_error').html('');
                } else {
                    $('#contact_personphone').addClass('error');
                    isValid = false;
                    if (phoneNum.length < 10) {
                        $('.phone_error').html('Phone number must be exactly 10 digits long');
                    } else {
                        $('.phone_error').html('Insert a valid number starting with 6/7/8/9');
                    }
                }
            }
        });

        // Proceed to the next step if all validations pass
        if (isValid) {
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

    $("#generate_policyLeave").click(function (event) {

        event.preventDefault();

        const weeksNotice = $('#weeks_notice');

        if (weeksNotice.val().trim() === '') {
            weeksNotice.addClass('error');
            return false;
        }

        weeksNotice.removeClass('error');

        $("#loaderpolicy").show();

        const formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);

        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_leave_policy',
                form_data: formData,
                security: admin_url.policy_nonce,
                security: hroneAjaxSecurity.policy_generator
            },
            success: function (response) {

                $("#loaderpolicy").hide();

                $('#generatedResponseLeavePolicy').html(response);
                $('#LeavePolicy_download').html(response);
            },
            error: function (xhr, status, error) {

                $("#loaderpolicy").hide();

                console.error(error);
                alert('Something went wrong. Please try again.');
            }
        });

    });

    $("#generate_wfhpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='eligibility'], textarea[id='security_measures'], textarea[id='communication_mode'], textarea[id='termination_clause']").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicy").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: hroneAjaxSecurity.ajax_url,
            type: 'POST',
            data: {
                action: 'generate_wfh_policy',
                form_data: formData,
                security: hroneAjaxSecurity.policy_generator
            },
            success: function (response) {
                document.getElementById("loaderpolicy").style.display = "none";
                $('#generatedResponsewfhPolicy').html(response);
                $('#wfhPolicy_download').html(response);
                $('.job-download').show();
            },
            error: function (xhr) {
                console.log(xhr.responseText);
                document.getElementById("loaderpolicy").style.display = "none";
            }
        });
    });
    $("#generate_Overtimepolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='eligibility'], textarea[id='overtime_hours'],  textarea[id='overtime_rate'], textarea[id='communication_mode'], textarea[id='third_party'], textarea[id='declaration']").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }

        document.getElementById("loaderpolicyovertime").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_Overtime_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyovertime").style.display = "none";
                $('#generatedResponseOvertimePolicy').html(response);
                $('#OvertimePolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_DataSpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='data_classification'], textarea[id='access_control'],  textarea[id='data_protection'], textarea[id='incident_response'], textarea[id='third_party'], textarea[id='compliance'], textarea[id='declaration']").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }

        document.getElementById("loaderpolicyds").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_dataS_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyds").style.display = "none";
                $('#generatedResponseDSPolicy').html(response);
                $('#DSPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_Papolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='appraisal_cycle'], textarea[id='performance_parameters'], textarea[id='rating_system'], textarea[id='appraisal_process'], textarea[id='feedback_mechanism'], textarea[id='performance_improvement'], textarea[id='rewards_recognition'], textarea[id='appeal_process'], textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicydPa").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_pa_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicydPa").style.display = "none";
                $('#generatedResponsePerfAppPolicy').html(response);
                $('#papolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_divincpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='protected_characteristics'], textarea[id='workplace_culture'], textarea[id='training_development'], textarea[id='career_development'], textarea[id='work_life_balance'], textarea[id='harassment_discrimination'], textarea[id='grievance_procedure'], textarea[id='monitoring_review'], textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicydivinc").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_divinc_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicydivinc").style.display = "none";
                $('#generatedResponsedivincPolicy').html(response);
                $('#divincPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_recHirpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='recruitment_process'], textarea[id='job_posting'], textarea[id='selection_criteria'], textarea[id='interview_process'], textarea[id='background_verification'], textarea[id='offer_process'], textarea[id='onboarding_process'], textarea[id='probation_period'], textarea[id='equal_employment'], textarea[id='documentation_requirements'], textarea[id='policy_review'] , textarea[required], textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyrecHir").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_recHir_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyrecHir").style.display = "none";
                $('#generatedResponserecHirPolicy').html(response);
                $('#recHirpolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_Empcondpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='code_of_conduct'], textarea[id='professional_behavior'], textarea[id='workplace_ethics'], textarea[id='dress_code'], textarea[id='communication_guidelines'], textarea[id='conflict_resolution'], textarea[id='harassment_discrimination'], textarea[id='company_resources'], textarea[id='social_media_policy'], textarea[id='confidentiality'], textarea[id='disciplinary_actions'], textarea[id='policy_review'] , textarea[required], textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyEmpcond").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_empcond_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyEmpcond").style.display = "none";
                $('#generatedResponseEmplCondPolicy').html(response);
                $('#empcondPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_CompBenPpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='compensation_structure'], textarea[id='salary_components'], textarea[id='allowances_benefits'], textarea[id='bonus_incentives'], textarea[id='insurance_benefits'], textarea[id='retirement_benefits'], textarea[id='leave_benefits'], textarea[id='other_benefits'], textarea[id='salary_review'], textarea[id='payroll_process'], textarea[id='taxation_deductions'], textarea[id='confidentiality'], textarea[id='policy_review'] , textarea[required], textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyCompBen").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_CompBen_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyCompBen").style.display = "none";
                $('#generatedResponseCompBenPolicy').html(response);
                $('#compBenPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_AttenLeavpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='working_hours'], textarea[id='attendance_requirements'], textarea[id='leave_types'], textarea[id='leave_entitlement'], textarea[id='leave_application'], textarea[id='leave_approval'], textarea[id='leave_carry_forward'], textarea[id='leave_encashment'], textarea[id='absence_management'], textarea[id='attendance_records'], textarea[id='overtime_policy'], textarea[id='shift_management'], textarea[id='policy_review'] , textarea[required], textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyAttenLeav").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_AttenLeav_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyAttenLeav").style.display = "none";
                $('#generatedResponseAttenLeavPolicy').html(response);
                $('#AttenLeavPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_PerfMangpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='performance_cycle'], textarea[id='performance_planning'], textarea[id='goal_setting'], textarea[id='performance_monitoring'], textarea[id='review_process'], textarea[id='rating_system'], textarea[id='performance_feedback'], textarea[id='improvement_plan'], textarea[id='rewards_recognition'], textarea[id='career_development'], textarea[id='appeal_process'], textarea[id='documentation'], textarea[id='policy_review'] , textarea[required], textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyPerfMang").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_PerfMang_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyPerfMang").style.display = "none";
                $('#generatedResponsePerfMangPolicy').html(response);
                $('#PerfMangPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_Workhsftypolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='responsibilities'], textarea[id='risk_assessment'], textarea[id='emergency_procedures'], textarea[id='first_aid'], textarea[id='workplace_safety'], textarea[id='ppe'], textarea[id='safety_training'], textarea[id='accident_reporting'], textarea[id='safety_inspections'], textarea[id='mental_health'], textarea[id='compliance'], textarea[id='policy_review'] , textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyWorkhsfty").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_Workhsfty_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyWorkhsfty").style.display = "none";
                $('#generatedResponseWorkhsftyPolicy').html(response);
                $('#WorkhsftyPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_TrnDevpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='training_strategy'], textarea[id='needs_assessment'], textarea[id='training_programs'], textarea[id='learning_methods'], textarea[id='training_schedule'], textarea[id='training_budget'], textarea[id='training_evaluation'], textarea[id='career_development'], textarea[id='mentoring_coaching'], textarea[id='training_records'], textarea[id='compliance'], textarea[id='policy_review'] , textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyTrnDev").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_TrnDev_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyTrnDev").style.display = "none";
                $('#generatedResponseTrnDevPolicy').html(response);
                $('#TrnDevPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_TerminationExitpolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='types_termination'], textarea[id='notice_period'], textarea[id='exit_process'], textarea[id='exit_interview'], textarea[id='final_settlement'], textarea[id='company_property'], textarea[id='confidentiality'], textarea[id='post_employment'], textarea[id='exit_documentation'],  textarea[id='policy_review'] , textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyTerminationExit").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_TerminationExit_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyTerminationExit").style.display = "none";
                $('#generatedResponseTerminationExitPolicy').html(response);
                $('#TerminationExitPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_TechnologySocialMediaPolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='technology_resources'], textarea[id='acceptable_use'], textarea[id='social_media_guidelines'], textarea[id='data_security'], textarea[id='privacy_confidentiality'], textarea[id='email_communication'], textarea[id='internet_usage'], textarea[id='mobile_devices'], textarea[id='software_applications'],  textarea[id='monitoring_compliance'],  textarea[id='violations_consequences'],  textarea[id='policy_review'] , textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyTechnologySocialMedia").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_TechnologySocialMedia_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyTechnologySocialMedia").style.display = "none";
                $('#generatedResponseTechnologySocialMediaPolicy').html(response);
                $('#TechnologySocialMediaPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_RemoteFlexibleWorkPolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='types_remote_work'], textarea[id='flexible_work_arrangements'], textarea[id='eligibility_criteria'], textarea[id='work_schedule'], textarea[id='communication_requirements'], textarea[id='equipment_technology'], textarea[id='work_environment'], textarea[id='performance_management'], textarea[id='health_safety'],  textarea[id='expenses_reimbursement'],  textarea[id='policy_review'] , textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyRemoteFlexibleWork").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_RemoteFlexibleWork_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyRemoteFlexibleWork").style.display = "none";
                $('#generatedResponseRemoteFlexibleWorkPolicy').html(response);
                $('#RemoteFlexibleWorkPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_GrievanceRedressalPolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='definition_grievance'], textarea[id='grievance_categories'], textarea[id='grievance_committee'], textarea[id='grievance_submission'], textarea[id='grievance_resolution'], textarea[id='timelines_deadlines'], textarea[id='appeal_process'], textarea[id='confidentiality'], textarea[id='anti_retaliation'],  textarea[id='documentation_requirements'],  textarea[id='policy_review'] , textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyGrievanceRedressal").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_GrievanceRedressal_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyGrievanceRedressal").style.display = "none";
                $('#generatedResponseGrievanceRedressalPolicy').html(response);
                $('#GrievanceRedressalPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
    $("#generate_HealthSafetyPolicy").click(function (event) {

        event.preventDefault();
        var isValid = true;
        $(this).parent().find("textarea[id='policy_objective'], textarea[id='scope_applicability'], textarea[id='health_safety_responsibilities'], textarea[id='risk_assessment'], textarea[id='emergency_procedures'], textarea[id='first_aid'], textarea[id='workplace_safety'], textarea[id='ppe'], textarea[id='health_safety_training'], textarea[id='accident_reporting'], textarea[id='health_safety_inspections'],  textarea[id='mental_health'],  textarea[id='compliance_requirements'], textarea[id='policy_review'] , textarea[required]").each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });
        // If any field is empty, prevent proceeding to the next step
        if (!isValid) {
            return false;
        }
        document.getElementById("loaderpolicyHealthSafety").style.display = "block";
        var formId = $(this).closest("form").attr("id");
        const formData = captureAllFormData(formId);
        const isEmpty = Object.values(formData).some(value => value !== '');
        $.ajax({
            url: admin_url.ajaxUrl,
            type: 'POST',
            data: {
                action: 'generate_HealthSafety_policy',
                form_data: formData
            },
            success: function (response) {
                document.getElementById("loaderpolicyHealthSafety").style.display = "none";
                $('#generatedResponseHealthSafetyPolicy').html(response);
                $('#HealthSafetyPolicy_download').html(response);
                $(".job-download").show();
            }
        });
    });
});