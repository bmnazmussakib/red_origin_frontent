import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { cookie, getToken, tAlert } from "../../helpers/helper";

// create a slice
export const GlobalSetting = createSlice({
  name: "globalsetting",
  initialState: {
    globalsetting: [],
    modalId: "",
    categories: [],
    paymentTypes: [],
    megaMenus: [],
    pages: [],
    offerBanners: null,
    newArrivalCategories: null,
    newArrivalProducts: null,
    topSellingProducts: null,
    hotDealProducts: null,
    HomeBanner1: null,
    HomeBanner2: null,
    trendingCategories: null,
    flashDeals: null,
    featuredProducts: null,
    blogs: null,
  },
  reducers: {
    addToGlobalSetting(state, { payload }) {
      let { business_settings } = payload;
      state.globalsetting = business_settings;
    },
    addToPage(state, { payload }) {
      let { pages } = payload;
      state.pages = pages;
    },
    addToMegaMenu(state, { payload }) {
      let { megaMenu } = payload;
      state.megaMenus = megaMenu;
    },
    getSetting(state, { payload }) {
      let { business_settings } = payload;
      state.globalsetting = [...business_settings];
      cookie("globalsetting", JSON.stringify(business_settings), "set");
    },
    getSettingInfo(state, { payload }) {
      return state.globalsetting;
    },
    setModalId(state, { payload }) {
      let { id } = payload;
      state.modalId = id;
    },
    setCategory: (state, { payload }) => {
      let { all_categories } = payload;
      state.categories = all_categories;
    },
    setPaymentTypes: (state, { payload }) => {
      let { payment_types } = payload;
      state.paymentTypes = payment_types;
    },
    setOfferBanners: (state, { payload }) => {
      let { offer_banners } = payload;
      state.offerBanners = offer_banners;
    },

    setHomeBanner: (state, { payload }) => {
      let {
        HomeBanner1,
        HomeBanner2,
      } = payload;

      console.log("homeBanner1", HomeBanner1);
      console.log("homeBanner2", HomeBanner2);

      state.HomeBanner1 = HomeBanner1;
      state.HomeBanner2 = HomeBanner2;
    },

    setCategoryAndProducts: (state, { payload }) => {
      let {
        trendingCategory,
        newArrivalCategories,
        newArrivalProducts,
        topSellingProducts,
        flashDeals,
        featuredProducts,
        blogs,
        hotDealProducts
      } = payload;
      console.log("trendingCategory", trendingCategory);
      console.log("newArrivalCategories", newArrivalCategories);
      console.log("flashDeals", flashDeals);
      console.log("featuredProducts", hotDealProducts);
      console.log("blogs", blogs);
      console.log("newArrivalProducts", newArrivalProducts);
      console.log("topSellingProducts", topSellingProducts);
      state.trendingCategories = trendingCategory;
      state.newArrivalCategories = newArrivalCategories;
      state.newArrivalProducts = newArrivalProducts;
      state.topSellingProducts = topSellingProducts;
      state.flashDeals = flashDeals;
      state.hotDealProducts = hotDealProducts;
      state.featuredProducts = featuredProducts;
      state.blogs = blogs;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, { payload }) => {
      return {
        ...state,
        // globalsetting: cookie("globalsetting") ? JSON.parse(cookie("globalsetting")) : [],
      };
    },
  },
});
export const {
  addToPage,
  addToGlobalSetting,
  getSetting,
  setModalId,
  setCategory,
  getSettingInfo,
  setPaymentTypes,
  addToMegaMenu,
  setOfferBanners,
  setHomeBanner,
  setCategoryAndProducts
} = GlobalSetting.actions;

export default GlobalSetting.reducer;
