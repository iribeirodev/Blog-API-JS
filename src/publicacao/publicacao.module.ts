import { Module } from '@nestjs/common';
import { PublicacaoService } from './publicacao.service';
import { PublicacaoController } from './publicacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacao } from './publicacao.entity';
import { TipoPublicacao } from './tipopublicacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Publicacao, TipoPublicacao])],
  providers: [PublicacaoService],
  controllers: [PublicacaoController,]
})
export class PublicacaoModule {}
