import { baseApi } from "../baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review" as any, "Product" as any],
    }),
    getReviewsByProduct: builder.query({
      query: (identifier) => ({
        url: `/reviews/${identifier}`,
        method: "GET",
      }),
      providesTags: ["Review" as any],
    }),
  }),
});

export const { useCreateReviewMutation, useGetReviewsByProductQuery } = reviewApi;
