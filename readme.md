
# osu! Play Cards (WIP)
This app generates graphics for osu! plays using p5js.

**osu! API key** is required for the player's rank and overall pp. It's usable without it by filling those manually, however it's not fully supported (throws errors). 
You can create an API key over at **https://osu.ppy.sh/p/api under Legacy API**

This app runs using Node.js and uses an express server. 
Currently  it's very bare-bones, I'll add some designs later on.

## Installation
1. Download the [latest release](https://github.com/Soiiyu/osu-play-cards/releases/) and extract it to a folder.
2. Run `npm i` to install all the dependencies.
3. Run `node .` once to create a config.json file.
4. Enter your API key into the config.json file (you may also change the port this app uses).

## Usage
1. Run `node .` to run the server.
2. Open `https://localhost:<port>` to access the interface.
3. Input a **Score URL** or **ID** into the `Score url / id` field and load the score.
4. Alternatively, you can fill in the score details manually by opening the dropdown menu.
5. To save the graphic, simply *Right-Click* and *Save-as*.