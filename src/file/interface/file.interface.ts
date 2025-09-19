export default interface File {
  id: string;
  storyId: string;
  filename: string;
  mime_type: string;
  size: number;
  url: string;
  save_path: string;
}
