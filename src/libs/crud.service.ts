import { Injectable } from '@nestjs/common';
import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository } from 'typeorm';

@Injectable()
export class CrudService<T> {
  constructor(protected readonly repo: Repository<T>) {}

  findMany(options?: FindManyOptions<T> | FindConditions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  findByIds(ids: (string | number | Date | ObjectID)[], options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.findByIds(ids, options);
  }

  findOne(id: string | number | Date | ObjectID, options?: FindOneOptions<T>): Promise<T>;
  findOne(options: FindOneOptions<T>): Promise<T>;
  findOne(conditions: FindConditions<T>, options?: FindOneOptions<T>): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findOne(arg1: any, arg2?: FindOneOptions<T>): Promise<T> {
    return this.repo.findOne(arg1, arg2);
  }

  create(dto: DeepPartial<T>): Promise<T> {
    const data = this.repo.create(dto);
    return this.repo.save(data);
  }

  async updateOne(conditions: FindConditions<T>, dto: DeepPartial<T>): Promise<T> {
    const data = await this.findOne(conditions);
    if (data) {
      return this.repo.save({ ...data, ...dto });
    }
  }

  async deleteOne(conditions: FindConditions<T> | FindOneOptions<T>): Promise<T> {
    const deletedData = await this.findOne(conditions);
    return this.removeOneEntity(deletedData);
  }

  protected async removeOneEntity(entity: T): Promise<T> {
    if (entity) {
      await this.repo.remove(entity);
      return entity;
    }
    return null;
  }

  protected async save(entity: T): Promise<T> {
    return this.repo.save(entity);
  }
}
