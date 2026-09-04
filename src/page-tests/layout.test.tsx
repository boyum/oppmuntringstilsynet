import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "../app/layout";

jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => null,
}));

describe(RootLayout.name, () => {
  it("should render the children within a Norwegian document", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <p>children</p>
      </RootLayout>,
    );

    expect(html).toContain('<html lang="nb">');
    expect(html).toContain("<p>children</p>");
  });
});
