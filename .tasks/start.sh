#!/bin/bash

while :
  do
    clear
    echo "Starting server..."
    deno run --allow-net --allow-read=. app/index.js
    sleep 2
  done