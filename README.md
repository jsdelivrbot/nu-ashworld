# NuAshworld

* Play at https://janiczek.github.io/nu-ashworld/
* Subreddit at https://www.reddit.com/r/NuAshworld/

A game attempting to be like the old [Ashworld](http://web.archive.org/web/20090312000154/http://ashworld.webd.pl:80/index.php?strona=7) game. Definitely not there yet :)

It is still very much in flux and less-than-alpha quality. Expect whatever progress you do in the game to get lost regularly. There is some basic persistence baked in, but until the game goes to some kind of alpha or beta, I don't worry about dropping the whole database too much.

## Next steps:

> Roughly in the order of "I'd like to do this the most", `DESC`.

- [ ] XP per fight is determined by the player HP (multiplier?)
- [ ] Game logs (API requests) saved to SQL
- [ ] Fight result is not "You won / You lost" but the final HP etc.
- [ ] Loading screens keep the previous data, there's just a spinner or something
- [ ] Anti-spam measures for the signup form
- [ ] Ticks, capped, once per ... what, an hour? (ENV flag to make it go faster for debug/testing purposes?)
- [ ] Visibility of some "next tick in/at ..." information
- [ ] Design (that Adminator bootstrap template looks nice, but it's 1MB, blah. Do it myself? And in black/green FO2 theme? And with FO2 fonts? YESSS)
- [ ] Move to full-fledged SQL before the current style gets unwieldy
- [ ] Migrations between DB states
- [ ] HP [is determined by](http://fallout.wikia.com/wiki/Hit_Points#Fallout_and_Fallout_2) level + strength + endurance
- [ ] Skills
- [ ] Skills influence fight (and SPECIAL influences it too, a bit more than it does currently)
- [ ] Timestamps in the messages
- [ ] Think about putting some "you've healed" msg to players' queues on each Heal tick
- [ ] FO2 Map
- [ ] Inventory
- [ ] Gathering system? Do we want to be that kind of game? Or more like "kill everything in random encounters and take the loot"?
- [ ] NPC shops
- [ ] Player auction house / market / Grand Exchange / whatever you want to call it
- [ ] Investigate bidirectional websockets in Elm 0.19 ([somebody did it like this](https://github.com/danneu/elm-mmo))

## Done:

See [CHANGELOG.md](https://github.com/Janiczek/nu-ashworld/blob/master/CHANGELOG.md)

