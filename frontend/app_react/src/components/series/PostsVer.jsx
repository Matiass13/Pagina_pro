import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

function PostsVer() {
  const params = useParams();
  const listado = useSelector((state) => state.series);
  const [serie, setSerie] = React.useState([]);
  const dispatch = useDispatch();

 
 
  React.useEffect(() => {
    // Se puede realizar una peticion al servidor para obtener la última version o
    // o utilizar los datos del store (vamos a usar esta última para tener una versión)
    // diferente a la realizada anteriormente
    try {
      if (!listado || listado.length==0) {
        throw new Error("No hay ninguna serie en el servidor");
      }
      setSerie(listado.find((item) => item.id == params.id));
      //console.log("llega hasta aca"+ listado)
    } catch (e) {
        console.error(e.message);
        return({"Error":e.message});
    }
    // En caso de no encontrarlo en el listado, se puede solicitar al servidor
  }, [params, listado]);


  return (
    console.log(serie),
    <>
      <h1>Ver un serie</h1>
      <p>Ejemplo de recepción de parámetros por medio de la URL</p>
      <Link to="/series">Volver al listado de series</Link>
      <h2>{serie.nombre}</h2>
      <h3>{serie.categoria}</h3>
      <h3>{serie.descripcion}</h3>
      
    </>
  );
}

export default PostsVer;
