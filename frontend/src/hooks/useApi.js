import { useState, useCallback } from 'react';

export function useApi() {
  const [state, setState] = useState({
    data: null,
    error: null,
    isLoading: false,
  });

  const fetchData = useCallback(async (url, options = {}) => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setState({ data, error: null, isLoading: false });
      return data;
    } catch (error) {
      setState({ data: null, error: error.message, isLoading: false });
      throw error;
    }
  }, []);

  return { ...state, fetchData };
}

