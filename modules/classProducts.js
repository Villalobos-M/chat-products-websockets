class Products {
   constructor() {
      this.arrayProducts = [];
   }

   getAllProducts() {
      return this.arrayProducts;
   }

   postProduct(personaGuardar) {
      if (this.arrayProducts.length === 0) {
         personaGuardar.id = 1;
      } else {
         let lastId = this.arrayProducts[this.arrayProducts.length - 1].id;
         personaGuardar.id = lastId + 1;
      }

      this.arrayProducts.push(personaGuardar);
      return this.arrayProducts;
   }
}

module.exports = { Products };
