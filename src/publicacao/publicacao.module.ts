import { Module } from '@nestjs/common';
import { PublicacaoService } from './publicacao.service';
import { PublicacaoController } from './publicacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacao } from './publicacao.entity';
import { TipoPublicacao } from './tipopublicacao.entity';
import { TagController } from '../tag/tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Publicacao, TipoPublicacao])],
  providers: [PublicacaoService],
  controllers: [PublicacaoController, TagController]
})
export class PublicacaoModule {}
