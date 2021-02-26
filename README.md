# Start Invading Clusters

⚠️⚠️⚠️
Please don't play this game on your production cluster. 😅
Alien 👾 = pod on cluster.
⚠️⚠️⚠️

![screencast](screencast_256.gif)

## Install

```bash
cd ~ && git clone https://github.com/chenhunghan/lens-ext-invaders.git
cd lens-ext-invaders && yarn && yarn build
ln -s ~/lens-ext-invaders ~/.k8slens/extensions/lens-ext-invaders
```

OR

Copy the `.tgz` link in [Release](https://github.com/chenhunghan/lens-ext-invaders/releases)

Add install the extension by paste the link in Lens -> Extension

![intstall](https://i.imgur.com/oFzyvGG.png)


## Acknowledgements

This project is largely inspired by <https://codeheir.com/2019/03/17/how-to-code-space-invaders-1978-7/>
