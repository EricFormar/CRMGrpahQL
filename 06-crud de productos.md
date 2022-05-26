# CRUD de Productos
## Traer TODOS los productos
### Schema | Query
- Agrego la *Query* **obtenerProductos**. No recibe ningún parámetro y devolverá un array.
~~~
type Query {
    obtenerProductos : [Producto]
}
~~~
### Resolver | Query
- Creo la función que utilizando sintaxis de mongoDB trae todos los productos
~~~
obtenerProductos : async () => {

        try {
            const productos = await Producto.find({})
            return productos
        } catch (error) {
            console.log(error)
        }
    }
~~~
### Ejecución | Operation
- Puedo elegir que campos traer al momento de realizar la consulta.
~~~
query obtenerProductos {
    obtenerProductos {
      id,
      nombre,
      existencia,
      precio,
      creado
    }
}
~~~
### Response
~~~
{
  "data": {
    "obtenerProductos": [
      {
        "id": "628ec58ca23083ce97991c45",
        "nombre": "Televisor Philips 32'",
        "existencia": 100,
        "precio": 320000,
        "creado": "1653523305863"
      },
      {
        "id": "628ec61ba23083ce97991c47",
        "nombre": "Asus i7 12ram 1Tb SSD",
        "existencia": 500,
        "precio": 90000,
        "creado": "1653523305863"
      },
      {
        "id": "628ec63ea23083ce97991c49",
        "nombre": "MacBook Air 13",
        "existencia": 50,
        "precio": 150000,
        "creado": "1653523305863"
      }
    ]
  }
}
~~~
## Obtener UN producto
### Schema | Query
- Agrego la *Query* **obtenerProducto**. Recibe un id de type ID (obligatorio) y devuelve un producto conforme al type de Producto.
~~~
type Query {
    obtenerProductos(id : ID!) : Producto
}
~~~
### Resolver | Query
- Creo la función que recibe por parámetro un id, para que utilizando el método findById de mongoDB busque un producto. En el caso de no encontrarlo arroja un error.
~~~
obtenerProducto : async (_,{id}) => {
        try {
            const producto = await Producto.findById(id);
            console.log(producto)
            if(!producto){
                throw new Error('Producto no encontrado')
            }
            return producto
        } catch (error) {
            console.log(error)
            return error
        }
    }
~~~
### Ejecución | Operation
- Si el ID está seteado como obligatorio, también aquí lo debo señalar como tal.
~~~
query obtenerProducto ($obtenerProductoId: ID!){
  obtenerProducto(id: $obtenerProductoId) {
    nombre
    precio
  }
}
~~~

### Ejecución | Variables
{
  "obtenerProductoId": "628ec58ca23083ce97991c45",
}
### Ejecución | Response
~~~
{
  "data": {
    "obtenerProducto": {
      "nombre": "Televisor Philips 32'",
      "precio": 320000
    }
  }
}
~~~