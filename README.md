# 👁‍🗨 only-web

![quality](https://img.shields.io/badge/code%20quality-demoware-red)

Cross-platform demo of various notable cutting-edge web technologies.

### setup (osx only)

```sh
# install yarn
brew install yarn

# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
cargo install wasm-pack
```

### development

```sh
yarn watch:all
```

### production build

```sh
yarn build:all
```
