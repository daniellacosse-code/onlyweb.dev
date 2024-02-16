#!/bin/bash

rm -rf api
mkdir api
watch 'cp source/framework/proxy.js api/index.js' &
vercel dev
