import {
  buildFilterConditions,
  hasActiveFilters,
  FilterParams,
} from "@/utils/filterUtils";

describe("Filter Utils", () => {
  describe("hasActiveFilters", () => {
    it("should return false for empty filters", () => {
      const filters: FilterParams = {};
      expect(hasActiveFilters(filters)).toBe(false);
    });

    it("should return false for filters with empty values", () => {
      const filters: FilterParams = {
        category: "",
        priceMin: "",
        priceMax: "",
        weightMin: "",
        weightMax: "",
        dropMin: "",
        dropMax: "",
        reviewed: "",
        search: "",
      };
      expect(hasActiveFilters(filters)).toBe(false);
    });

    it("should return true when category filter is active", () => {
      const filters: FilterParams = {
        category: "Daily trainer",
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it("should return true when price filters are active", () => {
      const filters: FilterParams = {
        priceMin: "100",
        priceMax: "200",
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it("should return true when weight filters are active", () => {
      const filters: FilterParams = {
        weightMin: "200",
        weightMax: "300",
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it("should return true when drop filters are active", () => {
      const filters: FilterParams = {
        dropMin: "8",
        dropMax: "12",
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it("should return true when reviewed filter is active", () => {
      const filters: FilterParams = {
        reviewed: "yes",
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });

    it("should return true when search filter is active", () => {
      const filters: FilterParams = {
        search: "Nike",
      };
      expect(hasActiveFilters(filters)).toBe(true);
    });
  });

  describe("buildFilterConditions", () => {
    const baseConditions = ['_type == "runningShoe"', "defined(slug.current)"];

    it("should return base conditions when no filters are applied", () => {
      const filters: FilterParams = {};
      const result = buildFilterConditions(baseConditions, filters);
      expect(result).toEqual(baseConditions);
    });

    it("should add category filter condition", () => {
      const filters: FilterParams = {
        category: "Daily trainer",
      };
      const result = buildFilterConditions(baseConditions, filters);
      expect(result).toContain('category[]->name match "*Daily trainer*"');
    });

    it("should add price range filter conditions", () => {
      const filters: FilterParams = {
        priceMin: "100",
        priceMax: "200",
      };
      const result = buildFilterConditions(baseConditions, filters);

      const priceConditions = result.filter((condition) =>
        condition.includes("releaseInfo.pl.price")
      );
      expect(priceConditions).toHaveLength(1);
      expect(priceConditions[0]).toContain(">= 100");
      expect(priceConditions[0]).toContain("<= 200");
    });

    it("should add weight range filter conditions", () => {
      const filters: FilterParams = {
        weightMin: "200",
        weightMax: "300",
      };
      const result = buildFilterConditions(baseConditions, filters);

      const weightConditions = result.filter((condition) =>
        condition.includes("specs.m.weight")
      );
      expect(weightConditions).toHaveLength(1);
      expect(weightConditions[0]).toContain(">= 200");
      expect(weightConditions[0]).toContain("<= 300");
    });

    it("should add drop range filter conditions", () => {
      const filters: FilterParams = {
        dropMin: "8",
        dropMax: "12",
      };
      const result = buildFilterConditions(baseConditions, filters);

      const dropConditions = result.filter((condition) =>
        condition.includes("specs.m.drop")
      );
      expect(dropConditions).toHaveLength(1);
      expect(dropConditions[0]).toContain(">= 8");
      expect(dropConditions[0]).toContain("<= 12");
    });

    it("should add reviewed filter condition for yes", () => {
      const filters: FilterParams = {
        reviewed: "yes",
      };
      const result = buildFilterConditions(baseConditions, filters);
      expect(result).toContain("defined(review)");
    });

    it("should add reviewed filter condition for no", () => {
      const filters: FilterParams = {
        reviewed: "no",
      };
      const result = buildFilterConditions(baseConditions, filters);
      expect(result).toContain("!defined(review)");
    });

    it("should add search filter condition", () => {
      const filters: FilterParams = {
        search: "Nike Air",
      };
      const result = buildFilterConditions(baseConditions, filters);
      const searchCondition = result.find((condition) =>
        condition.includes("name match")
      );
      expect(searchCondition).toContain("*Nike Air*");
    });

    it("should combine multiple filter conditions", () => {
      const filters: FilterParams = {
        category: "Daily trainer",
        priceMin: "100",
        priceMax: "200",
        reviewed: "yes",
        search: "Nike",
      };
      const result = buildFilterConditions(baseConditions, filters);

      expect(result).toContain('category[]->name match "*Daily trainer*"');
      expect(
        result.some((c) => c.includes("releaseInfo.pl.price >= 100"))
      ).toBe(true);
      expect(
        result.some((c) => c.includes("releaseInfo.pl.price <= 200"))
      ).toBe(true);
      expect(result).toContain("defined(review)");
      expect(result.some((c) => c.includes('name match "*Nike*"'))).toBe(true);
    });

    it("should handle single price filter", () => {
      const filters: FilterParams = {
        priceMin: "100",
      };
      const result = buildFilterConditions(baseConditions, filters);
      expect(
        result.some((c) => c.includes("releaseInfo.pl.price >= 100"))
      ).toBe(true);
      expect(result.some((c) => c.includes("releaseInfo.pl.price <="))).toBe(
        false
      );
    });

    it("should handle single weight filter", () => {
      const filters: FilterParams = {
        weightMax: "300",
      };
      const result = buildFilterConditions(baseConditions, filters);
      expect(result.some((c) => c.includes("specs.m.weight <= 300"))).toBe(
        true
      );
      expect(result.some((c) => c.includes("specs.m.weight >="))).toBe(false);
    });

    it("should handle single drop filter", () => {
      const filters: FilterParams = {
        dropMin: "8",
      };
      const result = buildFilterConditions(baseConditions, filters);
      expect(result.some((c) => c.includes("specs.m.drop >= 8"))).toBe(true);
      expect(result.some((c) => c.includes("specs.m.drop <="))).toBe(false);
    });
  });
});
