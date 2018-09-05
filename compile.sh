#!/usr/bin/env bash

echo "${1}:" \
  && elm-0.19-master make --optimize "${2}" --output "${3}"
