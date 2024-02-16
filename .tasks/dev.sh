#!/bin/bash

rm -rf api
mkdir api
cp source/framework/proxy.js api/index.js
vercel dev --debug
