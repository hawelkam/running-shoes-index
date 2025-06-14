export interface FilterParams {
  category?: string;
  priceMin?: string;
  priceMax?: string;
  weightMin?: string;
  weightMax?: string;
  dropMin?: string;
  dropMax?: string;
  reviewed?: string;
  search?: string;
}

export function buildFilterConditions(
  baseConditions: string[] = [],
  filters: FilterParams = {}
): string[] {
  const filterConditions = [...baseConditions];

  // Category filter
  if (filters.category) {
    filterConditions.push(`category[]->name match "*${filters.category}*"`);
  }

  // Price filter (PLN)
  if (filters.priceMin || filters.priceMax) {
    let priceCondition = "";
    if (filters.priceMin && filters.priceMax) {
      priceCondition = `(releaseInfo.pl.price >= ${filters.priceMin} && releaseInfo.pl.price <= ${filters.priceMax})`;
    } else if (filters.priceMin) {
      priceCondition = `releaseInfo.pl.price >= ${filters.priceMin}`;
    } else if (filters.priceMax) {
      priceCondition = `releaseInfo.pl.price <= ${filters.priceMax}`;
    }
    if (priceCondition) {
      filterConditions.push(priceCondition);
    }
  }

  // Weight filter (g) - men's weight
  if (filters.weightMin || filters.weightMax) {
    let weightCondition = "";
    if (filters.weightMin && filters.weightMax) {
      weightCondition = `(specs.m.weight >= ${filters.weightMin} && specs.m.weight <= ${filters.weightMax})`;
    } else if (filters.weightMin) {
      weightCondition = `specs.m.weight >= ${filters.weightMin}`;
    } else if (filters.weightMax) {
      weightCondition = `specs.m.weight <= ${filters.weightMax}`;
    }
    if (weightCondition) {
      filterConditions.push(weightCondition);
    }
  }

  // Drop filter (mm)
  if (filters.dropMin || filters.dropMax) {
    let dropCondition = "";
    if (filters.dropMin && filters.dropMax) {
      dropCondition = `(specs.m.drop >= ${filters.dropMin} && specs.m.drop <= ${filters.dropMax})`;
    } else if (filters.dropMin) {
      dropCondition = `specs.m.drop >= ${filters.dropMin}`;
    } else if (filters.dropMax) {
      dropCondition = `specs.m.drop <= ${filters.dropMax}`;
    }
    if (dropCondition) {
      filterConditions.push(dropCondition);
    }
  }

  // Reviewed filter
  if (filters.reviewed) {
    if (filters.reviewed === "yes") {
      filterConditions.push("defined(review)");
    } else if (filters.reviewed === "no") {
      filterConditions.push("!defined(review)");
    }
  }

  // Search filter
  if (filters.search) {
    filterConditions.push(`name match "*${filters.search}*"`);
  }

  return filterConditions;
}

export function hasActiveFilters(filters: FilterParams): boolean {
  return Object.values(filters).some((value) => value && value.trim() !== "");
}
