/**
 * @jest-environment jsdom
 */

describe("Testing Framework Setup", () => {
  it("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have access to DOM APIs", () => {
    const div = document.createElement("div");
    div.textContent = "Hello World";
    expect(div.textContent).toBe("Hello World");
  });

  it("should mock localStorage", () => {
    localStorage.setItem("test", "value");
    expect(localStorage.getItem("test")).toBe("value");
  });
});
