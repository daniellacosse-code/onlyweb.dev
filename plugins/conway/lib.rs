extern crate fixedbitset;
extern crate js_sys;

use wasm_bindgen::prelude::*;
use fixedbitset::FixedBitSet;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Universe {
  width: u32,
  height: u32,
  cells: FixedBitSet,
}

#[wasm_bindgen]
impl Universe {
  pub fn new(width: u32, height: u32) -> Universe {
    let size = (width * height) as usize;
    let mut cells = FixedBitSet::with_capacity(size);

    for i in 0..size {
        cells.set(i, js_sys::Math::random() > 0.5);
    }

    Universe {
      width,
      height,
      cells
    }
  }

  pub fn tick(&mut self) {
    let mut next_frame = self.cells.clone();

    for row in 0..self.height {
      for col in 0..self.width {
        let idx = self.get_index(row, col);
        let cell = self.cells[idx];
        let live_neighbors = self.live_neighbor_count(row, col);

        next_frame.set(idx, match (cell, live_neighbors) {
          (true, x) if x < 2 => false,
          (true, 2) | (true, 3) => true,
          (true, x) if x > 3 => false,
          (false, 3) => true,
          (otherwise, _) => otherwise,
        });
      }
    }

    self.cells = next_frame;
  }

  pub fn cells(&self) -> *const u32 {
    self.cells.as_slice().as_ptr()
  }

  pub fn toggle_cell(&mut self, row: u32, column: u32) {
    let idx = self.get_index(row, column);
    let cell = self.cells[idx];
    self.cells.set(idx, !cell);
  }

  pub fn destroy(&mut self) {
    std::mem::drop(self);
  }

  fn get_index(&self, row: u32, column: u32) -> usize {
    (row * self.width + column) as usize
  }

  fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
    let mut count = 0;

    let north = if row == 0 {
      self.height - 1
    } else {
      row - 1
    };

    let south = if row == self.height - 1 {
      0
    } else {
      row + 1
    };

    let west = if column == 0 {
      self.width - 1
    } else {
      column - 1
    };

    let east = if column == self.width - 1 {
      0
    } else {
      column + 1
    };

    let nw = self.get_index(north, west);
    count += self.cells[nw] as u8;

    let n = self.get_index(north, column);
    count += self.cells[n] as u8;

    let ne = self.get_index(north, east);
    count += self.cells[ne] as u8;

    let w = self.get_index(row, west);
    count += self.cells[w] as u8;

    let e = self.get_index(row, east);
    count += self.cells[e] as u8;

    let sw = self.get_index(south, west);
    count += self.cells[sw] as u8;

    let s = self.get_index(south, column);
    count += self.cells[s] as u8;

    let se = self.get_index(south, east);
    count += self.cells[se] as u8;

    count
  }
}
