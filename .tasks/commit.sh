#!/bin/bash

git add .
git commit -m '${1:-wip}'
git push
