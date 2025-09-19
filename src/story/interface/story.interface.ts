import { StoryStatus } from '../entity/story.entity';

export default interface Story {
  id: string;
  authorId: string;
  adminId?: string | null;
  genreId: string;
  fileId?: string | null;

  title: string;
  description: string;
  language: string;
  hmongContent?: string | null;
  englishContent?: string | null;
  vietnameseContent?: string | null;
  status: StoryStatus;

  uploadedDate?: Date | null;
  publishedDate?: Date | null;
  lastUpdatedDate?: Date | null;

  viewCount: number;
  commentCount: number;
  favoriteCount: number;
}
