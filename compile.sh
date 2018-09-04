#!/usr/bin/env bash

echo "Server:" \
  && elm-0.19-master make --optimize src/Server/Main.elm --output dist/elm-server.js \
  && echo -e "\nClient:" \
  && elm-0.19-master make --optimize src/Client/Main.elm --output dist/elm-client.js \
