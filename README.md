# only-web
![quality](https://img.shields.io/badge/code%20quality-bad-red)

### setup (osx only)

```sh
# install yarn v2+
brew install yarn
yarn set version berry

# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

### development

```sh
yarn watch:all
```

### production build

```sh
yarn build:all
```
