class Good {
  constructor(id, name, description, price, sizes=[], available=true) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.sizes = sizes;
    this.available = available;
  }

  setAvailable(bool) {
    this.available = !!bool;
  }
}

class GoodsList {
  #goods;

  constructor(filter, sortPrice=true, sortDir=true) {
    this.#goods = [];
    this.filter = filter;
    this.sortPrice = sortPrice;
    this.sortDir = sortDir;
  }

  get list() {
    const filteredList = this.#goods.filter(good => this.filter.test(good.name));
    if (this.sortPrice) {
     filteredList.sort((a, b) => {
       if (this.sortDir) {
         return a.price - b.price;
       } else {
         return b.price - a.price;
       }
     });
    }
    return filteredList;
  }

  add(good) {
    this.#goods.push(good);
    return this
  }

  remove(id) {
    this.#goods.find((good, index, arr) => {
      if (good.id === id) {
        arr.splice(index, 1)
        return true
      }
    })
  }
}

class BasketGood extends Good {
  constructor(amount, gInst) {
    super(gInst.id, gInst.name, gInst.description, gInst.price, gInst.sizes, gInst.available);
    this.amount = amount;
  }
}

class Basket {
  constructor(basketGoodsArr = []) {
    this.goods = basketGoodsArr;
  }

  get totalAmount() {
   return this.goods.reduce((acc, good) => acc + good.price * good.amount, 0);
  }

  get totalSum() {
    return this.goods.reduce((acc, good) => acc + good.amount, 0);
  }

  #findGood(id) {
    return this.goods.find(element => element.id === id);
  }

  add(good, amount) {
    const isGood = this.#findGood(good.id)
    if (isGood) {
      isGood.amount += amount
    } else {
      this.goods.push(new BasketGood(amount, good));
    }
  }

  remove(good, amount) {
    const isGood = this.#findGood(good.id)
    if (isGood) {
      isGood.amount -= amount;
      if (isGood.amount <= 0) {
        const index = this.goods.indexOf(isGood);
        this.goods.splice(index, 1);
      }
      return true
    } else {
      return 'NoSuchElementException'
    }
  }

  clear() {
    this.goods = [];
  }

  removeUnavailable() {
    this.goods.forEach(element => {
      if (!element.available) {
        this.remove(element, element.amount)
      }
    })
  }
}

const line = '-------------------------------------------------------------------------------'

const data = {
  goods: {
    one: new Good(1, 'aaa', 'aaaa', 1000),
    two: new Good(2, 'bbb', 'bbbb', 2000),
    three: new Good(3, 'ccc', 'cccc', 3000),
    four: new Good(4, 'ddd', 'dddd', 4000),
    five: new Good(5, 'eee', 'eeee', 5000),
  },
}

data.basketGoods = {
  one: new BasketGood(3, data.goods.one),
  two: new BasketGood(2, data.goods.two),
  three: new BasketGood(4, data.goods.three),
  four: new BasketGood(4, data.goods.four),
  five: new BasketGood(5, data.goods.five)
}

const c1 = new GoodsList(/[ab]/);
const c2 = new GoodsList(/[cd]/, true, false)
c1.add(data.goods.one)
  .add(data.goods.two)
  .add(data.goods.three)
  .add(data.goods.one)
  .add(data.goods.three)
  .add(data.goods.four);
console.log(c2.list, '\n', line);
console.log(c1.list, '\n', line);
c1.sortDir = false;
console.log(c1.list, '\n', line);
c1.remove(1);
console.log(c1.list, '\n', line);


const b1 = new Basket([data.basketGoods.one, data.basketGoods.two, data.basketGoods.three]);
console.log(b1.totalSum, '\n', line);
console.log(b1.totalAmount, '\n', line);
b1.add(data.goods.five, 2)
console.log(b1.totalAmount, '\n', line);
b1.remove(data.goods.one, 1)
console.log(b1.totalAmount, '\n', line);
b1.remove(data.goods.two, 2);
console.log(b1.totalAmount, '\n', line);
data.basketGoods.one.setAvailable(false);
b1.removeUnavailable();
console.log(b1.goods, '\n', line)