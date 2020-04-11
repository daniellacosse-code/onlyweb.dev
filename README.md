# web-wrapper-demo

## setup (osx only)

```sh
# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# install brew
curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh | sh

# install yarn
brew install yarn

# install dependencies
yarn install

# update hostsfile
echo "127.0.0.1 local.daniellacos.se" >> /etc/hosts

# generate metadata (optional)
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
