import { baseApi } from "../baseApi";

const checkoutLeadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upsertCheckoutLead: builder.mutation({
      query: (data) => ({
        url: "/checkout-leads",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CheckoutLead" as any],
    }),
  }),
});

export const {
  useUpsertCheckoutLeadMutation,
} = checkoutLeadApi;
export default checkoutLeadApi;
