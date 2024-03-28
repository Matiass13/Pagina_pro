import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Link } from 'react-router-dom';

function PostsListado() {
  const dispatch = useDispatch();
  const listado_series = useSelector((state) => state.series);
  const listadocate = useSelector((state) => state.categorias);

  const handleBorrarPosteo = async (idABorrar) => {
    // Hacer peticion al servidor y si la peticion es correcta borrar del store
    try {
      await axios.delete(`https://localhost:3000/serie/${idABorrar}`);
      dispatch({ type: 'REMOVER_SERIE', idElementoARemover: idABorrar });
    } catch (e) {
      // Informar al usuario que no se pudo borrar
    }
  };

  return (
    console.log(listadocate),
    <>
    <Link to="/">Volver a la pagina principal</Link>
      <h1>Listado de Posteos</h1>
       <p>Ejemplo de paso de parámetros por medio de una ruta/URL a otro componente</p>
      <Link to='/serie/new'>Agregar una serie</Link> 
      <ul>
        {listado_series.map((unPost) => (
          <li key={unPost.id}>
            <Link to={'/serie/view/' + unPost.id}>{unPost.nombre}</Link>{' '}
            <button onClick={() => handleBorrarPosteo(unPost.id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default PostsListado;
