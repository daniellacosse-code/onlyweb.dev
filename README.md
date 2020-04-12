# only web

a modern, native web wrapper demo in vue

![quality](https://img.shields.io/badge/code%20quality-bad-red)

## setup (osx only)

```sh
# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# install brew
curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh | sh

# install dependencies
brew --force bundle
yarn install

# update hostsfile
echo "127.0.0.1 local.daniellacos.se" >> /etc/hosts

# generate local cert
mkcert -install
mkcert -cert-file .ssl/local.crt -key-file .ssl/local.key local.daniellacos.se localhost 127.0.0.1 ::1

# generate app metadata (optional)
vue add meta
```

### development

```sh
yarn start
```

### production build

```sh
yarn build
```

### deployments

```sh
yarn deploy:test
yarn deploy
```
