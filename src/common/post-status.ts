export enum PostStatusName {
  DRAFT = '草稿',
  PUBLISH = '发布'
}
export enum PostStatus {
  DRAFT = 0,
  PUBLISH = 1
}
export function getStatusName(status: PostStatus): string {
  return status === PostStatus.PUBLISH
    ? PostStatusName.PUBLISH
    : PostStatusName.DRAFT
}
