# NuAshworld

A game attempting to be like the old [Ashworld](http://web.archive.org/web/20090312000154/http://ashworld.webd.pl:80/index.php?strona=7) game. Definitely not there yet :)

```bash
$ yarn
$ yarn start:server # endpoint: localhost:3333
$ yarn start:client # endpoint: localhost:4444
$ google-chrome http://localhost:4444
```

![Screencast of the current functionality](https://github.com/Janiczek/nu-ashworld/raw/master/video.gif)

The server is currently not persisted to a database; it runs in-memory.

There is currently no hot reloading and if you really wanted, you could see the server code from the client endpoint. Also there's no login/authentication right now. :poop:

## Next step:

- [ ] Investigate bidirectional websockets in 0.19
- [ ] Time-based HP regeneration
- [ ] Only fight when you have some HP
- [ ] Levels
- [ ] Design (that Adminator bootstrap template looks nice, but it's 1MB, blah. Do it myself? And in black/green FO2 theme? And with FO2 fonts? YESSS)
