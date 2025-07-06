import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };

// Basic test to satisfy Jest requirement
describe("Test Utils", () => {
  it("should export render function", () => {
    expect(customRender).toBeDefined();
  });
});
