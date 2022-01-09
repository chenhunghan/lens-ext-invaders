import React, { useEffect, useState } from "react"
import Game from "./Game"
import { Renderer } from "@k8slens/extensions";

const ClusterPage = (): JSX.Element => {

  console.info("🔥 Cluster page rendered");

  const [podsStore] = useState(Renderer.K8sApi.apiManager.getStore(Renderer.K8sApi.podsApi))

  useEffect(() => {
    const ensure = async () => {
      if (!podsStore.isLoaded) {
        await podsStore.loadAll();
        podsStore.subscribe();
      }
    }
    ensure();
  }, [podsStore])

  return (
    <div className="TabLayout">
      <main>
        <div className="ItemListLayout flex column">
          <div className="header flex gaps align-center">
            <h5>Space Invaders</h5>
          </div>
          <Game pods={podsStore.items} />
        </div>
      </main>
    </div>
  )
}

export default ClusterPage
