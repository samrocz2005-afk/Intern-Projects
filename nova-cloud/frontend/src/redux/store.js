import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import instanceReducer from "./slices/instanceSlice";
import networkReducer from "./slices/networkSlice";
import storageReducer from "./slices/storageSlice";
import routerReducer from "./slices/routerSlice";
import loadBalancerReducer from "./slices/loadBalancerSlice";
import billingReducer from "./slices/billingSlice";
import breadcrumbReducer from "./slices/breadcrumbSlice";
import flavorReducer from "./slices/flavorSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    instances: instanceReducer,
    networks: networkReducer,
    storage: storageReducer,
    routers: routerReducer,
    loadBalancers: loadBalancerReducer,
    flavors: flavorReducer,
    billing: billingReducer,
    breadcrumbs: breadcrumbReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true,
    }),

  devTools:
    process.env.NODE_ENV !== "production",
});

export default store;