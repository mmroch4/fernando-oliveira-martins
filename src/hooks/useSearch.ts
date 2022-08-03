import { useEffect, useState } from "react";

export function useSearch<V>(values: V[], callbackFn: (value: V) => any) {
  const [search, setSearch] = useState<string>("");

  const [searchedValues, setSearchedValues] = useState<V[]>([...values]);

  useEffect(() => {
    handleSearch();
  }, [search]);

  function handleSearch() {
    if (!search) return setSearchedValues([...values]);

    const filteredValues = values.filter(callbackFn);

    setSearchedValues(filteredValues);
  }

  return { values: searchedValues, search, setSearch };
}
