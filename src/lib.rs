#![deny(clippy::all)]
#![allow(dead_code)]

#[macro_use]
extern crate napi_derive;

mod spawn;
mod fs;
mod os;
