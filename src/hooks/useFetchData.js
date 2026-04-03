import { useState, useEffect, useCallback } from "react";

/**
 * API 호출 + loading 상태 관리 훅
 * @param {Function} fetchFn - () => Promise<{ success, data }> 형태의 API 함수
 * @param {Object} options
 * @param {*} options.deps - useEffect 의존성 배열 (기본: [])
 * @param {boolean} options.skip - true면 호출 건너뜀
 */
const useFetchData = (fetchFn, { deps = [], skip = false } = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!skip);

    const refetch = useCallback(async () => {
        setLoading(true);
        const result = await fetchFn();
        if (result.success) setData(result.data);
        setLoading(false);
        return result;
    }, [fetchFn]);

    useEffect(() => {
        if (skip) return;
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { data, loading, refetch };
};

export default useFetchData;
