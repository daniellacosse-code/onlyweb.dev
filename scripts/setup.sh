#!/bin/bash

curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
wasm-pack build
yarn install
