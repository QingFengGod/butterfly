export enum PermissionCode {
  Home = 'home',
  About = 'about',
  User = 'user',
  AddUser = 'user:add',
  EditUser = 'user:edit',
  DeleteUser = 'user:delete'
}

export type PermissionKeyType = keyof typeof PermissionCode
