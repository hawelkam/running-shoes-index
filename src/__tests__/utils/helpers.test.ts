import {
  preparePriceInfo,
  prepareReleaseDate,
  preparePriceInPLN,
  preparePriceInEUR,
  preparePriceInUSD,
  prepareHeightInMM,
  prepareWeightInGrams,
  prepareWeightInOunces,
  prepareWeight,
  prepareListDividedByComma,
  prepareMissingDataList,
  isCurrentYearRelease,
  preparePurposeSlug,
} from "@/utils/helpers";
import { ReleaseInfo, SanityRunningShoe } from "@/types/RunningShoe";

describe("Helper Functions", () => {
  describe("preparePriceInfo", () => {
    it("should return formatted price info for all regions", () => {
      const releaseInfo: ReleaseInfo = {
        pl: { date: "2025-01-01", price: 599 },
        eu: { date: "2025-01-01", price: 149 },
        us: { date: "2025-01-01", price: 159 },
      };

      const result = preparePriceInfo(releaseInfo);
      expect(result).toContain("599zł");
      expect(result).toContain("€149");
      expect(result).toContain("$159");
    });

    it("should handle partial price data", () => {
      const releaseInfo: ReleaseInfo = {
        pl: { date: "2025-01-01", price: 599 },
      };

      const result = preparePriceInfo(releaseInfo);
      expect(result).toContain("599zł");
      expect(result).not.toContain("€");
      expect(result).not.toContain("$");
    });

    it("should return empty string for no price data", () => {
      const releaseInfo: ReleaseInfo = {};
      const result = preparePriceInfo(releaseInfo);
      expect(result).toBe("");
    });
  });

  describe("prepareReleaseDate", () => {
    it("should format release date correctly", () => {
      const result = prepareReleaseDate("2025-01-15");
      expect(result).toBe("Jan 2025");
    });

    it("should handle invalid date", () => {
      const result = prepareReleaseDate("invalid-date");
      expect(result).toBe("-");
    });

    it("should handle undefined date", () => {
      const result = prepareReleaseDate(undefined);
      expect(result).toBe("-");
    });
  });

  describe("price formatting functions", () => {
    const releaseInfo: ReleaseInfo = {
      pl: { date: "2025-01-01", price: 599 },
      eu: { date: "2025-01-01", price: 149 },
      us: { date: "2025-01-01", price: 159 },
    };

    it("should format PLN price", () => {
      const result = preparePriceInPLN(releaseInfo);
      expect(result).toBe("599zł");
    });

    it("should format EUR price", () => {
      const result = preparePriceInEUR(releaseInfo);
      expect(result).toBe("€149");
    });

    it("should format USD price", () => {
      const result = preparePriceInUSD(releaseInfo);
      expect(result).toBe("$159");
    });

    it("should return N/A for missing prices", () => {
      const emptyReleaseInfo: ReleaseInfo = {};
      expect(preparePriceInPLN(emptyReleaseInfo)).toBe("-");
      expect(preparePriceInEUR(emptyReleaseInfo)).toBe("-");
      expect(preparePriceInUSD(emptyReleaseInfo)).toBe("-");
    });
  });

  describe("measurement formatting functions", () => {
    it("should format height in mm", () => {
      expect(prepareHeightInMM(32)).toBe("32mm");
      expect(prepareHeightInMM(undefined)).toBe("-");
    });

    it("should format weight in grams", () => {
      expect(prepareWeightInGrams(285)).toBe("285g");
      expect(prepareWeightInGrams(undefined)).toBe("-");
    });

    it("should format weight in ounces", () => {
      expect(prepareWeightInOunces(285)).toBe("10.1 oz");
      expect(prepareWeightInOunces(undefined)).toBe("-");
    });

    it("should format weight with both units", () => {
      expect(prepareWeight(285)).toBe("285g (10.1 oz)");
      expect(prepareWeight(undefined)).toBe("-");
    });
  });

  describe("prepareListDividedByComma", () => {
    it("should return the string value", () => {
      const result = prepareListDividedByComma(
        "EVA foam, TPU plate, Carbon fiber"
      );
      expect(result).toBe("EVA foam, TPU plate, Carbon fiber");
    });

    it("should handle empty string", () => {
      const result = prepareListDividedByComma("");
      expect(result).toBe("-");
    });

    it("should handle undefined", () => {
      const result = prepareListDividedByComma(undefined);
      expect(result).toBe("-");
    });
  });

  describe("isCurrentYearRelease", () => {
    it("should identify current year releases", () => {
      const currentYear = new Date().getFullYear();
      const currentYearDate = `${currentYear}-06-15`;
      expect(isCurrentYearRelease(currentYearDate)).toBe(true);
    });

    it("should identify past year releases", () => {
      expect(isCurrentYearRelease("2023-06-15")).toBe(false);
    });

    it("should handle undefined date", () => {
      expect(isCurrentYearRelease(undefined)).toBe(false);
    });
  });

  describe("preparePurposeSlug", () => {
    it("should convert purpose to slug format", () => {
      expect(preparePurposeSlug("Daily trainer")).toBe("daily-trainer");
      expect(preparePurposeSlug("Trail Running")).toBe("trail-running");
      expect(preparePurposeSlug("ROAD RACING")).toBe("road-racing");
    });
  });

  describe("prepareMissingDataList", () => {
    it("should identify missing data fields", () => {
      const incompleteShoe: SanityRunningShoe = {
        _id: "test-id",
        _rev: "test-rev",
        _type: "runningShoe",
        _createdAt: "2025-01-01",
        _updatedAt: "2025-01-01",
        name: "Test Shoe",
        brand: { name: "Test Brand", slug: { current: "test-brand" } },
        purpose: "Daily trainer",
        stability: "Neutral",
        wideAvailable: false,
        waterproofAvailable: false,
        slug: { current: "test-shoe" },
        notes: "Test notes",
        // Missing releaseInfo, categories, image, specs
      } as SanityRunningShoe;

      const result = prepareMissingDataList(incompleteShoe);
      expect(result).toContain("Release info");
      expect(result).toContain("Category");
      expect(result).toContain("Image");
      expect(result).toContain("Specs");
    });

    it('should return "No missing data" for complete shoe', () => {
      const completeShoe: SanityRunningShoe = {
        _id: "complete-id",
        _rev: "complete-rev",
        _type: "runningShoe",
        _createdAt: "2025-01-01",
        _updatedAt: "2025-01-01",
        name: "Complete Shoe",
        brand: { name: "Test Brand", slug: { current: "test-brand" } },
        purpose: "Daily trainer",
        stability: "Neutral",
        wideAvailable: false,
        waterproofAvailable: false,
        releaseInfo: {
          pl: { date: "2025-01-01", price: 599 },
          eu: { date: "2025-01-01", price: 149 },
          us: { date: "2025-01-01", price: 159 },
        },
        categories: ["Daily trainer"],
        image: { url: "test-image.jpg" },
        specs: {
          m: { weight: 285, drop: 10, heelStack: 32 },
          w: { weight: 240, drop: 10, heelStack: 30 },
          upper: [{ name: "Mesh" }],
          foam: [{ name: "EVA" }],
          plate: "None",
          outsole: [{ name: "Rubber" }],
        },
        slug: { current: "complete-shoe" },
        notes: "Complete notes",
      } as SanityRunningShoe;

      const result = prepareMissingDataList(completeShoe);
      expect(result).toBe("No missing data");
    });
  });
});
