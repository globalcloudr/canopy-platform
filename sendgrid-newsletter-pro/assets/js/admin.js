// Defensive wrapper to protect against other plugin errors
(function() {
    'use strict';
    
    // Wait for DOM and run our code in isolation
    jQuery(document).ready(function($) {
        // Check if sgnpAdmin object exists
        if (typeof sgnpAdmin === 'undefined') {
            console.error('SendGrid Newsletter Pro: Configuration object not found.');
            return;
        }
    
    // Helper function to load lists via AJAX and populate modal
    function loadListsForModal(containerId, selectedListIds) {
        selectedListIds = selectedListIds || [];
        var $container = $('#' + containerId);
        
        // Show loading state
        $container.html('<em>Loading lists...</em>');
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_get_lists',
                nonce: sgnpAdmin.nonce
            },
            success: function(response) {
                if (response.success && response.data.lists && response.data.lists.length > 0) {
                    var html = '';
                    response.data.lists.forEach(function(list) {
                        // Convert both to numbers for comparison
                        var listId = parseInt(list.id);
                        var isChecked = selectedListIds.some(function(id) {
                            return parseInt(id) === listId;
                        });
                        var checked = isChecked ? 'checked' : '';
                        html += '<label class="sgnp-checkbox-label">' +
                                '<input type="checkbox" name="lists[]" value="' + list.id + '" ' + checked + '>' +
                                list.name +
                                '</label>';
                    });
                    $container.html(html);
                } else {
                    $container.html('<em>No lists available. <a href="' + sgnpAdmin.adminUrl + 'admin.php?page=sgnp-lists">Create a list first</a></em>');
                }
            },
            error: function() {
                $container.html('<em style="color: red;">Error loading lists. Please try again.</em>');
            }
        });
    }
    
    $('#sgnp-add-subscriber-btn, #sgnp-add-first-subscriber').on('click', function() {
        // Show modal
        $('#sgnp-add-subscriber-modal').css({
            'display': 'flex',
            'z-index': '999999'
        });
        
        // Load lists via AJAX
        loadListsForModal('add-subscriber-lists');
    });
    
    $('#sgnp-import-subscribers-btn').on('click', function() {
        $('#sgnp-import-csv-modal').show();
    });
    
    $('#sgnp-create-list-btn, #sgnp-create-first-list').on('click', function() {
        $('#sgnp-create-list-modal').show();
    });
    
    $('#sgnp-add-to-list-btn').on('click', function() {
        $('#sgnp-add-to-list-modal').show();
    });
    
    $('#sgnp-select-all-subscribers').on('click', function() {
        $('.sgnp-subscriber-to-add').prop('checked', true);
    });
    
    $('#sgnp-deselect-all-subscribers').on('click', function() {
        $('.sgnp-subscriber-to-add').prop('checked', false);
    });
    
    $('#sgnp-add-subscribers-to-list-btn').on('click', function() {
        var selectedSubscribers = [];
        $('.sgnp-subscriber-to-add:checked').each(function() {
            selectedSubscribers.push($(this).val());
        });
        
        if (selectedSubscribers.length === 0) {
            alert('Please select at least one subscriber.');
            return;
        }
        
        var listId = $('#sgnp-add-to-list-btn').data('list-id');
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_add_subscribers_to_list',
                nonce: sgnpAdmin.nonce,
                list_id: listId,
                subscriber_ids: selectedSubscribers
            },
            success: function(response) {
                if (response.success) {
                    alert('Subscribers added successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + (response.data.message || 'Failed to add subscribers'));
                }
            },
            error: function() {
                alert('An error occurred while adding subscribers');
            }
        });
    });
    
    $('.sgnp-edit-list').on('click', function() {
        var listId = $(this).data('id');
        var row = $(this).closest('tr');
        
        // Get list data from table row
        var name = row.find('td:eq(0)').text().trim();
        var description = row.find('td:eq(1)').text().trim();
        
        // Populate edit form
        $('#edit-list-id').val(listId);
        $('#edit-list-name').val(name);
        $('#edit-list-description').val(description);
        
        // Show modal
        $('#sgnp-edit-list-modal').show();
    });
    
    $('#sgnp-edit-list-form').on('submit', function(e) {
        e.preventDefault();
        
        var formData = {
            action: 'sgnp_update_list',
            nonce: sgnpAdmin.nonce,
            list_id: $('#edit-list-id').val(),
            name: $('#edit-list-name').val(),
            description: $('#edit-list-description').val()
        };
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    alert('List updated successfully!');
                    $('#sgnp-edit-list-modal').hide();
                    location.reload();
                } else {
                    alert('Error: ' + (response.data?.message || 'Failed to update list'));
                }
            },
            error: function() {
                alert('Network error occurred');
            }
        });
    });
    
    $('.sgnp-modal-close').on('click', function() {
        $(this).closest('.sgnp-modal').hide();
    });
    
    $(window).on('click', function(e) {
        if ($(e.target).hasClass('sgnp-modal')) {
            $('.sgnp-modal').hide();
        }
    });
    
    $('#sgnp-test-campaign').on('click', function(e) {
        // Check if Stripo is active - if so, let Stripo handler deal with it
        if (typeof window.StripoEditorApi !== 'undefined' && window.StripoEditorApi && window.StripoEditorApi.actionsApi) {
            // Stripo will handle this - do nothing
            return;
        }
        // Regular template - show modal directly
        $('#sgnp-test-email-modal').show();
    });
    
    $('#sgnp-send-test-email-btn').on('click', function() {
        var testEmail = $('#test-email-address').val();
        
        if (!testEmail) {
            alert('Please enter an email address');
            return;
        }
        
        var subject = $('#campaign-subject').val();
        var content = '';
        
        // Check if Stripo compiled test content is available
        var stripoCompiledTest = $('#stripo-compiled-test').val();
        
        if (stripoCompiledTest) {
            // Use Stripo compiled content from test button click
            content = stripoCompiledTest;
        } else {
            // Use regular template preview
            content = getEmailPreview();
        }
        
        if (!content || content.trim() === '') {
            alert('Please create email content before sending a test');
            return;
        }
        
        $(this).prop('disabled', true).text('Sending...');
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_send_test_email',
                nonce: sgnpAdmin.nonce,
                to_email: testEmail,
                subject: subject,
                content: content
            },
            success: function(response) {
                if (response.success) {
                    alert('Test email sent successfully!');
                    $('#sgnp-test-email-modal').hide();
                } else {
                    alert('Error: ' + response.data.message);
                }
            },
            error: function() {
                alert('An error occurred while sending the test email');
            },
            complete: function() {
                $('#sgnp-send-test-email-btn').prop('disabled', false).text('Send Test');
            }
        });
    });
    
    $('#sgnp-preview-campaign').on('click', function() {
        var preview = '';
        
        // Check if Stripo is being used
        var stripoHtml = $('#stripo-html-content').val();
        var stripoCss = $('#stripo-css-content').val();
        
        if (stripoHtml && stripoCss) {
            // Use Stripo compiled content
            preview = '<style>' + stripoCss + '</style>' + stripoHtml;
        } else {
            // Use regular template preview
            preview = getEmailPreview();
        }
        
        $('#sgnp-email-preview').html(preview);
        $('#sgnp-preview-modal').show();
    });
    
    function getEmailPreview() {
        var templateId = $('input[name="template_id"]:checked').val();
        var templateHtml = $('input[name="template_id"]:checked').data('template-html');
        var heading = $('#campaign-heading').val() || 'Your Heading Here';
        var subheading = $('#campaign-subheading').val() || 'Your subheading text';
        var content = '';
        
        if (typeof tinymce !== 'undefined' && tinymce.get('campaign_content')) {
            content = tinymce.get('campaign_content').getContent();
        } else {
            content = $('#campaign_content').val();
        }
        
        if (!content) {
            content = '<p>Your email content will appear here.</p>';
        }
        
        if (templateHtml) {
            var companyName = sgnpAdmin.companyName || 'Your Company';
            
            var html = templateHtml;
            html = html.replace(/\{\{heading\}\}/g, heading);
            html = html.replace(/\{\{subheading\}\}/g, subheading);
            html = html.replace(/\{\{content\}\}/g, content);
            html = html.replace(/\{\{company_name\}\}/g, companyName);
            html = html.replace(/\{\{year\}\}/g, new Date().getFullYear());
            html = html.replace(/\{\{unsubscribe_link\}\}/g, '#');
            
            return html;
        }
        
        return '<div style="max-width: 600px; margin: 0 auto;">' +
               '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 40px 20px; text-align: center;">' +
               '<h1>' + heading + '</h1>' +
               '<p>' + subheading + '</p>' +
               '</div>' +
               '<div style="padding: 40px 20px;">' +
               content +
               '</div>' +
               '<div style="background: #2c3e50; color: #fff; padding: 20px; text-align: center; font-size: 12px;">' +
               '<p>&copy; ' + new Date().getFullYear() + ' Your Company. All rights reserved.</p>' +
               '</div>' +
               '</div>';
    }
    
    // Campaign form submission is now handled inline in create-campaign.php
    // Send campaign button is also handled inline in create-campaign.php
    
    // Use event delegation for dynamically loaded content
    $(document).on('click', '.sgnp-edit-subscriber', function() {
        console.log('✏️ EDIT BUTTON CLICKED');
        var subscriberId = $(this).data('id');
        var subscriberLists = $(this).data('lists') || [];
        var row = $(this).closest('tr');
        
        console.log('Subscriber ID:', subscriberId);
        console.log('Modal exists?', $('#sgnp-edit-subscriber-modal').length);
        
        // Get subscriber data from table row
        var email = row.find('td:eq(0)').text().trim();
        var firstName = row.find('td:eq(1)').text().trim();
        var lastName = row.find('td:eq(2)').text().trim();
        var status = row.find('td:eq(0) .sgnp-badge').text().trim().toLowerCase();
        
        console.log('Extracted data:', {email, firstName, lastName, status});
        
        // Populate edit form
        $('#edit-subscriber-id').val(subscriberId);
        $('#edit-subscriber-email').val(email);
        $('#edit-subscriber-first-name').val(firstName);
        $('#edit-subscriber-last-name').val(lastName);
        $('#edit-subscriber-status').val(status);
        
        // Show modal with explicit z-index
        console.log('Showing modal...');
        $('#sgnp-edit-subscriber-modal').css({
            'display': 'flex',
            'z-index': '999999'
        });
        console.log('Modal visible?', $('#sgnp-edit-subscriber-modal').is(':visible'));
        
        // Load lists via AJAX and check the ones this subscriber belongs to
        loadListsForModal('edit-subscriber-lists', subscriberLists);
    });
    
    $('#sgnp-edit-subscriber-form').on('submit', function(e) {
        e.preventDefault();
        
        var selectedLists = [];
        $('#edit-subscriber-lists input[type="checkbox"]:checked').each(function() {
            selectedLists.push($(this).val());
        });
        
        var formData = {
            action: 'sgnp_update_subscriber',
            nonce: sgnpAdmin.nonce,
            subscriber_id: $('#edit-subscriber-id').val(),
            email: $('#edit-subscriber-email').val(),
            first_name: $('#edit-subscriber-first-name').val(),
            last_name: $('#edit-subscriber-last-name').val(),
            status: $('#edit-subscriber-status').val(),
            lists: selectedLists
        };
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    alert('Subscriber updated successfully!');
                    $('#sgnp-edit-subscriber-modal').hide();
                    location.reload(); // Reload to show updated data
                } else {
                    alert('Error: ' + (response.data?.message || 'Failed to update subscriber'));
                }
            },
            error: function() {
                alert('Network error occurred');
            }
        });
    });
    
    $('.sgnp-delete-subscriber').on('click', function() {
        if (!confirm('Are you sure you want to delete this subscriber?')) {
            return;
        }
        
        var subscriberId = $(this).data('id');
        var row = $(this).closest('tr');
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_delete_subscriber',
                nonce: sgnpAdmin.nonce,
                subscriber_id: subscriberId
            },
            success: function(response) {
                if (response.success) {
                    row.fadeOut(function() {
                        $(this).remove();
                    });
                } else {
                    alert('Error deleting subscriber');
                }
            }
        });
    });
    
    $('.sgnp-delete-campaign').on('click', function() {
        if (!confirm('Are you sure you want to delete this campaign?')) {
            return;
        }
        
        var campaignId = $(this).data('id');
        var row = $(this).closest('tr');
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_delete_campaign',
                nonce: sgnpAdmin.nonce,
                campaign_id: campaignId
            },
            success: function(response) {
                if (response.success) {
                    row.fadeOut(function() {
                        $(this).remove();
                    });
                } else {
                    alert('Error deleting campaign');
                }
            }
        });
    });
    
    $('#sgnp-test-config-btn').on('click', function() {
        var testEmail = $('#test-config-email').val();
        
        if (!testEmail) {
            alert('Please enter an email address');
            return;
        }
        
        $(this).prop('disabled', true).text('Sending...');
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_send_test_email',
                nonce: sgnpAdmin.nonce,
                to_email: testEmail,
                subject: 'SendGrid Newsletter Pro - Test Email',
                content: '<h1>Configuration Test</h1><p>If you receive this email, your SendGrid API is configured correctly!</p>'
            },
            success: function(response) {
                if (response.success) {
                    $('#sgnp-test-result').html('<div class="notice notice-success inline"><p>Test email sent successfully! Check your inbox.</p></div>');
                } else {
                    $('#sgnp-test-result').html('<div class="notice notice-error inline"><p>Error: ' + response.data.message + '</p></div>');
                }
            },
            error: function() {
                $('#sgnp-test-result').html('<div class="notice notice-error inline"><p>An error occurred while sending the test email</p></div>');
            },
            complete: function() {
                $('#sgnp-test-config-btn').prop('disabled', false).text('Send Test Email');
            }
        });
    });
    
    $('.sgnp-preview-template').on('click', function() {
        var templateId = $(this).data('id');
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_preview_template',
                nonce: sgnpAdmin.nonce,
                template_id: templateId
            },
            success: function(response) {
                if (response.success) {
                    $('#sgnp-template-preview-content').html(response.data.html);
                    $('#sgnp-template-preview-modal').show();
                } else {
                    alert('Error loading template preview');
                }
            },
            error: function() {
                alert('An error occurred while loading the preview');
            }
        });
    });
    
    $('#sgnp-create-template-btn').on('click', function() {
        $('#sgnp-create-template-modal').show();
    });
    
    $('#sgnp-create-template-form').on('submit', function(e) {
        e.preventDefault();
        
        var formData = {
            action: 'sgnp_create_template',
            nonce: sgnpAdmin.nonce,
            name: $('#template-name').val(),
            description: $('#template-description').val(),
            html: $('#template-html').val()
        };
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    alert('Template created successfully!');
                    location.reload();
                } else {
                    alert('Error: ' + (response.data.message || 'Failed to create template'));
                }
            },
            error: function() {
                alert('An error occurred while creating the template');
            }
        });
    });
    
    });
})(); // End defensive wrapper
