export const validatePermission = (permission: string, permissionSet: string[]) => {
  switch ( permission ) {
    case 'update_datagroups': 
      if ( permissionSet.indexOf('see_datagroups') === -1) {
        return 'Requires see_datagroups permissions'
      }
    case 'sudo':
      if (permissionSet.indexOf('see_users') === -1) {
        return 'Requires see_users permissions'
      }
    case 'see_drill_overlay' || 'see_lookml_dashboards' || 'see_looks': 
      if ( permissionSet.indexOf('access_data') === -1 ) {
        return 'Requires access_data permissions'
    }
    case 'see_user_dashboards' || 'create_alerts' || 'follow_alerts' || 'send_outgoing_webhook' || 
    'send_to_s3' || 'send_to_sftp' || 'send_to_integration' || 'schedule_look_emails' || 'download_with_limit' || 
    'download_without_limit' || 'see_sql' || 'explore' || 'save_content' || 'see_lookml':
      if ( permissionSet.indexOf('see_looks') === -1 ) {
        return 'Requires see_looks permissions'
      }
    case 'schedule_external_look_emails': 
      if ( permissionSet.indexOf('schedule_look_emails') === -1 ) {
        return 'Requires schedule_look_emails permissions'
      }
    case 'create_table_calculations': 
      if ( permissionSet.indexOf('explore') === -1 ) {
        return 'Requires explore permissions'
      }
    case 'create_public_looks': 
      if ( permissionSet.indexOf('save_content') === -1 ) {
        return 'Requires save_content permissions'
      }
    case 'develop' || 'use_sql_runner': 
      if ( permissionSet.indexOf('see_lookml') === -1 ) {
        return 'Requires see_lookml permissions'
      }
    case 'deploy' || 'support_access_toggle': 
      if ( permissionSet.indexOf('see_lookml') === -1 ) {
        return 'Requires see_lookml permissions'
      }
    default: 
      return false;
  }
}
