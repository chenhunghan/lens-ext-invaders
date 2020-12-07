import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import StatusBarItemIcon from "./StatusBarItemIcon";

describe("<StatusBarItemIcon />", () => {
  it("renders w/o issues", () => {
    const { container } = render(<StatusBarItemIcon />);
    expect(container).toBeInTheDocument();
  });

  it("click called navigate()", () => {
    const navigate = jest.fn();
    render(<StatusBarItemIcon navigate={navigate} />);
    fireEvent.click(screen.getByTestId("statusbar-item-icon"));
    expect(navigate).toHaveBeenCalled();
    expect(screen.getByTestId("statusbar-item-icon")).toHaveStyle({
      color: "rgb(255, 255, 255)"
    });
  });

  it("matches snapshot", () => {
    // this test is totally optional, but might be useful for extension developers
    // to track the version diffs in "Component" from @k8slens/extensions (if you upgrade)
    // and react to the upstream changes.
    const { asFragment } = render(<StatusBarItemIcon />);
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <i
          class="Icon material interactive focusable"
          data-testid="statusbar-item-icon"
          style="color: rgb(255, 255, 255);"
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
