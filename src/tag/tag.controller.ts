import { Controller, Get, NotFoundException } from '@nestjs/common';
import { PublicacaoService } from 'src/publicacao/publicacao.service';

@Controller('tags')
export class TagController {
    constructor(private readonly publicacaoService: PublicacaoService) {}

    @Get('current')
    async obterTagsAtivas(): Promise<string[]> {
        const tags = await this.publicacaoService.obterTagsAtivas();
        if (!tags) {
          throw new NotFoundException('Nenhuma tag encontrada.');
        }        

        return tags;
    }
}
