import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import GlobalPage from "./GlobalPage";

describe("<GlobalPage />", () => {
  it("renders w/o issues", () => {
    const { container } = render(<GlobalPage />);
    expect(container).toBeInTheDocument();
  });

  it("renders texts", () => {
    render(<GlobalPage />);
    expect(screen.getByTestId("global-page-header")).toHaveTextContent(
      "Extension Global Page"
    );
    expect(screen.getByTestId("global-page-title")).toHaveTextContent(
      "Global Page Content"
    );
    expect(screen.getByTestId("global-page-paragraph")).toHaveTextContent(
      "A very long paragraph"
    );
  });

  it("matches snapshot", () => {
    // this test is totally optional, but might be useful for extension developers
    // to track the version diffs in "Component" from @k8slens/extensions (if you upgrade)
    // and react to the upstream changes.
    const { asFragment } = render(<GlobalPage />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="PageLayout top"
          data-testid="global-page-pagelayout"
        >
          <div
            class="header flex gaps align-center"
          >
            <h2
              data-testid="global-page-header"
            >
              Extension Global Page
            </h2>
            <i
              class="Icon back box right material interactive focusable big"
              tabindex="0"
            >
              <span
                class="icon"
              >
                close
              </span>
            </i>
          </div>
          <div
            class="content-wrapper"
          >
            <div
              class="content flex column gaps"
            >
              <div>
                <h1
                  data-testid="global-page-title"
                >
                  Global Page Content
                </h1>
                <br />
                <p
                  data-testid="global-page-paragraph"
                >
                  A very long paragraph
                </p>
              </div>
            </div>
          </div>
        </div>
      </DocumentFragment>
    `);
  });
});
