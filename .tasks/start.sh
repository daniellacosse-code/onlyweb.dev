#!/bin/bash

while :
  do
    clear
    deno run --allow-net --allow-read=. app/index.js
    sleep 2
  done