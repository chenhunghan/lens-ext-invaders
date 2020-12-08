import React from "react"
import Game from "./Game"


const ClusterPage = (): JSX.Element => {
  console.info("🔥 Cluster page rendered")
  return (
    <div className='gameContainer'>
      <Game />
    </div>
  )
}

export default ClusterPage
