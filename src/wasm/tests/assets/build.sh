#!/bin/bash

function die() {
    echo "$@"
    exit 1
}

allowed_linker='lld|mold|bfd|gold'

linker="$1"
[[ "$linker" != "" ]] || die "No linker provided"
[[ "$linker" =~ ^($allowed_linker)$ ]] || die "Supported linker $allowed_linker"

mkdir -p $linker
command='gcc main.cpp -fuse-ld='"$linker"' -g0 -Os -Wl,-Map='"$linker/output_$linker.map"' -o '"$linker/main.out"
echo "> $command"
$command