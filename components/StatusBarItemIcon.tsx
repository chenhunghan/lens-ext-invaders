import React from "react"
import { Component } from "@k8slens/extensions";

const { Icon } = Component;

const StatusBarItemIcon = ({ navigate }: { navigate?: () => void }): JSX.Element => (
  <Icon
    material="my_location"
    interactive
    style={{
      color: "rgb(255, 255, 255)"
    }}
    onClick={() => navigate()}
    data-testid="statusbar-item-icon"
  />
)

export default StatusBarItemIcon
