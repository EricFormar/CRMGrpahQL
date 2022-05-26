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
## ACTUALIZAR un producto
### Schema | Mutation
- Agrego el *Mutation* **actualizarProducto**. 
- Recibe tanto el id de type *ID* para buscar el producto, como el input de type *ProductoInput* que son los datos a actualizar.
~~~
    actualizarProducto(id: ID!, input : ProductoInput) : Producto
~~~
### Resolver | Mutation
- Creo la función que recibe por parámetro un id, para que utilizando el método findById() de mongoDB busque un producto. En el caso de no encontrarlo arroja un error. Luego ejecuto el método findByIdAndUpdate() de mongoDB, el cual recibe los siguientes parámetros:
    - Un objeto que contiene el nombre del campo _id cuyo valor coincida con el id que se recibe por parámetro
    - El input, que es la información a actualizar
    - Un objeto que indica que luego devuelva el producto actualizado {new: true}
~~~
  actualizarProducto : async (_,{id,input}) => {

            try {
                let producto = await Producto.findById(id);

                if(!producto){
                    throw new Error('Producto no encontrado')
                }
                producto = await Producto.findByIdAndUpdate({_id: id}, input, {new : true});

                return producto;

            } catch (error) {
                console.log(error)
                return error
            }

        }
~~~
### Ejecución | Operation
- Si el ID está seteado como obligatorio, también aquí lo debo señalar como tal.
- Recibo por input los campos seteados en ProductoInput
- Devuelve todos o algunos de los campos considerados en el type Producto
~~~
mutation ActualizarProducto($actualizarProductoId: ID!,$input : ProductoInput) {
  actualizarProducto(id: $actualizarProductoId, input : $input) {
    nombre
    precio
    existencia  
  }
}
~~~

### Ejecución | Variables
- Paso los valores: el id del producto, y los datos que van por input (todos obligatorios)
~~~
{
  "actualizarProductoId": "628ec58ca23083ce97991c45",
  "input" : {
    "nombre" : "Televisor Philips 43'",
    "precio": 40000,
    "existencia": 120
  }
}
~~~
### Ejecución | Response
~~~
{
  "data": {
    "actualizarProducto": {
      "nombre": "Televisor Philips 43'",
      "precio": 40000,
      "existencia": 120
    }
  }
}
~~~
## ELIMINAR un producto
### Schema | Mutation
- Agrego el *Mutation* **eliminarProducto**. 
- Recibe tanto el id de type *ID* para buscar el producto y solo devolverá un string
~~~
    eliminarProducto(id : ID!) : String
~~~
### Resolver | Mutation
- Creo la función que recibe por parámetro un id, para que utilizando el método findById() de mongoDB busque un producto. En el caso de no encontrarlo arroja un error. Luego ejecuto el método findByIdAndDelete() de mongoDB para eliminar el producto. Por útimo retornará el mensaje: "El producto fue eliminado con éxito!"
~~~
   eliminarProducto : async (_,{id}) => {

            try {
                let producto = await Producto.findById(id);

                if(!producto){
                    throw new Error('Producto no encontrado')
                }
                await Producto.findByIdAndDelete({_id: id});

                return "El producto fue eliminado con éxito!"

            } catch (error) {
                console.log(error)
                return error
            }

        }
~~~
### Ejecución | Operation
- Si el ID está seteado como obligatorio, también aquí lo debo señalar como tal.
- Como no devuelve ningún type, entonces no utilizo las llaves
~~~
mutation EliminarProducto($eliminarProductoId: ID!) {
  eliminarProducto(id: $eliminarProductoId)
}
~~~

### Ejecución | Variables
- Paso los valores: el id del producto, y los datos que van por input (todos obligatorios)
~~~
{
  "eliminarProductoId": "628eef0806916d4aa2ecd335"
}
~~~
### Ejecución | Response
~~~
{
  "data": {
    "eliminarProducto": "El producto fue eliminado con éxito!"
  }
}
~~~