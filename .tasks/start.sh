#!/bin/bash

# TODO(#120) bug: fix dev server so it restarts on code change
while :
  do
    clear
    deno run --allow-net --allow-read=. app/index.js
    sleep 2
  done
