<?php
if (!defined('ABSPATH')) {
    exit;
}

$campaign_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$campaign = $campaign_id > 0 ? SGNP_Campaign::get($campaign_id) : null;
$lists = SGNP_List::get_all();
$selected_lists = $campaign_id > 0 ? SGNP_Campaign::get_selected_lists($campaign_id) : [];
$clients = SGNP_Client::get_all();
?>

<div class="wrap sgnp-plugin-page sgnp-create-campaign">
    <h1><?php echo $campaign ? 'Edit Campaign' : 'Create New Campaign'; ?></h1>
    
    <?php settings_errors('sgnp_messages'); ?>
    
    <form id="sgnp-campaign-form" method="post">
        <?php wp_nonce_field('sgnp_campaign', 'sgnp_campaign_nonce'); ?>
        <input type="hidden" name="campaign_id" id="campaign-id" value="<?php echo $campaign_id; ?>">
        <input type="hidden" name="sendgrid_template_id" id="sendgrid-template-id" value="<?php echo $campaign ? esc_attr($campaign->sendgrid_template_id) : ''; ?>">
        
        <div class="sgnp-campaign-builder">
            <div class="sgnp-campaign-sidebar">
                <div class="sgnp-panel">
                    <h3>Campaign Details</h3>
                    
                    <p>
                        <label>Campaign Name</label>
                        <input type="text" name="campaign_name" id="campaign-name" class="widefat" 
                               value="<?php echo $campaign ? esc_attr(stripslashes($campaign->name)) : ''; ?>" required>
                    </p>
                    
                    <p>
                        <label>Email Subject</label>
                        <input type="text" name="subject" id="campaign-subject" class="widefat" 
                               value="<?php echo $campaign ? esc_attr(stripslashes($campaign->subject)) : ''; ?>" required>
                    </p>
                    
                    <p>
                        <label>From Name</label>
                        <input type="text" name="from_name" id="campaign-from-name" class="widefat" 
                               value="<?php echo $campaign ? esc_attr(stripslashes($campaign->from_name)) : esc_attr(get_option('sgnp_from_name', get_bloginfo('name'))); ?>" required>
                    </p>
                    
                    <p>
                        <label>From Email</label>
                        <input type="email" name="from_email" id="campaign-from-email" class="widefat" 
                               value="<?php echo $campaign ? esc_attr($campaign->from_email) : esc_attr(get_option('sgnp_from_email', get_bloginfo('admin_email'))); ?>" required>
                    </p>
                    
                    <p>
                        <label>Reply To (Optional)</label>
                        <input type="email" name="reply_to" id="campaign-reply-to" class="widefat" 
                               value="<?php echo $campaign ? esc_attr($campaign->reply_to) : ''; ?>">
                    </p>
                    
                    <?php if (!empty($clients)): ?>
                    <p>
                        <label>Client (Optional)</label>
                        <select name="client_id" id="campaign-client-id" class="widefat">
                            <option value="">-- No Client (Use Main Account) --</option>
                            <?php foreach ($clients as $client): ?>
                                <option value="<?php echo $client->id; ?>" 
                                        <?php echo ($campaign && $campaign->client_id == $client->id) ? 'selected' : ''; ?>>
                                    <?php echo esc_html($client->name); ?>
                                    <?php if (!empty($client->subuser_username)): ?>
                                        (<?php echo esc_html($client->subuser_username); ?>)
                                    <?php endif; ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <small style="display: block; margin-top: 5px; color: #666;">
                            Assign to a client to use their SendGrid subuser for sending.
                        </small>
                    </p>
                    <?php else: ?>
                    <input type="hidden" name="client_id" value="">
                    <?php endif; ?>
                </div>
                
                <div class="sgnp-panel">
                    <h3>Select Lists</h3>
                    
                    <?php if (empty($lists)): ?>
                        <p>No lists created yet. <a href="<?php echo admin_url('admin.php?page=sgnp-lists'); ?>">Create a list</a></p>
                    <?php else: ?>
                        <?php foreach ($lists as $list): ?>
                            <label class="sgnp-checkbox-label">
                                <input type="checkbox" name="selected_lists[]" value="<?php echo $list->id; ?>" 
                                       <?php echo in_array($list->id, $selected_lists) ? 'checked' : ''; ?>>
                                <?php echo esc_html($list->name); ?> 
                                <small>(<?php echo SGNP_List::count_subscribers($list->id); ?> subscribers)</small>
                            </label>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="sgnp-campaign-content">
                <div class="sgnp-panel">
                    <h3>SendGrid Email Template</h3>
                    <p class="description">
                        Select a template from your SendGrid account. Create templates at 
                        <a href="https://mc.sendgrid.com/dynamic-templates" target="_blank">SendGrid Dynamic Templates</a>.
                    </p>
                    
                    <div id="sendgrid-templates-loading" style="padding: 40px; text-align: center;">
                        <span class="spinner is-active" style="float: none; margin: 0;"></span>
                        <p>Loading your SendGrid templates...</p>
                    </div>
                    
                    <div id="sendgrid-templates-error" style="display: none;">
                        <div class="notice notice-error inline">
                            <p id="templates-error-message"></p>
                        </div>
                    </div>
                    
                    <div id="sendgrid-templates-container" style="display: none;">
                        <div id="sendgrid-templates-grid" class="sgnp-template-grid"></div>
                    </div>
                    
                    <div id="sendgrid-no-templates" style="display: none; padding: 40px; text-align: center; background: #f8f9fa; border: 1px dashed #ddd; border-radius: 4px;">
                        <span class="dashicons dashicons-email" style="font-size: 64px; opacity: 0.3;"></span>
                        <h3>No Templates Found</h3>
                        <p>You don't have any SendGrid Dynamic Templates yet.</p>
                        <a href="https://mc.sendgrid.com/dynamic-templates" target="_blank" class="button button-primary">
                            Create Your First Template
                        </a>
                    </div>
                </div>
                
                <div class="sgnp-campaign-actions">
                    <button type="button" class="button button-large" id="sgnp-test-campaign">
                        <span class="dashicons dashicons-email"></span> Send Test Email
                    </button>
                    
                    <button type="submit" class="button button-primary button-large" id="sgnp-save-draft">
                        <span class="dashicons dashicons-saved"></span> Save Draft
                    </button>
                    
                    <button type="button" class="button button-primary button-large button-hero" id="sgnp-send-campaign" 
                            <?php echo (!$campaign || $campaign->status === 'sent') ? 'disabled' : ''; ?>>
                        <span class="dashicons dashicons-megaphone"></span> Send Campaign
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>

<div id="sgnp-test-email-modal" class="sgnp-modal" style="display: none;">
    <div class="sgnp-modal-content">
        <span class="sgnp-modal-close">&times;</span>
        <h2>Send Test Email</h2>
        <p>
            <label>Send test email to:</label>
            <input type="email" id="test-email-address" class="widefat" placeholder="your@email.com">
        </p>
        <p class="description">
            The test email will use sample data for dynamic variables (first_name, last_name, etc.)
        </p>
        <button type="button" class="button button-primary" id="sgnp-send-test-email-btn">Send Test</button>
    </div>
</div>

<script>
(function($) {
    'use strict';
    
    let selectedTemplateId = $('#sendgrid-template-id').val();
    
    // Load SendGrid templates on page load
    $(document).ready(function() {
        console.log('Initial selected template ID:', selectedTemplateId);
        loadSendGridTemplates();
    });
    
    function loadSendGridTemplates() {
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_get_sendgrid_templates',
                nonce: sgnpAdmin.nonce
            },
            success: function(response) {
                $('#sendgrid-templates-loading').hide();
                
                if (response.success && response.data.templates) {
                    const templates = response.data.templates;
                    
                    console.log('SendGrid Templates loaded:', templates.length, 'templates');
                    
                    if (templates.length === 0) {
                        $('#sendgrid-no-templates').show();
                    } else {
                        displayTemplates(templates);
                        $('#sendgrid-templates-container').show();
                    }
                } else {
                    // Enhanced error display with details
                    let errorMessage = response.data?.message || 'Failed to load templates';
                    if (response.data?.details) {
                        errorMessage += '\n\nDetails: ' + JSON.stringify(response.data.details, null, 2);
                    }
                    console.error('SendGrid Templates Error:', response.data);
                    showError(errorMessage);
                }
            },
            error: function(xhr, status, error) {
                $('#sendgrid-templates-loading').hide();
                console.error('AJAX Error loading templates:', xhr, status, error);
                showError('Network error loading templates: ' + error + '\n\nCheck browser console for details.');
            }
        });
    }
    
    function displayTemplates(templates) {
        const $grid = $('#sendgrid-templates-grid');
        $grid.empty();
        
        console.log('Displaying templates. Currently selected:', selectedTemplateId);
        
        templates.forEach(function(template) {
            const isSelected = template.id === selectedTemplateId;
            const versionInfo = template.active_version ? 
                `<small>Subject: ${template.active_version.subject || 'Not set'}</small>` : 
                '<small>No active version</small>';
            
            if (isSelected) {
                console.log('Template is pre-selected:', template.name, template.id);
            }
            
            const sendgridUrl = `https://mc.sendgrid.com/dynamic-templates/${template.id}/version/active`;
            
            const $card = $(`
                <div class="sgnp-template-card ${isSelected ? 'selected' : ''}" data-template-id="${template.id}">
                    <div class="sgnp-template-preview">
                        <span class="dashicons dashicons-email-alt"></span>
                    </div>
                    <div class="template-info">
                        <h4>${template.name}</h4>
                        ${versionInfo}
                        <p class="template-updated">Updated: ${formatDate(template.updated_at)}</p>
                        <p class="template-actions">
                            <a href="${sendgridUrl}" target="_blank" class="template-view-link" onclick="event.stopPropagation();">
                                <span class="dashicons dashicons-external"></span> View in SendGrid
                            </a>
                            <a href="#" class="template-debug-link" onclick="event.stopPropagation(); debugTemplate('${template.id}'); return false;">
                                <span class="dashicons dashicons-info"></span> Debug Versions
                            </a>
                        </p>
                    </div>
                </div>
            `);
            
            $card.on('click', function(e) {
                e.preventDefault();
                selectTemplate(template.id, template.name);
            });
            
            $grid.append($card);
        });
        
        // Log how many templates are selected
        console.log('Templates displayed. Selected count:', $('.sgnp-template-card.selected').length);
    }
    
    function selectTemplate(templateId, templateName) {
        selectedTemplateId = templateId;
        $('#sendgrid-template-id').val(templateId);
        
        // Visual feedback
        $('.sgnp-template-card').removeClass('selected');
        const $selectedCard = $(`.sgnp-template-card[data-template-id="${templateId}"]`);
        $selectedCard.addClass('selected');
        
        // Log for debugging
        console.log('Template selected:', templateName, '(ID:', templateId + ')');
        
        // Show confirmation
        $selectedCard.find('.sgnp-template-preview').append('<div class="template-checkmark">✓</div>');
        setTimeout(function() {
            $('.template-checkmark').fadeOut(300, function() { $(this).remove(); });
        }, 1000);
    }
    
    function showError(message) {
        $('#sendgrid-templates-error').show();
        // Use html() for multiline errors, but escape HTML to prevent XSS
        const escapedMessage = $('<div>').text(message).html().replace(/\n/g, '<br>');
        $('#templates-error-message').html(escapedMessage);
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    
    window.debugTemplate = function(templateId) {
        console.log('Debugging template:', templateId);
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: {
                action: 'sgnp_debug_template',
                nonce: sgnpAdmin.nonce,
                template_id: templateId
            },
            success: function(response) {
                if (response.success && response.data) {
                    const data = response.data;
                    let message = `Template: ${data.name}\nID: ${data.id}\nGeneration: ${data.generation}\n\n`;
                    
                    if (data.versions && data.versions.length > 0) {
                        message += `VERSIONS (${data.versions.length} total):\n\n`;
                        data.versions.forEach((v, index) => {
                            message += `Version ${index + 1}:\n`;
                            message += `  ID: ${v.id}\n`;
                            message += `  Name: ${v.name || 'Unnamed'}\n`;
                            message += `  Active: ${v.active == 1 ? '✅ YES (THIS IS WHAT API USES)' : '❌ NO'}\n`;
                            message += `  Subject: ${v.subject || 'Not set'}\n`;
                            message += `  Updated: ${v.updated_at}\n`;
                            message += `  HTML Length: ${v.html_content ? v.html_content.length : 0} characters\n`;
                            
                            // Show first 500 characters of HTML to diagnose content
                            if (v.html_content) {
                                const preview = v.html_content.substring(0, 500);
                                message += `  HTML Preview: ${preview}...\n`;
                            }
                            message += `\n`;
                        });
                        
                        // Show full HTML in console for inspection
                        if (data.versions[0] && data.versions[0].html_content) {
                            console.log('=== FULL HTML CONTENT FROM SENDGRID ===');
                            console.log(data.versions[0].html_content);
                            console.log('=== END HTML ===');
                            message += '\n📋 Full HTML logged to browser console (F12 → Console tab)\n';
                        }
                    } else {
                        message += 'NO VERSIONS FOUND!\n';
                    }
                    
                    alert(message);
                    console.log('Template Debug Data:', data);
                } else {
                    alert('Error: ' + (response.data?.message || 'Failed to debug template'));
                }
            },
            error: function(xhr, status, error) {
                alert('Network error: ' + error);
                console.error('Debug template error:', xhr, status, error);
            }
        });
    };
    
    // Form submission
    $('#sgnp-campaign-form').on('submit', function(e) {
        e.preventDefault();
        
        if (!selectedTemplateId) {
            alert('Please select a SendGrid template');
            return false;
        }
        
        const formData = {
            action: 'sgnp_save_campaign',
            nonce: sgnpAdmin.nonce,
            campaign_id: $('#campaign-id').val(),
            name: $('#campaign-name').val(),
            subject: $('#campaign-subject').val(),
            from_name: $('#campaign-from-name').val(),
            from_email: $('#campaign-from-email').val(),
            reply_to: $('#campaign-reply-to').val(),
            sendgrid_template_id: selectedTemplateId,
            status: 'draft',
            selected_lists: $('input[name="selected_lists[]"]:checked').map(function() {
                return $(this).val();
            }).get()
        };
        
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: formData,
            success: function(response) {
                if (response.success) {
                    $('#campaign-id').val(response.data.campaign_id);
                    alert('Campaign saved successfully!');
                    $('#sgnp-send-campaign').prop('disabled', false);
                } else {
                    alert('Error: ' + (response.data?.message || 'Failed to save campaign'));
                }
            },
            error: function(xhr, status, error) {
                alert('Error saving campaign: ' + error);
            }
        });
        
        return false;
    });
    
    // Test email
    $('#sgnp-test-campaign').on('click', function() {
        if (!selectedTemplateId) {
            alert('Please select a SendGrid template first');
            return;
        }
        $('#sgnp-test-email-modal').show();
    });
    
    $('.sgnp-modal-close').on('click', function() {
        $(this).closest('.sgnp-modal').hide();
    });
    
    $('#sgnp-send-test-email-btn').on('click', function() {
        const testEmail = $('#test-email-address').val();
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
                subject: $('#campaign-subject').val() || 'Test Email',
                template_id: selectedTemplateId
            },
            success: function(response) {
                $('#sgnp-send-test-email-btn').prop('disabled', false).text('Send Test');
                console.log('=== SendGrid Test Email Response ===');
                console.log('Full response:', response);
                if (response.data && response.data.template_id_sent) {
                    console.log('✅ Template ID sent to SendGrid:', response.data.template_id_sent);
                    console.log('✅ SendGrid response code:', response.data.status_code);
                }
                console.log('=== End Response ===');
                
                if (response.success) {
                    let msg = 'Test email sent successfully!';
                    if (response.data.template_id_sent) {
                        msg += '\n\n📧 Template ID used: ' + response.data.template_id_sent;
                        msg += '\n\n✅ Check your inbox and also check browser console (F12) for full details';
                    }
                    alert(msg);
                    $('#sgnp-test-email-modal').hide();
                } else {
                    alert('Error: ' + (response.data?.message || 'Failed to send test email'));
                }
            },
            error: function(xhr, status, error) {
                $('#sgnp-send-test-email-btn').prop('disabled', false).text('Send Test');
                console.error('Test email error:', xhr, status, error);
                console.error('Response text:', xhr.responseText);
                let errorMsg = 'Error sending test email: ' + error;
                if (xhr.responseText) {
                    try {
                        const errorData = JSON.parse(xhr.responseText);
                        if (errorData.data && errorData.data.message) {
                            errorMsg += '\n\n' + errorData.data.message;
                        }
                    } catch (e) {
                        errorMsg += '\n\nServer error. Check console for details.';
                    }
                }
                alert(errorMsg);
            }
        });
    });
    
    // Send campaign
    $('#sgnp-send-campaign').on('click', function() {
        const campaignId = $('#campaign-id').val();
        if (!campaignId || campaignId === '0') {
            alert('Please save the campaign first before sending');
            return;
        }
        
        // Check if lists are selected
        const checkedLists = $('input[name="selected_lists[]"]:checked').length;
        if (checkedLists === 0) {
            alert('Please select at least one list before sending the campaign.');
            return;
        }
        
        if (!confirm('Are you sure you want to send this campaign to ' + checkedLists + ' list(s)? This action cannot be undone.')) {
            return;
        }
        
        $(this).prop('disabled', true).text('Saving and sending...');
        
        // First, save the campaign with current list selections
        const saveData = {
            action: 'sgnp_save_campaign',
            nonce: sgnpAdmin.nonce,
            campaign_id: campaignId,
            name: $('#campaign-name').val(),
            subject: $('#campaign-subject').val(),
            from_name: $('#campaign-from-name').val(),
            from_email: $('#campaign-from-email').val(),
            reply_to: $('#campaign-reply-to').val(),
            sendgrid_template_id: selectedTemplateId,
            status: 'draft',
            selected_lists: $('input[name="selected_lists[]"]:checked').map(function() {
                return $(this).val();
            }).get()
        };
        
        // Save first, then send
        $.ajax({
            url: sgnpAdmin.ajaxUrl,
            type: 'POST',
            data: saveData,
            success: function(saveResponse) {
                if (!saveResponse.success) {
                    alert('Error saving campaign before sending: ' + (saveResponse.data?.message || 'Unknown error'));
                    $('#sgnp-send-campaign').prop('disabled', false).text('Send Campaign');
                    return;
                }
                
                // Now send the campaign
                $.ajax({
                    url: sgnpAdmin.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'sgnp_send_campaign',
                        nonce: sgnpAdmin.nonce,
                        campaign_id: campaignId
                    },
                    success: function(response) {
                        if (response.success) {
                            let message = 'Campaign sent!\n\nSent: ' + response.data.sent + '\nFailed: ' + response.data.failed;
                            
                            if (response.data.errors && response.data.errors.length > 0) {
                                message += '\n\nErrors:\n';
                                response.data.errors.forEach(function(error) {
                                    message += '• ' + error.email + ': ' + error.error + '\n';
                                });
                            }
                            
                            alert(message);
                            window.location.href = '<?php echo admin_url('admin.php?page=sgnp-campaigns'); ?>';
                        } else {
                            alert('Error: ' + (response.data?.message || 'Failed to send campaign'));
                            $('#sgnp-send-campaign').prop('disabled', false).text('Send Campaign');
                        }
                    },
                    error: function(xhr, status, error) {
                        alert('Error sending campaign: ' + error);
                        $('#sgnp-send-campaign').prop('disabled', false).text('Send Campaign');
                    }
                });
            },
            error: function(xhr, status, error) {
                alert('Error saving campaign: ' + error);
                $('#sgnp-send-campaign').prop('disabled', false).text('Send Campaign');
            }
        });
    });
    
})(jQuery);
</script>
