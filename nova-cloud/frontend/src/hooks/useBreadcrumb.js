import { useCallback } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  setBreadcrumbs,
  addBreadcrumb,
  popBreadcrumb,
  clearBreadcrumbs,
} from "../redux/slices/breadcrumbSlice";

import {
  selectBreadcrumbs,
} from "../redux/selectors/resourceSelectors";

const useBreadcrumb = () => {
  const dispatch = useDispatch();

  const breadcrumbs = useSelector(
    selectBreadcrumbs
  );

  const set = useCallback(
    (items) => {
      dispatch(setBreadcrumbs(items));
    },
    [dispatch]
  );

  const add = useCallback(
    (item) => {
      dispatch(addBreadcrumb(item));
    },
    [dispatch]
  );

  const pop = useCallback(
    () => {
      dispatch(popBreadcrumb());
    },
    [dispatch]
  );

  const clear = useCallback(
    () => {
      dispatch(clearBreadcrumbs());
    },
    [dispatch]
  );

  return {
    breadcrumbs,

    setBreadcrumbs: set,
    addBreadcrumb: add,
    popBreadcrumb: pop,
    clearBreadcrumbs: clear,
  };
};

export default useBreadcrumb;