import { ParseIntPipe } from '@nestjs/common';
import { Args, ID, Query, QueryOptions, ReturnTypeFunc } from '@nestjs/graphql';

export const IdArgs = () => Args('id', { type: () => ID }, ParseIntPipe);
export const DataArgs = () => Args('data');
export const NullableQuery = (returnTypeFunc: ReturnTypeFunc, options?: QueryOptions) =>
  Query(returnTypeFunc, { ...options, nullable: true });
