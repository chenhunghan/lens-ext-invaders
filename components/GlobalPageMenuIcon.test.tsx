import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import GlobalPageMenuIcon from "./GlobalPageMenuIcon";

describe("<GlobalPageMenuIcon />", () => {
  it("renders w/o issues", () => {
    const { container } = render(<GlobalPageMenuIcon />);
    expect(container).toBeInTheDocument();
  });

  it("click called navigate()", () => {
    const navigate = jest.fn();
    render(<GlobalPageMenuIcon navigate={navigate} />);
    fireEvent.click(screen.getByTestId("global-page-menu-icon"));
    expect(navigate).toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    // this test is totally optional, but might be useful for extension developers
    // to track the version diffs in "Component" from @k8slens/extensions (if you upgrade)
    // and react to the upstream changes.
    const { asFragment } = render(<GlobalPageMenuIcon />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <i
          class="Icon material interactive focusable"
          data-testid="global-page-menu-icon"
          style="color: white;"
          tabindex="0"
        >
          <span
            class="icon"
          >
            my_location
          </span>
        </i>
      </DocumentFragment>
    `);
  });
});
