import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as moment from 'moment';
import { Publicacao } from './publicacao.entity';
import { TipoPublicacao } from './tipopublicacao.entity';
import { PublicacaoAtivaDto } from './dto/publicacao-ativa.dto';
import { PublicacaoTextoDto } from './dto/publicacao-texto.dto';


@Injectable()
export class PublicacaoService {
    constructor(
        @InjectRepository(Publicacao) private readonly publicacaoRepo: Repository<Publicacao>,
        @InjectRepository(TipoPublicacao) private readonly tipoPublicacaoRepo: Repository<TipoPublicacao>,
    ) { }

    /**
     * Obtém todas as publicações ativas
     */
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
                url: publicacao.url,
                tipoPublicacao: publicacao.tipoPublicacao?.nome || '', 
                tags: publicacao.tags.split(',').map(tag => tag.trim()),
                tempoPublicadoEmDias,
                dataPublicacao:  moment(publicacao.data_publicacao).format('DD/MM/YYYY'),
                dataRevisao: publicacao.data_revisao ? moment(publicacao.data_revisao).format('DD/MM/YYYY') : '',
                imageLink: publicacao.image_link,
            } as PublicacaoAtivaDto; 
        })
    }

    /**
     * Dada a URL obtém uma publicação
     */
    async obterPublicacaoPorURL(criteria: string): Promise<PublicacaoTextoDto> {
        const publicacao = await this.publicacaoRepo.findOne({
            where: { 
                url: criteria
            },
            relations: ['tipoPublicacao']
        });

        return {
            titulo: publicacao.titulo,
            tipoPublicacao: publicacao.tipoPublicacao?.nome || '',
            tags: publicacao.tags.split(',').map(tag => tag.trim()),
            dataPublicacao:  moment(publicacao.data_publicacao).format('DD/MM/YYYY'),
            dataRevisao: publicacao.data_revisao ? moment(publicacao.data_revisao).format('DD/MM/YYYY') : '',
            texto: publicacao.texto

        } as PublicacaoTextoDto;
    }

    /**
     * Obtém as publicações que contenham a tag solicitada
     */
    async obterPublicacoesPorTag(tag: string): Promise<PublicacaoAtivaDto[]> {
        const criteria = tag.trim();

        if (!criteria) {
            return [];
        }


        const publicacoes = await this.publicacaoRepo.find({
            where: {
                tags: ILike(`%${criteria}%`),
                ativo: true
            },
            relations: ['tipoPublicacao'],
            order: { data_publicacao: 'DESC' }
        });


        return publicacoes.map((publicacao) => {
            const tempoPublicadoEmDias = this.calcularTempoPublicado(publicacao.data_publicacao);

            return {
                id: publicacao.id,
                titulo: publicacao.titulo,
                url: publicacao.url,
                tipoPublicacao: publicacao.tipoPublicacao?.nome || '', 
                tags: publicacao.tags.split(',').map(tag => tag.trim()),
                tempoPublicadoEmDias,
                dataPublicacao:  moment(publicacao.data_publicacao).format('DD/MM/YYYY'),
                dataRevisao: publicacao.data_revisao ? moment(publicacao.data_revisao).format('DD/MM/YYYY') : '',
                imageLink: publicacao.image_link,
            } as PublicacaoAtivaDto; 
        });        
    }

    /**
     * Obtém as publicações de um tipo específico
     */
    async obterPublicacoesPorTipo(tipo: string): Promise<PublicacaoAtivaDto[]> {
        // Busca o tipo de publicação pelo nome
        const tipoPublicacao = await this.tipoPublicacaoRepo.findOne({
            where: { nome: tipo },
        });

        // Se o tipo não for encontrado, retorna um array vazio
        if (!tipoPublicacao) {
            return [];
        }

        const publicacoes = await this.publicacaoRepo.find({
            where: {
                tipoPublicacao: tipoPublicacao,
                ativo: true
            },
            relations: ['tipoPublicacao'],
            order: {data_publicacao: 'DESC'}
        });

        return publicacoes.map((publicacao) => {
            const tempoPublicadoEmDias = this.calcularTempoPublicado(publicacao.data_publicacao);

            return {
                id: publicacao.id,
                titulo: publicacao.titulo,
                url: publicacao.url,
                tipoPublicacao: publicacao.tipoPublicacao?.nome || '', 
                tags: publicacao.tags.split(',').map(tag => tag.trim()),
                tempoPublicadoEmDias,
                dataPublicacao:  moment(publicacao.data_publicacao).format('DD/MM/YYYY'),
                dataRevisao: publicacao.data_revisao ? moment(publicacao.data_revisao).format('DD/MM/YYYY') : '',
                imageLink: publicacao.image_link,
            } as PublicacaoAtivaDto; 
        });
    }

    /**
     * Calcula o tempo da publicação de acordo com o parâmetro de data e retorna em dias, meses ou anos
     */
    private calcularTempoPublicado(dataPublicacao: Date): string {
        const agora = new Date();
        const diffEmMilissegundos = agora.getTime() - new Date(dataPublicacao).getTime();
        const diffEmDias = Math.floor(diffEmMilissegundos / (1000 * 60 * 60 * 24)); // Converte para dias

        if (diffEmDias < 30) {
            return `${diffEmDias} dia${diffEmDias === 1 ? '' : 's'}`;
        }

        const meses = Math.floor(diffEmDias / 30);
        if (meses < 12) {
            return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
        }

        const anos = Math.floor(meses / 12);
        return `${anos} ano${anos === 1 ? '' : 's'}`;
    }

}
