import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatMapper } from './cat.mapper';
import CreateCatBody from './dto/create-cat.dto';

@Controller({ path: '/api/v1/cats' })
export class CatController {
  constructor(
    private readonly service: CatService,
    private readonly mapper: CatMapper,
  ) {}

  @Get('/all')
  async getAllCats() {
    const cats = await this.service.findAll();
    return cats.map((model) => this.mapper.toResponse(model));
  }

  @Post('/create')
  async createCat(@Body() body: CreateCatBody) {
    const id = await this.service.create({ ...body, breed: 'test' });
    return id;
  }
}
