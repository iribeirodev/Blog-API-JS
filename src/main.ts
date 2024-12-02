import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseFormatInterceptor } from './infrastructure/interceptors/response-format.interceptor';
import { AllExceptionsFilter } from './infrastructure/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo api para todas as rotas
  app.setGlobalPrefix("api");

  // Obter frontend autorizado
  const frontendUrl = process.env.FRONTEND_URL || '';

  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  // interceptor para uso do apiresponse
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  // filtro de exceções globais
  app.useGlobalFilters(new AllExceptionsFilter());

  // Verifica se o ambiente é desenvolvimento
  const environment = process.env.NODE_ENV || 'development';

  
  Logger.log(`Aplicação iniciando no ambiente: ${environment}`, 'Bootstrap');
  
  if (environment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Blog API')
      .setDescription('Blog API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document); // Rota do Swagger
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
