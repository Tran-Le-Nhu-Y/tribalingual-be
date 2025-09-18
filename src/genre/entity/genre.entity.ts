import StoryEntity from 'src/story/entity/story.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export default class GenreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => StoryEntity, (story) => story.genre)
  stories: StoryEntity[];
}
