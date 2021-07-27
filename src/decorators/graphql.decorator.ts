import { ParseIntPipe } from '@nestjs/common';
import { Args, ArgsOptions, ID, Query, QueryOptions, ReturnTypeFunc } from '@nestjs/graphql';

export const IdArgs = () => Args('id', { type: () => ID }, ParseIntPipe);
export const DataArgs = (options?: ArgsOptions) => Args('data', options);
export const NullableQuery = (returnTypeFunc: ReturnTypeFunc, options?: QueryOptions) =>
  Query(returnTypeFunc, { ...options, nullable: true });
