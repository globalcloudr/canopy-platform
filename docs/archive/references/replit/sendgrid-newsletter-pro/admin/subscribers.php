<?php
if (!defined('ABSPATH')) {
    exit;
}

// Get current client filter
$current_client_id = SGNP_Admin::get_current_client_id();
$subscribers = SGNP_Database::get_subscribers([
    'status' => 'all',
    'client_id' => $current_client_id ?: null
]);
?>

<!-- Direct script injection - WordPress enqueue was blocking dependencies -->
<script>
var sgnpAdmin = {
    ajaxUrl: '<?php echo admin_url('admin-ajax.php'); ?>',
    nonce: '<?php echo wp_create_nonce('sgnp_nonce'); ?>',
    companyName: '<?php echo esc_js(get_option('sgnp_company_name', get_bloginfo('name'))); ?>'
};
</script>
<script src="<?php echo SGNP_PLUGIN_URL . 'assets/js/admin.js?ver=' . SGNP_VERSION . '.' . time(); ?>"></script>

<div class="wrap sgnp-plugin-page">
    <div class="sgnp-campaigns-header">
        <div>
            <h1 class="wp-heading-inline">Subscribers</h1>
        </div>
        <div class="sgnp-header-actions">
            <?php 
            $admin = new SGNP_Admin();
            $admin->render_client_selector(); 
            ?>
            <button type="button" class="page-title-action" id="sgnp-add-subscriber-btn">Add New</button>
            <button type="button" class="page-title-action" id="sgnp-import-subscribers-btn">Import CSV</button>
        </div>
    </div>
    
    <?php settings_errors('sgnp_messages'); ?>
    
    <div class="sgnp-subscribers-stats">
        <span class="sgnp-stat">
            <strong><?php echo number_format(SGNP_Database::count_subscribers('subscribed', $current_client_id ?: null)); ?></strong> Subscribed
        </span>
        <span class="sgnp-stat">
            <strong><?php echo number_format(SGNP_Database::count_subscribers('unsubscribed', $current_client_id ?: null)); ?></strong> Unsubscribed
        </span>
        <span class="sgnp-stat">
            <strong><?php echo number_format(SGNP_Database::count_subscribers('all', $current_client_id ?: null)); ?></strong> Total
        </span>
    </div>
    
    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Status</th>
                <th>Subscribe Date</th>
                <th>Lists</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($subscribers)): ?>
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        No subscribers yet. <button type="button" class="button" id="sgnp-add-first-subscriber">Add your first subscriber</button>
                    </td>
                </tr>
            <?php else: ?>
                <?php foreach ($subscribers as $subscriber): ?>
                    <?php $lists = SGNP_Subscriber::get_lists($subscriber->id); ?>
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
                        <td>
                            <?php if (empty($lists)): ?>
                                <em>No lists</em>
                            <?php else: ?>
                                <?php foreach ($lists as $list): ?>
                                    <span class="sgnp-tag"><?php echo esc_html($list->name); ?></span>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php 
                            $list_ids = array_map(function($list) { return (int)$list->id; }, $lists);
                            ?>
                            <button class="button button-small sgnp-edit-subscriber" 
                                    data-id="<?php echo $subscriber->id; ?>"
                                    data-lists="<?php echo esc_attr(json_encode($list_ids)); ?>">Edit</button>
                            <button class="button button-small button-link-delete sgnp-delete-subscriber" data-id="<?php echo $subscriber->id; ?>">Delete</button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- MODALS - NO PHP FUNCTIONS HERE - Will populate lists via JavaScript -->

<div id="sgnp-add-subscriber-modal" class="sgnp-modal" style="display: none;">
    <div class="sgnp-modal-content">
        <span class="sgnp-modal-close">&times;</span>
        <h2>Add New Subscriber</h2>
        
        <form method="post" id="sgnp-add-subscriber-form">
            <?php wp_nonce_field('sgnp_add_subscriber'); ?>
            
            <p>
                <label>Email <span class="required">*</span></label>
                <input type="email" name="email" class="widefat" required>
            </p>
            
            <p>
                <label>First Name</label>
                <input type="text" name="first_name" class="widefat">
            </p>
            
            <p>
                <label>Last Name</label>
                <input type="text" name="last_name" class="widefat">
            </p>
            
            <p>
                <label>Add to Lists (Optional)</label>
                <div class="sgnp-checkbox-group" id="add-subscriber-lists">
                    <em>Lists will be loaded...</em>
                </div>
            </p>
            
            <button type="submit" name="sgnp_add_subscriber" class="button button-primary">Add Subscriber</button>
        </form>
    </div>
</div>

<!-- Edit Subscriber Modal -->
<div id="sgnp-edit-subscriber-modal" class="sgnp-modal" style="display: none;">
    <div class="sgnp-modal-content">
        <span class="sgnp-modal-close">&times;</span>
        <h2>Edit Subscriber</h2>
        
        <form id="sgnp-edit-subscriber-form">
            <input type="hidden" name="subscriber_id" id="edit-subscriber-id">
            
            <p>
                <label>Email <span class="required">*</span></label>
                <input type="email" name="email" id="edit-subscriber-email" class="widefat" required>
            </p>
            
            <p>
                <label>First Name</label>
                <input type="text" name="first_name" id="edit-subscriber-first-name" class="widefat">
            </p>
            
            <p>
                <label>Last Name</label>
                <input type="text" name="last_name" id="edit-subscriber-last-name" class="widefat">
            </p>
            
            <p>
                <label>Status</label>
                <select name="status" id="edit-subscriber-status" class="widefat">
                    <option value="subscribed">Subscribed</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="bounced">Bounced</option>
                </select>
            </p>
            
            <p>
                <label>Lists</label>
                <div class="sgnp-checkbox-group" id="edit-subscriber-lists">
                    <em>Lists will be loaded...</em>
                </div>
            </p>
            
            <button type="submit" class="button button-primary">Update Subscriber</button>
        </form>
    </div>
</div>

<div id="sgnp-import-csv-modal" class="sgnp-modal" style="display: none;">
    <div class="sgnp-modal-content">
        <span class="sgnp-modal-close">&times;</span>
        <h2>Import Subscribers from CSV</h2>
        
        <p>Upload a CSV file with columns: <code>email</code>, <code>first_name</code>, <code>last_name</code></p>
        
        <form method="post" enctype="multipart/form-data" id="sgnp-import-csv-form">
            <?php wp_nonce_field('sgnp_import_csv'); ?>
            
            <p>
                <input type="file" name="csv_file" accept=".csv" required>
            </p>
            
            <button type="submit" name="sgnp_import_csv" class="button button-primary">Import</button>
        </form>
    </div>
</div>

