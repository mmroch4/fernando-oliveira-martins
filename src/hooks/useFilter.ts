import { useEffect, useState } from "react";
import { Post } from "../graphql/schema";

export function useFilter<V extends Post>(values: V[], fixed: string[]) {
  const [filters, setFilters] = useState<string[]>([...fixed]);

  const [searchedValues, setSearchedValues] = useState<V[]>([...values]);

  useEffect(handleFilter, [filters, values]);

  function handleClick(filter: string): void {
    const arr = [...filters];

    const has = filters.includes(filter.toLowerCase());

    if (has) {
      arr.splice(filters.indexOf(filter.toLowerCase()), 1);

      setFilters([...arr]);
    } else if (!has) {
      arr.push(filter.toLowerCase());

      setFilters([...arr]);
    }
  }

  function handleFilter() {
    if (filters.length <= 0) return setSearchedValues([...values]);

    const filteredValues = values.filter((value) => hasCategories(value));

    setSearchedValues(filteredValues);
  }

  function hasCategories(value: V) {
    const remainingFilters = [...filters];

    for (const category of value.categories) {
      for (const filter of remainingFilters) {
        if (category.name.toLowerCase() === filter.toLowerCase()) {
          remainingFilters.splice(
            remainingFilters.indexOf(filter.toLowerCase()),
            1
          );
        }
      }
    }

    return remainingFilters.length <= 0;
  }

  function handleClearFilters() {
    setFilters([...fixed]);
  }

  function isFilter(filter: string): boolean {
    return filters.includes(filter.toLowerCase());
  }

  return {
    values: searchedValues,
    filters,
    handleClick,
    handleFilter,
    handleClearFilters,
    isFilter,
  };
}
