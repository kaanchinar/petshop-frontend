/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * PetPet API
 * Backend API for PetPet online pet shop and adoption platform
 * OpenAPI spec version: v1
 */
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  CreateReviewDto,
  GetApiReviewsCanReviewParams,
  ProductReviewSummaryDto,
  ReviewDto,
  ReviewHelpfulnessDto,
  UpdateReviewDto
} from '../petPetAPI.schemas';

import { customAxios } from '../../axios';




export const postApiReviews = (
    createReviewDto: CreateReviewDto,
 signal?: AbortSignal
) => {
      
      
      return customAxios<ReviewDto>(
      {url: `http://localhost:8080/api/Reviews`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createReviewDto, signal
    },
      );
    }
  


export const getPostApiReviewsMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiReviews>>, TError,{data: CreateReviewDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiReviews>>, TError,{data: CreateReviewDto}, TContext> => {

const mutationKey = ['postApiReviews'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiReviews>>, {data: CreateReviewDto}> = (props) => {
          const {data} = props ?? {};

          return  postApiReviews(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiReviewsMutationResult = NonNullable<Awaited<ReturnType<typeof postApiReviews>>>
    export type PostApiReviewsMutationBody = CreateReviewDto
    export type PostApiReviewsMutationError = unknown

    export const usePostApiReviews = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiReviews>>, TError,{data: CreateReviewDto}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiReviews>>,
        TError,
        {data: CreateReviewDto},
        TContext
      > => {

      const mutationOptions = getPostApiReviewsMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    export const putApiReviewsId = (
    id: number,
    updateReviewDto: UpdateReviewDto,
 ) => {
      
      
      return customAxios<ReviewDto>(
      {url: `http://localhost:8080/api/Reviews/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: updateReviewDto
    },
      );
    }
  


export const getPutApiReviewsIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiReviewsId>>, TError,{id: number;data: UpdateReviewDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof putApiReviewsId>>, TError,{id: number;data: UpdateReviewDto}, TContext> => {

const mutationKey = ['putApiReviewsId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof putApiReviewsId>>, {id: number;data: UpdateReviewDto}> = (props) => {
          const {id,data} = props ?? {};

          return  putApiReviewsId(id,data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PutApiReviewsIdMutationResult = NonNullable<Awaited<ReturnType<typeof putApiReviewsId>>>
    export type PutApiReviewsIdMutationBody = UpdateReviewDto
    export type PutApiReviewsIdMutationError = unknown

    export const usePutApiReviewsId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof putApiReviewsId>>, TError,{id: number;data: UpdateReviewDto}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof putApiReviewsId>>,
        TError,
        {id: number;data: UpdateReviewDto},
        TContext
      > => {

      const mutationOptions = getPutApiReviewsIdMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    export const deleteApiReviewsId = (
    id: number,
 ) => {
      
      
      return customAxios<void>(
      {url: `http://localhost:8080/api/Reviews/${id}`, method: 'DELETE'
    },
      );
    }
  


export const getDeleteApiReviewsIdMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiReviewsId>>, TError,{id: number}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof deleteApiReviewsId>>, TError,{id: number}, TContext> => {

const mutationKey = ['deleteApiReviewsId'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteApiReviewsId>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  deleteApiReviewsId(id,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type DeleteApiReviewsIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApiReviewsId>>>
    
    export type DeleteApiReviewsIdMutationError = unknown

    export const useDeleteApiReviewsId = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteApiReviewsId>>, TError,{id: number}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteApiReviewsId>>,
        TError,
        {id: number},
        TContext
      > => {

      const mutationOptions = getDeleteApiReviewsIdMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    export const getApiReviewsId = (
    id: number,
 signal?: AbortSignal
) => {
      
      
      return customAxios<ReviewDto>(
      {url: `http://localhost:8080/api/Reviews/${id}`, method: 'GET', signal
    },
      );
    }
  

export const getGetApiReviewsIdQueryKey = (id: number,) => {
    return [`http://localhost:8080/api/Reviews/${id}`] as const;
    }

    
export const getGetApiReviewsIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiReviewsId>>, TError = unknown>(id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiReviewsIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiReviewsId>>> = ({ signal }) => getApiReviewsId(id, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiReviewsIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiReviewsId>>>
export type GetApiReviewsIdQueryError = unknown


export function useGetApiReviewsId<TData = Awaited<ReturnType<typeof getApiReviewsId>>, TError = unknown>(
 id: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsId>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsId<TData = Awaited<ReturnType<typeof getApiReviewsId>>, TError = unknown>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsId>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsId<TData = Awaited<ReturnType<typeof getApiReviewsId>>, TError = unknown>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetApiReviewsId<TData = Awaited<ReturnType<typeof getApiReviewsId>>, TError = unknown>(
 id: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiReviewsIdQueryOptions(id,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



export const getApiReviewsProductProductId = (
    productId: number,
 signal?: AbortSignal
) => {
      
      
      return customAxios<ReviewDto[]>(
      {url: `http://localhost:8080/api/Reviews/product/${productId}`, method: 'GET', signal
    },
      );
    }
  

export const getGetApiReviewsProductProductIdQueryKey = (productId: number,) => {
    return [`http://localhost:8080/api/Reviews/product/${productId}`] as const;
    }

    
export const getGetApiReviewsProductProductIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError = unknown>(productId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiReviewsProductProductIdQueryKey(productId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiReviewsProductProductId>>> = ({ signal }) => getApiReviewsProductProductId(productId, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(productId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiReviewsProductProductIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiReviewsProductProductId>>>
export type GetApiReviewsProductProductIdQueryError = unknown


export function useGetApiReviewsProductProductId<TData = Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError = unknown>(
 productId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsProductProductId>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsProductProductId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsProductProductId<TData = Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError = unknown>(
 productId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsProductProductId>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsProductProductId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsProductProductId<TData = Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError = unknown>(
 productId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetApiReviewsProductProductId<TData = Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError = unknown>(
 productId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiReviewsProductProductIdQueryOptions(productId,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



export const getApiReviewsProductProductIdSummary = (
    productId: number,
 signal?: AbortSignal
) => {
      
      
      return customAxios<ProductReviewSummaryDto>(
      {url: `http://localhost:8080/api/Reviews/product/${productId}/summary`, method: 'GET', signal
    },
      );
    }
  

export const getGetApiReviewsProductProductIdSummaryQueryKey = (productId: number,) => {
    return [`http://localhost:8080/api/Reviews/product/${productId}/summary`] as const;
    }

    
export const getGetApiReviewsProductProductIdSummaryQueryOptions = <TData = Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError = unknown>(productId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiReviewsProductProductIdSummaryQueryKey(productId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>> = ({ signal }) => getApiReviewsProductProductIdSummary(productId, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(productId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiReviewsProductProductIdSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>>
export type GetApiReviewsProductProductIdSummaryQueryError = unknown


export function useGetApiReviewsProductProductIdSummary<TData = Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError = unknown>(
 productId: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsProductProductIdSummary<TData = Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError = unknown>(
 productId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsProductProductIdSummary<TData = Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError = unknown>(
 productId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetApiReviewsProductProductIdSummary<TData = Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError = unknown>(
 productId: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsProductProductIdSummary>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiReviewsProductProductIdSummaryQueryOptions(productId,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



export const getApiReviewsUserUserId = (
    userId: string,
 signal?: AbortSignal
) => {
      
      
      return customAxios<ReviewDto[]>(
      {url: `http://localhost:8080/api/Reviews/user/${userId}`, method: 'GET', signal
    },
      );
    }
  

export const getGetApiReviewsUserUserIdQueryKey = (userId: string,) => {
    return [`http://localhost:8080/api/Reviews/user/${userId}`] as const;
    }

    
export const getGetApiReviewsUserUserIdQueryOptions = <TData = Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError = unknown>(userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiReviewsUserUserIdQueryKey(userId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiReviewsUserUserId>>> = ({ signal }) => getApiReviewsUserUserId(userId, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(userId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiReviewsUserUserIdQueryResult = NonNullable<Awaited<ReturnType<typeof getApiReviewsUserUserId>>>
export type GetApiReviewsUserUserIdQueryError = unknown


export function useGetApiReviewsUserUserId<TData = Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError = unknown>(
 userId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsUserUserId>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsUserUserId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsUserUserId<TData = Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError = unknown>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsUserUserId>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsUserUserId>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsUserUserId<TData = Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError = unknown>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetApiReviewsUserUserId<TData = Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError = unknown>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsUserUserId>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiReviewsUserUserIdQueryOptions(userId,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



export const getApiReviewsMy = (
    
 signal?: AbortSignal
) => {
      
      
      return customAxios<ReviewDto[]>(
      {url: `http://localhost:8080/api/Reviews/my`, method: 'GET', signal
    },
      );
    }
  

export const getGetApiReviewsMyQueryKey = () => {
    return [`http://localhost:8080/api/Reviews/my`] as const;
    }

    
export const getGetApiReviewsMyQueryOptions = <TData = Awaited<ReturnType<typeof getApiReviewsMy>>, TError = unknown>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsMy>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiReviewsMyQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiReviewsMy>>> = ({ signal }) => getApiReviewsMy(signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsMy>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiReviewsMyQueryResult = NonNullable<Awaited<ReturnType<typeof getApiReviewsMy>>>
export type GetApiReviewsMyQueryError = unknown


export function useGetApiReviewsMy<TData = Awaited<ReturnType<typeof getApiReviewsMy>>, TError = unknown>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsMy>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsMy>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsMy>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsMy<TData = Awaited<ReturnType<typeof getApiReviewsMy>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsMy>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsMy>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsMy>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsMy<TData = Awaited<ReturnType<typeof getApiReviewsMy>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsMy>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetApiReviewsMy<TData = Awaited<ReturnType<typeof getApiReviewsMy>>, TError = unknown>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsMy>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiReviewsMyQueryOptions(options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



export const postApiReviewsHelpfulness = (
    reviewHelpfulnessDto: ReviewHelpfulnessDto,
 signal?: AbortSignal
) => {
      
      
      return customAxios<void>(
      {url: `http://localhost:8080/api/Reviews/helpfulness`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: reviewHelpfulnessDto, signal
    },
      );
    }
  


export const getPostApiReviewsHelpfulnessMutationOptions = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiReviewsHelpfulness>>, TError,{data: ReviewHelpfulnessDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<typeof postApiReviewsHelpfulness>>, TError,{data: ReviewHelpfulnessDto}, TContext> => {

const mutationKey = ['postApiReviewsHelpfulness'];
const {mutation: mutationOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof postApiReviewsHelpfulness>>, {data: ReviewHelpfulnessDto}> = (props) => {
          const {data} = props ?? {};

          return  postApiReviewsHelpfulness(data,)
        }

        


  return  { mutationFn, ...mutationOptions }}

    export type PostApiReviewsHelpfulnessMutationResult = NonNullable<Awaited<ReturnType<typeof postApiReviewsHelpfulness>>>
    export type PostApiReviewsHelpfulnessMutationBody = ReviewHelpfulnessDto
    export type PostApiReviewsHelpfulnessMutationError = unknown

    export const usePostApiReviewsHelpfulness = <TError = unknown,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof postApiReviewsHelpfulness>>, TError,{data: ReviewHelpfulnessDto}, TContext>, }
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof postApiReviewsHelpfulness>>,
        TError,
        {data: ReviewHelpfulnessDto},
        TContext
      > => {

      const mutationOptions = getPostApiReviewsHelpfulnessMutationOptions(options);

      return useMutation(mutationOptions , queryClient);
    }
    export const getApiReviewsCanReview = (
    params?: GetApiReviewsCanReviewParams,
 signal?: AbortSignal
) => {
      
      
      return customAxios<boolean>(
      {url: `http://localhost:8080/api/Reviews/can-review`, method: 'GET',
        params, signal
    },
      );
    }
  

export const getGetApiReviewsCanReviewQueryKey = (params?: GetApiReviewsCanReviewParams,) => {
    return [`http://localhost:8080/api/Reviews/can-review`, ...(params ? [params]: [])] as const;
    }

    
export const getGetApiReviewsCanReviewQueryOptions = <TData = Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError = unknown>(params?: GetApiReviewsCanReviewParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError, TData>>, }
) => {

const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetApiReviewsCanReviewQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getApiReviewsCanReview>>> = ({ signal }) => getApiReviewsCanReview(params, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetApiReviewsCanReviewQueryResult = NonNullable<Awaited<ReturnType<typeof getApiReviewsCanReview>>>
export type GetApiReviewsCanReviewQueryError = unknown


export function useGetApiReviewsCanReview<TData = Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError = unknown>(
 params: undefined |  GetApiReviewsCanReviewParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsCanReview>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsCanReview>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsCanReview<TData = Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError = unknown>(
 params?: GetApiReviewsCanReviewParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getApiReviewsCanReview>>,
          TError,
          Awaited<ReturnType<typeof getApiReviewsCanReview>>
        > , 'initialData'
      >, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetApiReviewsCanReview<TData = Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError = unknown>(
 params?: GetApiReviewsCanReviewParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError, TData>>, }
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetApiReviewsCanReview<TData = Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError = unknown>(
 params?: GetApiReviewsCanReviewParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getApiReviewsCanReview>>, TError, TData>>, }
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetApiReviewsCanReviewQueryOptions(params,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



