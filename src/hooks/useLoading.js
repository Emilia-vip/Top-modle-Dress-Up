import { useState } from 'react';
export function useLoading(initialValue = false) {
    const [loading, setLoading] = useState(initialValue);
    return { loading, setLoading };
}
