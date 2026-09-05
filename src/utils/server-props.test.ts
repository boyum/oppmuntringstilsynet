import { getAcceptedLanguages, toURLSearchParams } from "./server-props";

describe(toURLSearchParams.name, () => {
  it("should return an empty URLSearchParams for an empty object", () => {
    const urlSearchParams = toURLSearchParams({});

    expect(urlSearchParams.toString()).toBe("");
  });

  it("should set string values", () => {
    const urlSearchParams = toURLSearchParams({ a: "1", b: "2" });

    expect(urlSearchParams.get("a")).toBe("1");
    expect(urlSearchParams.get("b")).toBe("2");
  });

  it("should append each entry for array values", () => {
    const urlSearchParams = toURLSearchParams({ a: ["1", "2"], b: "3" });

    expect(urlSearchParams.getAll("a")).toEqual(["1", "2"]);
    expect(urlSearchParams.get("b")).toBe("3");
  });

  it("should skip undefined values", () => {
    const urlSearchParams = toURLSearchParams({ a: undefined, b: "2" });

    expect(urlSearchParams.toString()).toBe("b=2");
  });
});

describe(getAcceptedLanguages.name, () => {
  it("should return the codes of the accepted languages", () => {
    const codes = getAcceptedLanguages("no,en-GB;q=0.9");

    expect(codes).toEqual(["no", "en"]);
  });

  it("should return an empty list for an empty string", () => {
    const codes = getAcceptedLanguages("");

    expect(codes).toEqual([]);
  });
});
