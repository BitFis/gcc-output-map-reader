mod utils;

use pest::{iterators::Pairs, Parser};
use pest_derive::Parser;
use wasm_bindgen::prelude::*;

#[derive(Parser)]
#[grammar = "gcc_map.pest"]
struct GccMapParser;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

pub struct MemoryTable {
    pub memory_start: u64,
}

impl Default for MemoryTable {
    fn default() -> MemoryTable {
        MemoryTable { memory_start: 0 }
    }
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm!");
}

fn decode_value(parse: Pairs<'_, Rule>) -> u64 {
    for pair in parse {
        match pair.as_rule() {
            Rule::hex => {
                return u64::from_str_radix(pair.as_str(), 16).unwrap_or_else(|e| panic!("{}", e));
            }
            _ => {
                panic!("Unknown value '{}'", pair.as_str());
            }
        }
    }
    return 0;
}

fn decode_memory(parse: Pairs<'_, Rule>) -> u64 {
    let mut start_mem_table = 0;
    for pair in parse {
        match pair.as_rule() {
            Rule::memory_address_start => {
                start_mem_table = decode_value(pair.into_inner());
            }
            _ => {
                println!("TODO: {}", pair.as_str());
            }
        }
    }
    return start_mem_table;
}

pub fn parse(content: &str) -> MemoryTable {
    let parse = GccMapParser::parse(Rule::main, &content)
        .unwrap_or_else(|e| panic!("{}", e))
        .next()
        .unwrap();

    let mut result = MemoryTable {
        ..Default::default()
    };

    for pair in parse.into_inner() {
        match pair.as_rule() {
            Rule::memory_table => {
                result.memory_start = decode_memory(pair.into_inner());
            }
            _ => {
                println!("TODO: Just ignore for now");
            }
        }
    }

    return result;
}
