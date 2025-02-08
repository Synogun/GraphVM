<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD028 -->
# <center>GraphVM</center>

<!-- omit from toc -->
## <center>![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Esbuild](https://img.shields.io/badge/esbuild-%23FFCF00.svg?style=for-the-badge&logo=esbuild&logoColor=black) </center>

<!-- omit from toc -->
<!-- ## <center> [![en](https://img.shields.io/badge/README-en-red.svg)](README.md) [![pt-br](https://img.shields.io/badge/README-pt--br-green.svg)](README.pt-br.md) </center> -->

![Build_And_Deploy](https://github.com/Synogun/GraphVM/actions/workflows/build_and_deploy.yml/badge.svg)

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)

---

GraphVM its designed to be a quick and easy viewer and manipulator of graphs from [Graph Theory](https://en.wikipedia.org/wiki/Graph_theory). It was developed to be easy and simple for quick problem solving but still offer a range of powerfull features for robust and complex modeling.

---

- [GraphVM](#graphvm)
  - [Features](#features)
  - [Packages Used](#packages-used)
    - [Environment](#environment)
    - [--save-dev](#--save-dev)
    - [--save](#--save)
  - [How to](#how-to)
    - [Use the app](#use-the-app)
    - [Contribute](#contribute)
    - [Develop](#develop)

---

## Features

- [X] Add/Delete Nodes
- [X] Add/Delete Edges
- [X] Styling nodes
  - <details> <summary>Available Properties</summary>

    - Label
    - Color
    - Shape
    </details>
- [X] Styling edges
  - <details> <summary>Available Properties</summary>

    - Label
    - Color
    - Line Style
    - Curve Style
    </details>
- [X] Arrange Nodes in a layout:
  - <details> <summary>Available Properties</summary>

    - Circle
    - Grid
    - Concentric
    - Cose
    - Preset
    - Random
    </details>
- [ ] Run a range of algorithms
  <!-- - <details> <summary>Available Options</summary>

    
    </details> -->
- [ ] Importing
  - <details> <summary>Available Options</summary>

    - Generated from a list of common graph families
    - From .json (cytoscape style)
    - From plain text (classic list of edges)
    </details>
- [ ] Exporting
  - <details> <summary>Available Options</summary>

    - To .json (cytoscape style)
    - To plain text (classic list of edges) (limited content)
    - To .jpg / .png
    </details>

## Packages Used

### Environment

    "OS": "Windows 10 Home 22H2"
    "Node": "v23.6.0",
    "npm": "11.1.0"

### --save-dev

    "@eslint/js": "^9.18.0",
    "@stylistic/eslint-plugin": "^2.12.1",
    "@types/node": "^22.10.5",
    "cpx2": "^8.0.0",
    "esbuild": "0.24.2",
    "eslint": "^9.18.0",
    "http-server": "^14.1.1",
    "rimraf": "^6.0.1",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.19.1"
    
### --save

    "@types/cytoscape": "^3.21.9",
    "@types/jquery": "^3.5.32",
    "browserify": "^17.0.1",
    "cytoscape": "^3.31.0",
    "jquery": "^3.7.1"

## How to

### Use the app

1. The app its already available to use on [GraphVM](https://github.com/Synogun/GraphVM)

### Contribute

1. Any suggestions made are highly appreciated so we can keep improving the app!
2. On [Issues](https://github.com/Synogun/GraphVM/issues), you can report any bugs found, helping us on the track of a clean and polished app!

### Develop

> Sadly, we aren't accepting any pull requests at the time,
> however, we highly encourage to give any suggestions,
> feedback or report any bugs found!

> Scripts were designed with Powershell in mind. Changes may be necessary for proper usage with other shells;

1. Install dependencies: `npm install`
2. Run `npm run start:dev` to start all necessary watches
   - Optionally start each individually:
        1. Run `npx rimraf build` to remove old build directory
        2. Run `npm run start:cpx` to start copying static files to build
        3. Run `npm run start:server` to start a local server on build
        4. Run `npm run start:bundler` to start esbuild transpiler and bundler
3. `cpx` will keep copying any static (html, css, imgs) as soon any changes are saved, `http-server` will keep serving the build directory with no cache associated and `esbuild` will re-transpile and bundle all .ts files in src directory as soon as changes are made
4. Develop 😁

---

<center>Keep Calm & Keep Going</center>
<center>⚜ Synogun ⚜</center>
