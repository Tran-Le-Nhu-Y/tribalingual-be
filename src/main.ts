import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    methods: '*',
    origin: '*',
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      validationError: {
        target: true,
        value: true,
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('The Trilangual Project API')
    .setDescription(
      'This API is used for Trilangual Project. This is built by NestJS',
    )
    .setVersion('0.0.1-SNAPSHOT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token (without Bearer prefix)',
      },
      'access-token', // Tên này sẽ dùng để liên kết với @ApiBearerAuth() ở controller
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
