
import React, { useState, useEffect } from 'react'


function usePromise(prom, deps) {
  const [error, setError] = useState();
  const [data, setData] = useState();

  useEffect(_=>{
    jet.get("promise", jet.is("function", prom) ? prom() : prom).then(setData, setError);
  }, deps);

  return [data, error];
}


export default usePromise;
