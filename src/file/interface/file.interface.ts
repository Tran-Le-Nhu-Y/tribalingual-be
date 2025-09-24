export default interface File {
  id: string;
  storyId?: string | null;
  name: string;
  mime_type: string;
  size: number;
  url: string;
  save_path: string;
}
