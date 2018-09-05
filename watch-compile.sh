#!/usr/bin/env bash

COLOR_OFF="\e[0m";
DIM="\e[2m";

function run {
  clear;
  tput reset;

  echo -en "${DIM}";
  date -R;
  #echo "# ./run ${1}";
  echo -en "${COLOR_OFF}";

  case "${1}" in
    ./src/Client/*)
      ./compile.sh "Client" "src/Client/Main.elm" "dist/elm-client.js";
      ;;
    *)
      ./compile.sh "Server" "src/Server/Main.elm" "dist/elm-server.js";
      echo;
      ./compile.sh "Client" "src/Client/Main.elm" "dist/elm-client.js";
      ;;
  esac
}

run "both";

inotifywait -mqr -e close_write --format '%w%f' ./src | while read FILE; do
  run "${FILE}";
done;
