import { useState } from 'react';

export function useLoading(initialValue: boolean = false) {
  const [loading, setLoading] = useState(initialValue);
  return { loading, setLoading };
}