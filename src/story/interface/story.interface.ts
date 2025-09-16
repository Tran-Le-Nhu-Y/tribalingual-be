export default interface Story {
  id: string;
  authorId: string;
  publishedDate: Date;
  viewCount: number;
  commentCount: number;
  favoriteCount: number;
}

// export default interface Story {
//   id: string;
//   authorId: string;
//   adminId: string | null;

//   title: string;
//   description: string;
//   language: 'hmong' | 'english' | 'vietnamese';
//   hmongContent: string;
//   englishContent: string;
//   vietnameseContent: string;

//   publishedDate: Date;
//   viewCount: number;
//   commentCount: number;
//   favoriteCount: number;
// }
