import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PublicacaoService } from './publicacao.service';
import { PublicacaoAtivaDto } from './dto/publicacao-ativa.dto';

@Controller('publicacoes')
export class PublicacaoController {
  constructor(private readonly publicacaoService: PublicacaoService) { }

  @Get('current')
  async obterPublicacoesAtivas(): Promise<PublicacaoAtivaDto[]> {
    const publicacoes = await this.publicacaoService.obterPublicacoesAtivas();
    if (!publicacoes.length) {
      throw new NotFoundException("Nenhuma publicação encontrada.");
    }

    return publicacoes;
  }

  @Get('byurl/:url')
  async obterPublicacaoPorURL(@Param('url') url: string) {
    const publicacao = await this.publicacaoService.obterPublicacaoPorURL(url);
    if (!publicacao) {
      throw new NotFoundException('Publicação não encontrada.');
    }

    return publicacao;
  }

  @Get("bytag/:tag")
  async obterPublicacoesPorTag(@Param('tag') tag: string) {
    const publicacoes = await this.publicacaoService.obterPublicacoesPorTag(tag);
    if (!publicacoes.length) {
      throw new NotFoundException('Publicação não encontrada.');
    }

    return publicacoes;
  }

  @Get('bytype/:tipo')
  async obterPublicacoesPorTipo(@Param('tipo') tipo: string) {
    const publicacoes = await this.publicacaoService.obterPublicacoesPorTipo(tipo);
    if (!publicacoes.length) {
      throw new NotFoundException('Publicação não encontrada.');
    }

    return publicacoes;
  }
}
