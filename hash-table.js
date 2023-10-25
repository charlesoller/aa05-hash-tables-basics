const sha256 = require('js-sha256');

class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {

  constructor(numBuckets = 4) {
    this.count = 0;
    this.capacity = numBuckets;
    this.data = new Array(this.capacity)
    this.data.fill(null)
  }

  hash(key) {
    let hashed = sha256(key);
    return parseInt(`0x${hashed.slice(0, 8)}`);
  }

  hashMod(key) {
    //This is used to generate the index for this.data
    return this.hash(key) % this.capacity;
  }

  insertNoCollisions(key, value) {
    let index = this.hashMod(key);
    if(!this.data[index]){
      this.data[index] = new KeyValuePair(key, value);
      this.count++;
    } else {
      throw new Error("hash collision or same key/value pair already exists!");
    }
  }

  insertWithHashCollisions(key, value) {
    let index = this.hashMod(key);
    if(!this.data[index]){
      this.data[index] = new KeyValuePair(key, value);
      this.count++;
    } else {
      let prevPair = this.data[index];
      this.data[index] = new KeyValuePair(key, value);
      this.data[index].next = prevPair;
      this.count++;
    }
  }

  insert(key, value) {
    let index = this.hashMod(key);
    if(!this.data[index]){
      //This index is empty
      this.data[index] = new KeyValuePair(key, value);
      this.count++;
    } else {
      //This index is already filled
      //loops from beginning of LL to check if the key already exists at the occupied index
      let curr = this.data[index];
      while(curr){
        if(curr.key === key){
          curr.value = value;
          return;
        }
        curr = curr.next
      }

      //Index is filled, but the key does not yet exist
      //inserts at head
      let prevPair = this.data[index];
      this.data[index] = new KeyValuePair(key, value);
      this.data[index].next = prevPair;
      this.count++;
      }
    }
}


module.exports = HashTable;
