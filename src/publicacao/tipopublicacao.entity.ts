import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Publicacao } from './publicacao.entity';

@Entity('tipopublicacao')
export class TipoPublicacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  nome: string;

  @OneToMany(() => Publicacao, (publicacao) => publicacao.tipoPublicacao)
  publicacoes: Publicacao[];
}