import { LensRendererExtension, Interface, Component } from "@k8slens/extensions";
import React from "react"

import GlobalPage from "./components/GlobalPage";
import GlobalPageMenuIcon from "./components/GlobalPageMenuIcon";
import StatusBarItemIcon from "./components/StatusBarItemIcon";

const { Icon } = Component;

export default class RendererExtension extends LensRendererExtension {

  globalPages: Interface.PageRegistration[] = [
    {
      components: {
        Page: GlobalPage,
      }
    }
  ]

  globalPageMenus: Interface.PageMenuRegistration[] = [
    {
      title: "Space Invaders Help Page",
      components: {
        Icon: (): JSX.Element => <GlobalPageMenuIcon navigate={this.navigate.bind(this)} />,
      }
    }
  ]

  statusBarItems: Interface.StatusBarRegistration[] = [
    {
      item: (): JSX.Element => <StatusBarItemIcon navigate={this.navigate.bind(this)} />,
    }
  ]

  #clusterPageId = "space_invader_clusters_page";
  clusterPages = [
    {
      id: this.#clusterPageId,
      title: "Space Invaders",
      components: {
        Page: (): JSX.Element => (
          <div style={{
            padding: "2em",
          }}>
            <h1>Space Invaders Cluster Page</h1>
          </div>
        ),
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
        Icon: (): JSX.Element => <Icon material="pages" />,
      }
    },
  ]
}
