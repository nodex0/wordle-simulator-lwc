##### You can check out the built version on the [github page](https://nodex0.github.io/wordle-simulator-lwc).

## Running the Project

You'll need to have already installed on your machine: node with npm, python 3, and visual studio c++ building tools. Run:

```bash
npm install
npm run dev
```

Open the site at [http://localhost:3000](http://localhost:3000)

To build the project just execute: `npm run build`, and the project will be built on the dist folder.


# Wordle Simulator

This small application contains a JavaScript class made so that a user can get all the possible words from the already done moves in the game. It's not STRICTLY cheating, just a little assistance ;)

The approach may not be optimal (and I don't know about optimizations for these cases to be honest) but it made sense from a human point of view.

The interface has been developed using LWC OSS (see https://www.lwc.dev)

## Example

The execution of the script in `example.js` should return something like this:

    Did 2 moves, MARIO and TUPES with -x-x- and -o--x results, the pool is now: CUASI, GUISA, LUISA, QUISA, SUAZI, SUIZA
