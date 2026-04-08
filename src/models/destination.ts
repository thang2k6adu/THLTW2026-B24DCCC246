import { useState, useCallback } from 'react';
import { queryDestinationList, addDestination, updateDestination, removeDestination } from '@/services/destination';

export default () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDestinations = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await queryDestinationList(params);
      setDestinations(res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: any) => {
    setLoading(true);
    try {
      await addDestination(data);
      await fetchDestinations();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDestinations]);

  const update = useCallback(async (data: any) => {
    setLoading(true);
    try {
      await updateDestination(data);
      await fetchDestinations();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDestinations]);

  const remove = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await removeDestination(id);
      await fetchDestinations();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDestinations]);

  return {
    destinations,
    loading,
    fetchDestinations,
    create,
    update,
    remove,
  };
};
