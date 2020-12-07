import React from "react"
import { Component } from "@k8slens/extensions";

const { Icon } = Component;

const GlobalPageMenuIcon = ({ navigate }: { navigate?: () => void }): JSX.Element => (
  <Icon
    material="my_location"
    interactive
    style={{
      color: "white"
    }}
    onClick={() => navigate()}
    data-testid="global-page-menu-icon"
  />
)

export default GlobalPageMenuIcon
