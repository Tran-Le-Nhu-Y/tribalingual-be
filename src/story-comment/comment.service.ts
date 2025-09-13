import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import CommentEntity from './entity/comment.entity';
import { CommentMapper } from './comment.mapper';
import Comment from './interface/comment.interface';
import CreateCommentBody from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private readonly mapper: CommentMapper,
  ) {}

  async findAll(): Promise<Comment[]> {
    const entities = await this.commentRepository.find();
    return entities.map((entity) => this.mapper.toModel(entity));
  }

  async findOne(id: string): Promise<Comment | null> {
    const entity = await this.commentRepository.findOneBy({ id });
    return entity !== null ? this.mapper.toModel(entity) : null;
  }

  async create(data: CreateCommentBody): Promise<string> {
    const entity = this.commentRepository.create({
      content: data.content,
      date: data.date,
    });
    const savedEntity = await this.commentRepository.save(entity);
    return savedEntity.id;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.commentRepository.delete(id);
    return result.affected !== 0; // true if a row was deleted, false otherwise
  }
}
