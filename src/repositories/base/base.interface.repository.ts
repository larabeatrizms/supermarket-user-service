import { DeleteResult } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: T | any): Promise<T>;

  createMany(data: T[] | any[]): Promise<T[]>;

  update(data: T | any): Promise<T>;

  findOneById(id: number): Promise<T>;

  findOneByCondition(filterCondition: any): Promise<T>;

  findAll(): Promise<T[]>;

  remove(id: number): Promise<DeleteResult>;

  findOneWithRelations(relations: any): Promise<T>;

  findWithRelations(relations: any): Promise<T[]>;
}
