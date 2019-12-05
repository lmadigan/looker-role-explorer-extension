const instancePermissions = [
  'create_prefetches',
  'embed_browse_spaces',
  'login_special_email',
  'manage_homepage',
  'manage_models',
  'manage_spaces',
  'see_logs',
  'see_queries',
  'see_schedules',
  'see_system_activity',
  'see_users',
  'sudo',
  'support_access_toggle',
]

const allAccessibleModels = [
  'see_pdts',
  'see_datagroups',
  'update_datagroups',
  'create_alerts',
  'follow_alerts',
  'send_outgoing_webhook',
  'send_to_s3',
  'send_to_sftp',
  'send_to_integration',
  'create_table_calculations',
  'save_content',
  'schedule_external_look_emails',
  'deploy',
]

const modelPermissions = [
  'access_data',
  'see_drill_overlay',
  'see_lookml_dashboards',
  'see_looks',
  'download_with_limit',
  'download_without_limit',
  'see_user_dashboards',
  'see_sql',
  'explore',
  'create_public_looks',
  'schedule_look_emails',
  'see_lookml',
  'use_sql_runner',
  'develop'
]

const categories = {
  'Admin': ['see_logs', 'see_queries', 'see_schedules', 'see_system_activity', 'see_pdts', 'see_datagroups', 'update_datagroups', 'see_users', 'sudo', 'support_access_toggle'], 
  'BI Interaction': ['embed_browse_spaces', 'manage_homepage', 'manage_spaces', 'see_drill_overlay', 'see_lookml_dashboards', 'see_looks', 'create_alerts', 'follow_alerts', 'see_user_dashboards', 'see_sql', 'explore', 'save_content'], 
  'Data Access': ['create_prefetches', 'login_special_email', 'access_data', 'send_outgoing_webhook', 'send_to_s3', 'send_to_sftp', 'send_to_integration', 'download_with_limit', 'download_without_limit', 'create_table_calculations', 'create_public_looks', 'schedule_look_emails', 'schedule_external_look_emails'], 
  'Development Tools': ['manage_models', 'see_lookml', 'use_sql_runner', 'develop', 'deploy']
}

export const distinct = (value: any, index: any, self: any) => {
  return self.indexOf(value) === index;
}

export function getUniquePermissions(permissionList1: string[], permissionList2: string[]) {
  let intersection = permissionList1.filter(x => permissionList2.includes(x));
  return intersection
}

export function getModelPermissions(permissionList: string[]) {
  return getUniquePermissions(permissionList, modelPermissions)
}

export function getInstancePermissions(permissionList: string[]) {
  return getUniquePermissions(permissionList, instancePermissions)
}

export function getAllAccessibleModelPermissions(permissionList: string[]) {
  return getUniquePermissions(permissionList, allAccessibleModels)
}