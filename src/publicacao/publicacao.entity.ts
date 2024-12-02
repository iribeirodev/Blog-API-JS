import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipoPublicacao } from "./tipopublicacao.entity";

@Entity('publicacoes')
export class Publicacao {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => TipoPublicacao, (tipoPublicacao) => tipoPublicacao.publicacoes)
    @JoinColumn({ name: 'id_tipopublicacao'})
    tipoPublicacao: TipoPublicacao;

    @Column({ length: 255, nullable: true })
    titulo: string;
  
    @Column({ length: 150, nullable: true })
    tags: string;
  
    @Column({ length: 500, nullable: true })
    url: string;
  
    @Column({ type: 'timestamp' })
    data_publicacao: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    data_revisao: Date;
  
    @Column({ type: 'tinyint' })
    ativo: boolean;
  
    @Column({ type: 'text' })
    texto: string;
  
    @Column({ length: 255, nullable: true })
    image_link: string;    
}
