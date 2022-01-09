import { Renderer } from "@k8slens/extensions";
import React from "react";

import ClusterPage from "./components/ClusterPage";

const { Component: {Icon} } = Renderer;

export default class RendererExtension extends Renderer.LensExtension {

  #clusterPageId = "space_invader_clusters_page";
  clusterPages = [
    {
      id: this.#clusterPageId,
      title: "Space Invaders",
      components: {
        Page: ClusterPage
      }
    },
  ]

  clusterPageMenus = [
    // a cluster menu item which links to a cluster page
    {
      title: "Space Invaders",
      target: {
        pageId: this.#clusterPageId,
        params: {}
      },
      components: {
        Icon: (): JSX.Element => <Icon material="my_location" />,
      }
    },
  ]
}
