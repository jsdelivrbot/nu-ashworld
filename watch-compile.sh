#!/usr/bin/env bash

COLOR_OFF="\e[0m";
DIM="\e[2m";

function run {
  clear;
  tput reset;

  echo -en "${DIM}";
  date -R;
  echo -en "${COLOR_OFF}";

  ./compile.sh "Server" "src/Server/Main.elm" "dist/elm-server.js";
  echo;
  ./compile.sh "Client" "src/Client/Main.elm" "dist/elm-client.js";

}

run

inotifywait -mqr -e close_write --format '%w%f' ./src | while read FILE; do
  run;
done;
