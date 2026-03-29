<?php
if (!defined('ABSPATH')) {
    exit;
}

// Check if viewing subscribers for a specific list
if (isset($_GET['view_subscribers'])) {
    $list_id = intval($_GET['view_subscribers']);
    $list = SGNP_List::get($list_id);
    
    // Get current client filter
    $current_client_id = SGNP_Admin::get_current_client_id();
    
    if (!$list) {
        echo '<div class="wrap"><h1>List Not Found</h1><p><a href="' . admin_url('admin.php?page=sgnp-lists') . '">Back to Lists</a></p></div>';
        return;
    }
    
    // Verify list belongs to current client (if filter is active)
    if ($current_client_id && $list->client_id != $current_client_id) {
        echo '<div class="wrap"><h1>Access Denied</h1><p>This list belongs to a different client.</p><p><a href="' . admin_url('admin.php?page=sgnp-lists') . '">Back to Lists</a></p></div>';
        return;
    }
    
    $subscribers = SGNP_List::get_subscribers($list_id);
    ?>
    
    <div class="wrap sgnp-plugin-page">
        <h1 class="wp-heading-inline">Subscribers in "<?php echo esc_html($list->name); ?>"</h1>
        <button type="button" class="page-title-action" id="sgnp-add-to-list-btn" data-list-id="<?php echo $list_id; ?>">Add Subscribers</button>
        <a href="<?php echo admin_url('admin.php?page=sgnp-lists'); ?>" class="page-title-action">← Back to Lists</a>
        
        <p class="description"><?php echo esc_html($list->description); ?></p>
        
        <p><strong><?php echo count($subscribers); ?></strong> subscriber(s) in this list</p>
        
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Status</th>
                    <th>Subscribe Date</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($subscribers)): ?>
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 40px;">
                            No subscribers in this list yet.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($subscribers as $subscriber): ?>
                        <tr>
                            <td><strong><?php echo esc_html($subscriber->email); ?></strong></td>
                            <td><?php echo esc_html($subscriber->first_name); ?></td>
                            <td><?php echo esc_html($subscriber->last_name); ?></td>
                            <td>
                                <span class="sgnp-badge sgnp-badge-<?php echo esc_attr($subscriber->status); ?>">
                                    <?php echo esc_html(ucfirst($subscriber->status)); ?>
                                </span>
                            </td>
                            <td><?php echo date('M j, Y', strtotime($subscriber->subscribe_date)); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
        
        <?php
        // Modal for adding subscribers to this list
        $all_subscribers = SGNP_Database::get_subscribers([
            'status' => 'all',
            'client_id' => $current_client_id ?: null
        ]);
        $current_subscriber_ids = array_map(function($sub) { return $sub->id; }, $subscribers);
        $available_subscribers = array_filter($all_subscribers, function($sub) use ($current_subscriber_ids) {
            return !in_array($sub->id, $current_subscriber_ids);
        });
        ?>
        <div id="sgnp-add-to-list-modal" class="sgnp-modal" style="display: none;">
            <div class="sgnp-modal-content">
                <span class="sgnp-modal-close">&times;</span>
                <h2>Add Subscribers to List</h2>
                
                <?php if (empty($available_subscribers)): ?>
                    <p>All subscribers are already in this list. <a href="<?php echo admin_url('admin.php?page=sgnp-subscribers'); ?>">Add new subscribers first</a>.</p>
                <?php else: ?>
                    <p>Select subscribers to add to "<?php echo esc_html($list->name); ?>":</p>
                    
                    <div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; margin: 10px 0;">
                        <?php foreach ($available_subscribers as $subscriber): ?>
                            <label style="display: block; padding: 8px; margin: 4px 0; background: #f9f9f9; border-radius: 4px;">
                                <input type="checkbox" class="sgnp-subscriber-to-add" value="<?php echo $subscriber->id; ?>">
                                <strong><?php echo esc_html($subscriber->email); ?></strong>
                                <?php if ($subscriber->first_name || $subscriber->last_name): ?>
                                    - <?php echo esc_html($subscriber->first_name . ' ' . $subscriber->last_name); ?>
                                <?php endif; ?>
                                <span class="sgnp-badge sgnp-badge-<?php echo esc_attr($subscriber->status); ?>" style="margin-left: 10px;">
                                    <?php echo esc_html(ucfirst($subscriber->status)); ?>
                                </span>
                            </label>
                        <?php endforeach; ?>
                    </div>
                    
                    <p>
                        <button type="button" id="sgnp-select-all-subscribers" class="button">Select All</button>
                        <button type="button" id="sgnp-deselect-all-subscribers" class="button">Deselect All</button>
                    </p>
                    
                    <button type="button" id="sgnp-add-subscribers-to-list-btn" class="button button-primary">Add Selected Subscribers</button>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <?php
    return; // Exit early to not show the lists table
}

// Get current client filter
$current_client_id = SGNP_Admin::get_current_client_id();
$lists = SGNP_List::get_all($current_client_id ?: null);
?>

<div class="wrap sgnp-plugin-page">
    <div class="sgnp-campaigns-header">
        <div>
            <h1 class="wp-heading-inline">Lists</h1>
        </div>
        <div class="sgnp-header-actions">
            <?php 
            $admin = new SGNP_Admin();
            $admin->render_client_selector(); 
            ?>
            <button type="button" class="page-title-action" id="sgnp-create-list-btn">Add New</button>
        </div>
    </div>
    
    <?php settings_errors('sgnp_messages'); ?>
    
    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th width="30%">List Name</th>
                <th>Description</th>
                <th>Subscribers</th>
                <th>Created Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($lists)): ?>
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px;">
                        No lists yet. <button type="button" class="button" id="sgnp-create-first-list">Create your first list</button>
                    </td>
                </tr>
            <?php else: ?>
                <?php foreach ($lists as $list): ?>
                    <tr>
                        <td><strong><?php echo esc_html($list->name); ?></strong></td>
                        <td><?php echo esc_html($list->description); ?></td>
                        <td><?php echo number_format(SGNP_List::count_subscribers($list->id)); ?></td>
                        <td><?php echo date('M j, Y', strtotime($list->created_date)); ?></td>
                        <td>
                            <button class="button button-small sgnp-edit-list" data-id="<?php echo $list->id; ?>">Edit</button>
                            <a href="<?php echo admin_url('admin.php?page=sgnp-lists&view_subscribers=' . $list->id); ?>" class="button button-small">View Subscribers</a>
                            <button class="button button-small button-link-delete sgnp-delete-list" data-id="<?php echo $list->id; ?>">Delete</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<div id="sgnp-create-list-modal" class="sgnp-modal" style="display: none;">
    <div class="sgnp-modal-content">
        <span class="sgnp-modal-close">&times;</span>
        <h2>Create New List</h2>
        
        <form method="post" id="sgnp-create-list-form">
            <?php wp_nonce_field('sgnp_create_list'); ?>
            
            <p>
                <label>List Name <span class="required">*</span></label>
                <input type="text" name="list_name" class="widefat" required>
            </p>
            
            <p>
                <label>Description</label>
                <textarea name="list_description" class="widefat" rows="3"></textarea>
            </p>
            
            <button type="submit" name="sgnp_create_list" class="button button-primary">Create List</button>
        </form>
    </div>
</div>

<div id="sgnp-edit-list-modal" class="sgnp-modal" style="display: none;">
    <div class="sgnp-modal-content">
        <span class="sgnp-modal-close">&times;</span>
        <h2>Edit List</h2>
        
        <form id="sgnp-edit-list-form">
            <input type="hidden" id="edit-list-id">
            
            <p>
                <label>List Name <span class="required">*</span></label>
                <input type="text" id="edit-list-name" class="widefat" required>
            </p>
            
            <p>
                <label>Description</label>
                <textarea id="edit-list-description" class="widefat" rows="3"></textarea>
            </p>
            
            <button type="submit" class="button button-primary">Update List</button>
        </form>
    </div>
</div>
