import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SanityRunningShoe } from "@/types/RunningShoe";

// Mock a simple component to test
const MockShoeCard = ({ shoe }: { shoe: Partial<SanityRunningShoe> }) => {
  return (
    <div data-testid="shoe-card">
      <h3 data-testid="shoe-name">{shoe.name}</h3>
      <p data-testid="shoe-purpose">{shoe.purpose}</p>
      {shoe.specs?.m?.weight && (
        <span data-testid="shoe-weight">{shoe.specs.m.weight}g</span>
      )}
      {shoe.releaseInfo?.eu?.price && (
        <span data-testid="shoe-price">€{shoe.releaseInfo.eu.price}</span>
      )}
    </div>
  );
};

describe("MockShoeCard Component", () => {
  const mockShoe: Partial<SanityRunningShoe> = {
    name: "Nike Air Zoom Pegasus 40",
    purpose: "Daily trainer",
    specs: {
      m: { weight: 285, drop: 10, heelStack: 32 },
      plate: "None",
    },
    releaseInfo: {
      eu: { date: "2025-01-01", price: 139 },
    },
  };

  it("renders shoe information correctly", () => {
    render(<MockShoeCard shoe={mockShoe} />);

    expect(screen.getByTestId("shoe-name")).toHaveTextContent(
      "Nike Air Zoom Pegasus 40"
    );
    expect(screen.getByTestId("shoe-purpose")).toHaveTextContent(
      "Daily trainer"
    );
    expect(screen.getByTestId("shoe-weight")).toHaveTextContent("285g");
    expect(screen.getByTestId("shoe-price")).toHaveTextContent("€139");
  });

  it("handles missing optional data gracefully", () => {
    const incompleteShoe: Partial<SanityRunningShoe> = {
      name: "Test Shoe",
      purpose: "Road racing",
    };

    render(<MockShoeCard shoe={incompleteShoe} />);

    expect(screen.getByTestId("shoe-name")).toHaveTextContent("Test Shoe");
    expect(screen.getByTestId("shoe-purpose")).toHaveTextContent("Road racing");
    expect(screen.queryByTestId("shoe-weight")).not.toBeInTheDocument();
    expect(screen.queryByTestId("shoe-price")).not.toBeInTheDocument();
  });

  it("renders with minimal data", () => {
    const minimalShoe: Partial<SanityRunningShoe> = {
      name: "Minimal Shoe",
    };

    render(<MockShoeCard shoe={minimalShoe} />);

    expect(screen.getByTestId("shoe-card")).toBeInTheDocument();
    expect(screen.getByTestId("shoe-name")).toHaveTextContent("Minimal Shoe");
  });
});
