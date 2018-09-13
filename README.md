# NuAshworld

* Client lives at https://janiczek.github.io/nu-ashworld/
* Server lives at https://nu-ashworld.herokuapp.com


A game attempting to be like the old [Ashworld](http://web.archive.org/web/20090312000154/http://ashworld.webd.pl:80/index.php?strona=7) game. Definitely not there yet :)

The server is currently not persisted to a database; it runs in-memory.

There is currently no hot reloading and if you really wanted, you could see the server code from the client endpoint. Also there's no login/authentication right now. :poop:

## Next steps:

> Roughly in the order of "I'd like to do this the most", `DESC`.

- [ ] Randomized fight
- [ ] Timestamps in the messages
- [ ] Visibility of some "next tick in/at ..." information
- [ ] Think about putting some "you've healed" msg to players' queues on each Heal tick
- [ ] Design (that Adminator bootstrap template looks nice, but it's 1MB, blah. Do it myself? And in black/green FO2 theme? And with FO2 fonts? YESSS)
- [ ] Investigate bidirectional websockets in 0.19 ([somebody did it like this](https://github.com/danneu/elm-mmo))

## Done:

> In chronological order.

- [x] Only fight when you have some HP
- [x] Time-based HP regeneration
- [x] Investigate and fix the race condition for multiple HTTP responses of the server. (IDs?)
- [x] Levels
- [x] Level up messages
- [x] Persistence
- [x] Actual authentication and security
