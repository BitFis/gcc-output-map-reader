//! Test for parser.

#![cfg(target_arch = "wasm32")]

use std::{env, fs, path::Path, println, string::String};

extern crate wasm_bindgen_test;
use wasm::Rule;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
fn parse() {
    let test_content = include_str!("./assets/test_eh_frame.map");

    let actual = wasm::parse(&test_content);

    assert_eq!(actual.memory_start, 792);
}
