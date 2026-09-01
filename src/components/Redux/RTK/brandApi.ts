import { baseApi } from "../baseApi";

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allBrands: builder.query({
      query: (
        params: { page?: number; limit?: number; searchTerm?: string } = {},
      ) => ({
        url: `/brands`,
        method: "GET",
        params,
      }),
      providesTags: ["brands"],
    }),
  }),
});

export const { useAllBrandsQuery } = brandApi;
