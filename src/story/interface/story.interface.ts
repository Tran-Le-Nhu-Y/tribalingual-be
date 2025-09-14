export default interface Story {
  id: string;
  title: string;
  authorId: string;
  publishedDate: Date;
  viewCount: number;
  commentCount: number;
  favoriteCount: number;
}
