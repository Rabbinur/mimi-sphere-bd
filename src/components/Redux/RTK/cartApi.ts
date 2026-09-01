import { baseApi } from '../baseApi';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: '/cart',
        method: 'GET',
      }),
      providesTags: ['Cart'],
    }),
    addToCartServer: builder.mutation({
      query: (data) => ({
        url: '/cart/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItemServer: builder.mutation({
      query: (data) => ({
        url: '/cart/update',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItemServer: builder.mutation({
      query: (data) => ({
        url: '/cart/remove',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCartServer: builder.mutation({
      query: () => ({
        url: '/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    syncCartServer: builder.mutation({
      query: (data) => ({
        url: '/cart/sync',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartServerMutation,
  useUpdateCartItemServerMutation,
  useRemoveCartItemServerMutation,
  useClearCartServerMutation,
  useSyncCartServerMutation,
} = cartApi;
