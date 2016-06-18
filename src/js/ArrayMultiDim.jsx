export default class ArrayMultiDim {
  constructor (sizes) {
    if (!Array.isArray(sizes) || sizes.length < 1) throw new Error('not an array or array does not have any dimensions');
    let size = sizes.reduce((acc, x) => acc * x, 1); // multiply all dimension sizes
    this.sizes = sizes;
    this.size = size;
    this.arr = new Array(size);
    this.precomputeAccessValues();
  }

  get (indices) {
    return this.arr[this.layoutMap(indices)];
  }

  set (indices, value) {
    this.arr[this.layoutMap(indices)] = value;
  }

  precomputeAccessValues () {
    this.products = new Array(this.sizes.length).fill(1); // initialize with 1 everywhere
    // last index does not need to be multiplied
    for (let i = this.products.length - 2; i >= 0; i--) {
      this.products[i] *= this.sizes[i + 1] * this.products[i + 1];
    }
  }

  // row major, i.e. last dimension contiguous
  layoutMap (indices) {
    if (indices.length !== this.sizes.length) throw new Error('indices is of wrong length');
    if (!indices.reduce((acc, val, index) => acc && val >= 0 && val < this.sizes[index], true)) throw new Error('some index is out of bounds');
    return indices.reduce((acc, val, index) => acc + val * this.products[index], 0);
  }
};

export class ArrayMultiDimTests {
  run () {
    try {
      let arr = new ArrayMultiDim([]);
      console.log('Failed');
    } catch (e) {
      console.log('Passed. ' + e);
    }

    try {
      let arr = new ArrayMultiDim('hello');
      console.log('Failed');
    } catch (e) {
      console.log('Passed. ' + e);
    }

    try {
      let arr = new ArrayMultiDim([5]);
      arr.get([5]);
      console.log('Failed');
    } catch (e) {
      console.log('Passed. ' + e);
    }

    try {
      let arr = new ArrayMultiDim([3, 5, 4]);
      arr.get([5]);
      console.log('Failed');
    } catch (e) {
      console.log('Passed. ' + e);
    }

    let arr = new ArrayMultiDim([3, 5, 4]);
    let c = 0;
    for (let i = 0; i < arr.sizes[0]; i++) {
      for (let j = 0; j < arr.sizes[1]; j++) {
        for (let k = 0; k < arr.sizes[2]; k++) {
          arr.set([i, j, k], c++);
        }
      }
    }
    console.log(arr.products);
    console.log(arr.get([2,2,2]));
  }
};
