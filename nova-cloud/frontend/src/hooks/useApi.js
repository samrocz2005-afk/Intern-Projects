import {
  useCallback,
  useState,
} from "react";

const useApi = (apiFunction) => {
  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const execute = useCallback(
    async (...args) => {
      if (!apiFunction) {
        const error = new Error(
          "API function is not provided"
        );

        setError(error.message);
        throw error;
      }

      setLoading(true);
      setError(null);

      try {
        const response =
          await apiFunction(...args);

        setData(response);

        return response;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;