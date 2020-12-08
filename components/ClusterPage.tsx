import React, { useEffect, useState } from "react"
import Game from "./Game"
import { K8sApi } from "@k8slens/extensions";

// const podApi = K8sApi.forCluster(cluster, K8sApi.Pod);
// await podApi.delete({ name: "example-pod", namespace: "default" });


const ClusterPage = (): JSX.Element => {
  
  console.info("🔥 Cluster page rendered");

  const [podsStore] = useState(K8sApi.apiManager.getStore(K8sApi.podsApi))
  
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
    <div className='gameContainer'>
      <Game pods={podsStore.items} />
    </div>
  )
}

export default ClusterPage
