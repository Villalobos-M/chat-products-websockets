class Messages {
   constructor() {
      this.messages = [];
      this.id = 0;
   }

   getAllMessage() {
      return [...this.messages];
   }

   postMessage(prod) {
      const newProd = { ...prod, id: ++this.id };
      this.messages.push(newProd);
      return newProd;
   }


}

module.exports = {Messages};
