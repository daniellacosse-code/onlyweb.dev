# only web

a modern, native web wrapper demo in vue

![quality](https://img.shields.io/badge/code%20quality-bad-red)

## setup (osx only)

```sh
# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# re-source your profile, then install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# install brew if you don't have it
curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh | sh

# install dependencies
brew bundle && yarn

# create .artifacts folder
mkdir -p .artifacts/ssl

# generate local cert
mkcert -install
mkcert -cert-file .artifacts/mkcert/local.crt -key-file .artifacts/mkcert/local.key localhost 127.0.0.1 ::1
```

### development

```sh
yarn start
```

### production build

```sh
yarn build
```
