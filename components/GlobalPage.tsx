import React from "react"
import { Component } from "@k8slens/extensions";
import p5 from 'p5';

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


const sketch = (p: p5) => {
  let x = 300;
  let y = 300;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
  };
};

new p5(sketch);

export default GlobalPage
