class Contenedor {
   constructor(nombreTabla, options) {
      this.nombreTabla = nombreTabla;
      this.knex = require("knex")(options);
   }

   //Extrae la tabla completa
   async getAllData() {
      let data = [];
      try {
          data = this.knex.from(this.nombreTabla).select("*");
      } catch (err) {
         console.log(err);
      }
      return data;
   }

   //Guarda un objeto en la base de datos
   async postData(data) {
      this.knex(this.nombreTabla)
         .insert(data)
         .then(() => console.log("data inserted"));
   }
}

module.exports = {Contenedor};
