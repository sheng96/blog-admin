// 用户权限枚举
export enum UserPermission {
  // 普通用户
  User,
  // 管理员
  Admin,
  // 超级管理员
  Root
}
// 根据枚举值获取枚举名称
export function getPermissionName(permission: UserPermission) {
  switch (permission) {
    case UserPermission.Root:
      return '超级管理员'
    case UserPermission.Admin:
      return '管理员'
    case UserPermission.User:
      return '普通用户'
    default:
      return '未知'
  }
}
