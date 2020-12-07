import React from "react"
import { Component } from "@k8slens/extensions";

const { PageLayout } = Component;

const GlobalPage = (): JSX.Element =>
  <PageLayout
    header={
      <h2 key={"header"} data-testid="global-page-header">Extension Global Page</h2>
    }
    showOnTop
    data-testid="global-page-pagelayout"
  >
    <div key={"wrapper"}>
      <h1 data-testid="global-page-title">Global Page Content</h1>
      <br />
      <p data-testid="global-page-paragraph">A very long paragraph</p>
    </div>
  </PageLayout>

export default GlobalPage
