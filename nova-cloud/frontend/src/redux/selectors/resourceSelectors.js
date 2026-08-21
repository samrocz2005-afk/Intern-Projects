/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

export const selectCurrentUser = (state) =>
  state.auth?.user || null;

export const selectUser = (state) =>
  state.auth?.user || null;

export const selectAccessToken = (state) =>
  state.auth?.token || null;

export const selectIsAuthenticated = (state) =>
  state.auth?.isAuthenticated || false;

export const selectAuthLoading = (state) =>
  state.auth?.loading || false;

export const selectAuthError = (state) =>
  state.auth?.error || null;


/*
|--------------------------------------------------------------------------
| User Role
|--------------------------------------------------------------------------
*/

export const selectUserRole = (state) =>
  state.auth?.user?.role || null;

export const selectIsAdmin = (state) =>
  state.auth?.user?.role === "admin";

export const selectIsUser = (state) =>
  state.auth?.user?.role === "user";


/*
|--------------------------------------------------------------------------
| Instances
|--------------------------------------------------------------------------
*/

export const selectInstances = (state) =>
  state.instances?.items || [];

export const selectSelectedInstance = (state) =>
  state.instances?.selectedInstance || null;

export const selectInstanceById = (state, id) => {
  const selectedInstance =
    state.instances?.selectedInstance;

  if (
    selectedInstance &&
    String(
      selectedInstance._id ||
        selectedInstance.id
    ) === String(id)
  ) {
    return selectedInstance;
  }

  return (
    state.instances?.items || []
  ).find(
    (instance) =>
      String(
        instance._id ||
          instance.id
      ) === String(id)
  ) || null;
};

export const selectInstancesLoading = (state) =>
  state.instances?.loading || false;

export const selectInstancesActionLoading = (state) =>
  state.instances?.actionLoading || false;

export const selectInstancesError = (state) =>
  state.instances?.error || null;


/*
|--------------------------------------------------------------------------
| Networks
|--------------------------------------------------------------------------
*/

export const selectNetworks = (state) =>
  state.networks?.items || [];

export const selectSelectedNetwork = (state) =>
  state.networks?.selectedNetwork || null;

export const selectNetworkById = (state, id) => {
  const selectedNetwork =
    state.networks?.selectedNetwork;

  if (
    selectedNetwork &&
    String(
      selectedNetwork._id ||
        selectedNetwork.id
    ) === String(id)
  ) {
    return selectedNetwork;
  }

  return (
    state.networks?.items || []
  ).find(
    (network) =>
      String(
        network._id ||
          network.id
      ) === String(id)
  ) || null;
};

export const selectNetworksLoading = (state) =>
  state.networks?.loading || false;

export const selectNetworksActionLoading = (state) =>
  state.networks?.actionLoading || false;

export const selectNetworksError = (state) =>
  state.networks?.error || null;


/*
|--------------------------------------------------------------------------
| Storage
|--------------------------------------------------------------------------
*/

export const selectStorage = (state) =>
  state.storage?.items || [];

export const selectSelectedStorage = (state) =>
  state.storage?.selectedStorage || null;

export const selectStorageById = (state, id) => {
  const selectedStorage =
    state.storage?.selectedStorage;

  if (
    selectedStorage &&
    String(
      selectedStorage._id ||
        selectedStorage.id
    ) === String(id)
  ) {
    return selectedStorage;
  }

  return (
    state.storage?.items || []
  ).find(
    (storage) =>
      String(
        storage._id ||
          storage.id
      ) === String(id)
  ) || null;
};

export const selectStorageLoading = (state) =>
  state.storage?.loading || false;

export const selectStorageActionLoading = (state) =>
  state.storage?.actionLoading || false;

export const selectStorageError = (state) =>
  state.storage?.error || null;


/*
|--------------------------------------------------------------------------
| Routers
|--------------------------------------------------------------------------
*/

export const selectRouters = (state) =>
  state.routers?.items || [];

export const selectSelectedRouter = (state) =>
  state.routers?.selectedRouter || null;

export const selectRouterById = (state, id) => {
  const selectedRouter =
    state.routers?.selectedRouter;

  if (
    selectedRouter &&
    String(
      selectedRouter._id ||
        selectedRouter.id
    ) === String(id)
  ) {
    return selectedRouter;
  }

  return (
    state.routers?.items || []
  ).find(
    (router) =>
      String(
        router._id ||
          router.id
      ) === String(id)
  ) || null;
};

export const selectRoutersLoading = (state) =>
  state.routers?.loading || false;

export const selectRoutersActionLoading = (state) =>
  state.routers?.actionLoading || false;

export const selectRoutersError = (state) =>
  state.routers?.error || null;


/*
|--------------------------------------------------------------------------
| Load Balancers
|--------------------------------------------------------------------------
*/

export const selectLoadBalancers = (state) =>
  state.loadBalancers?.items || [];

export const selectSelectedLoadBalancer = (state) =>
  state.loadBalancers?.selectedLoadBalancer ||
  null;

export const selectLoadBalancerById = (
  state,
  id
) => {
  const selectedLoadBalancer =
    state.loadBalancers
      ?.selectedLoadBalancer;

  if (
    selectedLoadBalancer &&
    String(
      selectedLoadBalancer._id ||
        selectedLoadBalancer.id
    ) === String(id)
  ) {
    return selectedLoadBalancer;
  }

  return (
    state.loadBalancers?.items || []
  ).find(
    (loadBalancer) =>
      String(
        loadBalancer._id ||
          loadBalancer.id
      ) === String(id)
  ) || null;
};

export const selectLoadBalancersLoading = (
  state
) =>
  state.loadBalancers?.loading ||
  false;

export const selectLoadBalancersActionLoading = (
  state
) =>
  state.loadBalancers?.actionLoading ||
  false;

export const selectLoadBalancersError = (
  state
) =>
  state.loadBalancers?.error ||
  null;


/*
|--------------------------------------------------------------------------
| Billing
|--------------------------------------------------------------------------
*/

/*
| User's billing invoices
|
| GET /api/billing
|
| Only invoices belonging to the
| currently authenticated user.
|--------------------------------------------------------------------------
*/

export const selectBilling = (state) =>
  state.billing?.items || [];


/*
| Billing History
|--------------------------------------------------------------------------
*/

export const selectBillingHistory = (
  state
) =>
  state.billing?.history || [];


/*
| Selected Billing Invoice
|--------------------------------------------------------------------------
*/

export const selectSelectedBilling = (
  state
) =>
  state.billing?.selectedBilling ||
  null;


/*
| Billing Overview
|--------------------------------------------------------------------------
*/

export const selectBillingOverview = (
  state
) =>
  state.billing?.overview || null;


/*
| Billing Summary
|--------------------------------------------------------------------------
*/

export const selectBillingSummary = (
  state
) =>
  state.billing?.summary || {
    total: 0,
    currentMonth: 0,
    previousMonth: 0,
    pending: 0,
    paid: 0,
  };


/*
|--------------------------------------------------------------------------
| Usage
|--------------------------------------------------------------------------
*/

export const selectUsage = (state) =>
  state.billing?.usage || [];


/*
|--------------------------------------------------------------------------
| Billing Loading
|--------------------------------------------------------------------------
*/

export const selectBillingLoading = (
  state
) =>
  state.billing?.loading || false;


/*
|--------------------------------------------------------------------------
| Billing Action Loading
|--------------------------------------------------------------------------
*/

export const selectBillingActionLoading = (
  state
) =>
  state.billing?.actionLoading || false;


/*
|--------------------------------------------------------------------------
| Billing Error
|--------------------------------------------------------------------------
*/

export const selectBillingError = (
  state
) =>
  state.billing?.error || null;


/*
|--------------------------------------------------------------------------
| Billing Helpers
|--------------------------------------------------------------------------
*/

/*
| Find billing invoice by ID
|--------------------------------------------------------------------------
*/

export const selectBillingById = (
  state,
  id
) => {
  const billing =
    state.billing?.items || [];

  return billing.find(
    (item) =>
      String(
        item._id ||
          item.id
      ) === String(id)
  ) || null;
};


/*
| Find invoice by invoice number
|--------------------------------------------------------------------------
*/

export const selectBillingByInvoiceNumber = (
  state,
  invoiceNumber
) => {
  const billing =
    state.billing?.items || [];

  return billing.find(
    (item) =>
      String(
        item.invoiceNumber
      ) ===
      String(invoiceNumber)
  ) || null;
};


/*
| Pending billing amount
|--------------------------------------------------------------------------
*/

export const selectPendingBillingAmount = (
  state
) =>
  Number(
    state.billing?.summary
      ?.pending || 0
  );


/*
| Paid billing amount
|--------------------------------------------------------------------------
*/

export const selectPaidBillingAmount = (
  state
) =>
  Number(
    state.billing?.summary
      ?.paid || 0
  );


/*
| Total billing amount
|--------------------------------------------------------------------------
*/

export const selectTotalBillingAmount = (
  state
) =>
  Number(
    state.billing?.summary
      ?.total || 0
  );


/*
|--------------------------------------------------------------------------
| Breadcrumbs
|--------------------------------------------------------------------------
*/

export const selectBreadcrumbs = (
  state
) =>
  state.breadcrumb?.items || [];