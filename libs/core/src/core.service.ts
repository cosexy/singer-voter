import { Injectable } from '@nestjs/common'
import { AnyKeys, FilterQuery, Model, UpdateQuery } from 'mongoose'
import { CoreDocument } from '@app/core/entities/core.entity'
import { PaginationFilter } from '~/shared/dto/pagination.filter'

@Injectable()
export class CoreService<T extends CoreDocument> {
  constructor(readonly model: Model<T>) {}

  async create(doc: AnyKeys<T>): Promise<T>

  async create(docs: AnyKeys<T>[]): Promise<T[]>

  async create(doc: AnyKeys<T> | AnyKeys<T>[]): Promise<T | T[]> {
    if (Array.isArray(doc)) {
      return this.model.insertMany(
        doc.map((d) => ({
          ...d,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }))
      )
    }
    return this.model.create({
      ...doc,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }

  async find(): Promise<T[]>
  async find(filter: FilterQuery<T>): Promise<T[]>
  async find(filter: FilterQuery<T>, options: PaginationFilter): Promise<T[]>

  async find(
    filter?: FilterQuery<T>,
    options?: PaginationFilter
  ): Promise<T[]> {
    const query = filter ? { ...filter } : {}
    const sort = options?.toMongoSort || PaginationFilter.defaultSort
    const queryBuilder = this.model.find(query).sort(sort)

    if (!options) {
      return queryBuilder.exec()
    }
    const { offset, limit } = options

    return queryBuilder.skip(offset).limit(limit).exec()
  }

  async get(filter: FilterQuery<T>): Promise<T | null> {
    // Todo: upsert user
    return this.model.findOne(filter)
  }

  async update(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true })
  }

  async remove(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter)
  }
}
