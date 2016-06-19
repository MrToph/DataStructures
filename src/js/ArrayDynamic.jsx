export default class ArrayDynamic {
  constructor (capacity) {
    this.top = -1;
    this.growFactor = 2;
    this.shrinkFactor = 0.25;
    this.minCapacity = 4;	// should be divisible by 1/shrinkfactor for our purposes
    this.capacity = Math.min(this.minCapacity, capacity);
    this.arr = new Array(this.capacity);
  }

  get (index) {
    if (index < 0 || index >= this.capacity) throw Error('out of bounds');
    return this.arr[index];
  }

  push (value) {
    this.insertAt(this.top + 1, value);
  }

  insertAt (index, value) {
    let oldCapacity = this.capacity;
    // make index fit inside our array
    while (index > this.capacity - 1) {
      this.capacity *= this.growFactor;
    }
    // set new top eventually
    let oldTop = this.top;
    this.top = Math.max(this.top, index);
    // have to grow array?
    if (this.top >= this.capacity / this.growFactor) {
      this.capacity *= this.growFactor;
    }
    // copy stuff over
    let newArr;
    if (oldCapacity < this.capacity) { // capacity changed => relocate
      newArr = new Array(this.capacity); // have to create a new one
      // copy from 0 up to insert index or to the old top (if insert index > oldTop)
      for (let i = 0; i < Math.min(index, oldTop + 1); i++) {
        newArr[i] = this.arr[i];
      }
    } else {
      newArr = this.arr; // do it in place
    }
    // only have to shift interval [index, oldTop] one to the right
    // (only happens if inserting before oldTop, i.e. index < oldTop)
    for (let i = oldTop + 1; i > index; i--) {
      newArr[i] = this.arr[i - 1]; // right shift
    }
    newArr[index] = value;
    this.arr = newArr;
  }

  remove (index) {
    if (index < 0 || index > this.top) throw Error('out of bounds');
    let newTop = this.top;	// indicates the new top value AFTER shifting to the left (so at the end of the function)
    if (index < this.top) newTop--; // newTop will be the old one just shifted one to the left (because the remove happens to the left of it)
    else { // otherwise have to find newTop by looking for largest index that is not undefined
      newTop = this.top - 1; // index > this.top, index < this.top both doesn't hold => index = top, start one from the left of it to look for non-undefined values
      while (newTop >= 0) {
        if (this.arr[newTop] !== undefined) break;
        newTop--;
      }
    }
    // given newTop we can now check for shrinking the array
    let oldCapacity = this.capacity;
    if (newTop < this.minCapacity * this.shrinkFactor) this.capacity = this.minCapacity;
    while (newTop < this.capacity * this.shrinkFactor && this.capacity > this.minCapacity) {
      this.capacity *= this.shrinkFactor; // no flooring needed as minCapacity is divisible by 4 (1/shrinkfactor)
    }
    this.capacity = Math.max(this.capacity, this.minCapacity);
    // copy stuff over, eventually create new array
    let newArr;
    if (oldCapacity > this.capacity) { // capacity changed => relocate
      newArr = new Array(this.capacity); // have to create a new one
      // copy from 0 up to remove index (=> newTop = top - 1) or up to the new top (if remove index > newTop, i.e. index == top got removed)
      for (let i = 0; i < Math.min(index, newTop + 1); i++) {
        newArr[i] = this.arr[i];
      }
    } else {
      newArr = this.arr; // do it in place
    }
    // only have to shift interval [index+1, top] one to the left
    // (only happens if removing left of top, i.e. index < newTop)
    for (let i = index; i < newTop + 1; i++) {
      newArr[i] = this.arr[i + 1]; // left shift
    }
    delete this.arr[this.top];	// when we remove, top always decreases, we need to clear this one (again this is only needed when index == top got removed)
    this.top = newTop;
    this.arr = newArr;
  }
};

export class ArrayDynamicTests {
  run () {
    let arr = new ArrayDynamic(5);
    this.log(arr);
    for (let i = 1; i < 15; i++) {
      arr.push(i);
      this.log(arr);
    }
    arr.insertAt(0, 0);
    this.log(arr);
    arr.insertAt(49, 50);
    this.log(arr);
    arr.remove(49);
    this.log(arr);
    arr.remove(0);
    this.log(arr);
  }

  log (obj) {
    console.log(obj.arr.slice(), obj.capacity); // create copy
  }
};
