import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Publicacao } from './publicacao.entity';
import { ILike, Repository } from 'typeorm';
import { TipoPublicacao } from './tipopublicacao.entity';
import { PublicacaoAtivaDto } from './dto/publicacao-ativa.dto';

@Injectable()
export class PublicacaoService {
    constructor(
        @InjectRepository(Publicacao) private readonly publicacaoRepo: Repository<Publicacao>,
        @InjectRepository(TipoPublicacao) private readonly tipoPublicacaoRepo: Repository<TipoPublicacao>,
    ) { }

    async obterPublicacoesAtivas(): Promise<PublicacaoAtivaDto[]> {
        const publicacoes = await this.publicacaoRepo.find({
            where: { ativo: true },
            relations: ['tipoPublicacao'],
            order: { data_publicacao: 'DESC' },
        });

        return publicacoes.map((publicacao) => {
            const tempoPublicadoEmDias = this.calcularTempoPublicado(publicacao.data_publicacao);

            return {
                id: publicacao.id,
                titulo: publicacao.titulo,
                detalhe: publicacao.texto,
                url: publicacao.url,
                tipoPublicacao: publicacao.tipoPublicacao?.nome || '', 
                tags: publicacao.tags ? publicacao.tags.split(',') : [], // Converte string de tags em array
                tempoPublicadoEmDias,
                dataPublicacao: publicacao.data_publicacao.toISOString(),
                dataRevisao: publicacao.data_revisao?.toISOString() || null,
                imageLink: publicacao.image_link,
            } as PublicacaoAtivaDto; 
        })
    }

    async obterPublicacaoPorURL(url: string): Promise<Publicacao | null> {
        return this.publicacaoRepo.findOne({
            where: { url },
        });
    }

    async obterPublicacoesPorTag(tag: string): Promise<Publicacao[]> {
        const criteria = tag.trim();

        if (!criteria) {
            return [];
        }

        return this.publicacaoRepo.find({
            where: {
                // Busca case insensitive
                tags: ILike(`%${criteria}%`),
                ativo: true,
            },
            order: { data_publicacao: 'DESC' }
        });
    }

    async obterPublicacoesPorTipo(tipo: string): Promise<Publicacao[]> {
        // Busca o tipo de publicação pelo nome
        const tipoPublicacao = await this.tipoPublicacaoRepo.findOne({
            where: { nome: tipo },
        });

        // Se o tipo não for encontrado, retorna um array vazio
        if (!tipoPublicacao) {
            return [];
        }

        // Retorna as publicações que correspondem ao tipo e estão ativas
        return this.publicacaoRepo.find({
            where: {
                tipoPublicacao: tipoPublicacao,
                ativo: true,
            },
            order: { data_publicacao: 'DESC' },
        });
    }

    async obterTagsAtivas(): Promise<string[]> {
        const publicacoesAtivas = await this.obterPublicacoesAtivas();
    
        // Usa um Set para garantir unicidade
        const tagsSet = new Set(
            publicacoesAtivas
                .flatMap(p => p.tags?.map(tag => tag.trim()) || [])
                .filter(tag => tag?.trim()) // Remove tags vazias ou nulas
        );
    
        return Array.from(tagsSet).sort();
    }

    private calcularTempoPublicado(dataPublicacao: Date): number {
        const agora = new Date();
        const diffEmMilissegundos = agora.getTime() - new Date(dataPublicacao).getTime();
        return Math.floor(diffEmMilissegundos / (1000 * 60 * 60 * 24)); // Converte para dias
    }
}
