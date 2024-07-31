export let home = {
  AD_BANNER: "/v2/all-banner-ad",
  Home_Banner_1: "/v2/home-banner-one",
  Home_Banner_2: "/v2/home-banner-two",
  TrendingCategories: "/v2/categories/trending",
  NewArrivalCategories: "/v2/new-arrival/categories",
  NEW_ARRIVAL_PRODUCT: "/v3/products?new_arrival=1",
  TOP_SELLING: "/v3/products?top_selling=1",
  HotDealProduct: "/v3/products?hot_deal=1&limit=10",
  FlashDeals: "/v2/flash-deals",
  FeaturedProduct: "/v2/products?featured=1",
  BLOG: "/v2/blog",
  PAGE_LIST: "/v2/pages",
}

export let STORE_LOCATOR = '/v2/store-locator'

export let shop = {
  PRODUCT: "/v3/products",
  CATEGORIES: "/v2/categories",
  ATTRIBUTE: '/v2/attribute',
  FILTERCATEGORY: '/v2/categories-filter'
}

export let detail = {
  PRODUCT: "/v2/products",
  PRODUCT_BY_SLUG: "/v2/productsBySlug",
  RELATED_PRODUCT: "/v2/products/related",
  REVIEW: "/v2/reviews/product/",
  RECENTLY_VIEWED: "/v2/products/recently-viewed",
}

export const cart = {
  CARTS: '/v2/carts',
  ADD_TO_CART: '/v2/carts/add',
  ADD_TO_CART_MULTIPLE: '/v3/carts/add/multiple',
  CART_SUMMARY: '/v2/cart-summary',
  CART_PROMOTION_ADD: '/v3/carts/promotion-get-selection/',
}

export const profile = {
  PROFILE_UPDATE: "/v2/profile/update"
}

export const checkoutPage = {
  APPLY_COUPON: "/v2/coupon-apply",
  ORDER_CREATE: "/v2/order/store",
  REMOVE_COUPON: "/v2/coupon-remove",
  PICKUP_POINT: "/v2/pickup-list",
  PAYMENT_TYPES: '/v2/payment-types',
  DELIVERY_CHARGE: "/v2/inside-outside-dhaka-price",
  COUNTRIES: "/v2/countries",
  STATES: "/v2/states-by-country",
  CITIES: "/v2/cities",
  DELIVERY_EXPRESS_CHARGE: "/v2/inside-outside-dhaka-price",
  ShippingChargeExpressAndRegular: "/v2/shippingChargeExpressAndRegular",
}

export const subscribe_route = {
  SUBSCRIBE: "/v2/subscribe"

}

export const orders_routes = {
  PARCHES_HISTORY: "/v2/purchase-history",
  PARCHES_HISTORY_DETAILS: "/v2/purchase-history-details/",
  PARCHES_HISTORY_DETAILS_DETAILS: "/v2/purchase-history-items/",

}

export const common = {
  MEGAMENU: '/v2/megamenu',
  BSETTING: '/v2/business-settings'
}