import { useState, useEffect } from "react";
import { getPromoDetail } from "../api/adminApi";

export const usePromoDetail = (promoId) => {
  const [promoDetail, setPromoDetail] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!promoId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getPromoDetail(promoId);
        setPromoDetail(data);
        setPurchases(data.purchases || []); 
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [promoId]);

  // Mengembalikan data komponen UI
  return { promoDetail, purchases, loading, error };
};