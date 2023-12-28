<div align="center">

  <h1><code>Map Decoder</code></h1>

<strong>This part contains the `elf` and gcc `.map` decoder written in rust with wasm.</strong>

  <p>
    <a href="https://github.com/BitFis/gcc-output-map-web-renderer/actions"><img src="https://img.shields.io/github/actions/workflow/status/BitFis/gcc-output-map-web-renderer/node.js.yml" alt="Build Status" /></a>
  </p>

<sub>Built with 🦀🕸 by <a href="https://rustwasm.github.io/">The Rust and WebAssembly Working Group</a></sub>

</div>

## About

tbd.

## Development

### Setup

The [offical rust wasm documentation](https://rustwasm.github.io/docs/book/introduction.html) provides a great way to get started.

To easily get started right away follow those steps:

> Currently only tested on linux.

Install rust & cargo:

```bash
# install rust (https://www.rust-lang.org/tools/install)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

source "$HOME/.cargo/env"
```

Install wasm-pack

```bash
# install wasm-pack (https://rustwasm.github.io/wasm-pack/installer/)
cargo install wasm-pack
```

### Build with `wasm-pack build`

```
wasm-pack build
```

### Test in Headless Browsers with `wasm-pack test`

> TBD. currently does not work

```
wasm-pack test --headless --firefox
```

### Publish to NPM with `wasm-pack publish`

> TBD. not supported

```
wasm-pack publish
```

## 🔋 Batteries Included

- [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for communicating
  between WebAssembly and JavaScript.
- [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook)
  for logging panic messages to the developer console.

## License

Licensed under MIT:

- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

### Contribution

Any contribution intentionally submitted are defined under the MIT license.
Contributions are highly welcomed.
