# Test Assets

The test assets are generated with `gcc (Debian 8.3.0-6) 8.3.0`.
Recreate the assets by compiling:

```bash
gcc main.cpp -fuse-ld=$linker -g0 -Os -Wl,-Map=$linker/output_$linker.map -o $linker/main.out
```

Replace the `$linker` with the test linker, aka. `bfd`, `gold`, `lld`, `mold`.
