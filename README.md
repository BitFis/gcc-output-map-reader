# GCC output.map renderer

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/bitfis/gcc-output-map-web-renderer/Node.js%20CI)
![GitHub issues](https://img.shields.io/github/issues-raw/bitfis/gcc-output-map-web-renderer)

> The parser is quite simplistic, any contributions are welcome. :heart:

Onepager to view the map file like the [amap executable](http://www.sikorskiy.net/prj/amap/index.html) does.

[Have a look at it here](https://bitfis.github.io/gcc-output-map-web-renderer).

## Available Scripts (react app)

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Create output.Map

Currently supported .Map file format:

| Linker                                                      | Command                                               | Support                                 |
| ----------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------- |
| \(Default\) [`bfd`](https://www.gnu.org/software/binutils/) | `gcc main.cpp -fuse-ld=bfd -Wl,-Map=output_bfd.map`   | :heavy_check_mark: (tested: gcc v8.3.0) |
| [`gold`](https://www.gnu.org/software/binutils/)            | `gcc main.cpp -fuse-ld=gold -Wl,-Map=output_gold.map` | :x:                                     |
| [`ldd`](https://lld.llvm.org/)                              | `gcc main.cpp -fuse-ld=ldd -Wl,-Map=output_ldd.map`   | :x:                                     |
| [`mold`](https://github.com/rui314/mold)                    | `gcc main.cpp -fuse-ld=mold -Wl,-Map=output_mold.map` | :x:                                     |

### Add Decode Support

Decoding of the map file are done via rust [pest](https://pest.rs/#editor).
A custom pest file can be created in `src/wasm/src/*.pest` and expand the `lib.rs`
accordingly.

## References

> updated 10.4.2020

opensource projects:

- [MapViewer - win(C#/.NET)](https://github.com/govind-mukundan/MapViewer)
  - Full featured and well supported
  - [Blogpost guide](https://www.embeddedrelated.com/showarticle/900.php)
- [pyelftool - python](https://github.com/eliben/pyelftools)
  - pyelftools is a pure-Python library for parsing and analyzing ELF files and DWARF debugging information.

Some blogs about map files interpretations:

- [Get the most out of the linker map file | Cyril Fougeray](https://interrupt.memfault.com/blog/get-the-most-out-of-the-linker-map-file)
- [Reddit \- Tools for viewing and analyzing linker map files?](https://www.reddit.com/r/embedded/comments/b6mvde/tools_for_viewing_and_analyzing_linker_map_files/)

others:

- [nodejs-showmap - nodejs (last update 2016)](https://github.com/meros/nodejs-showmap)
- [MapFileParser - python (current)](https://github.com/ofthedove/MapFileParser)
- [MapViewer - python (MIT | last update 2017)](https://github.com/alphaFred/MapViewer/tree/master/MapViewer)
- [pymapfile - python (no readme | last update 2016)](https://github.com/pfalcon/pymapfile)

understanding map files:

- [interrupt - Get the most out of the linker map file](https://interrupt.memfault.com/blog/get-the-most-out-of-the-linker-map-file)
