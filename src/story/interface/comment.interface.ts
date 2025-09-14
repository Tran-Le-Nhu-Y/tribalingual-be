export default interface Comment {
  id: string;
  storyId: string;
  userId: string;
  content: string;
  createdAt: Date;
}
