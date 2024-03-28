import './App.css';
import React, {useRef, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SerieListado from './components/series/PostsListado.jsx';
import SerieVer from './components/series/PostsVer.jsx';
import SerieAgregar from './components/series/serie_agregar.jsx';
import Home from './Home.jsx';
import axios from "axios";



function App() {
  const dispatch = useDispatch();
  const mountedRef = useRef(false);
  useEffect(()=> { 
    if (!mountedRef.current) {
      async function fetchData(){
      try{
        const respuesta = await axios.get("http://127.0.0.1:3000/serie");
        if (respuesta.status !== 200 ){
          throw new Error("error al conectarse con el servidor");
        }
      dispatch({type: "AGREGAR_LISTADO_SERIES", listado:[...respuesta.data]})
      }catch(e){
        console.error(e.message);
        return({"Error":e.message});
      }}
    fetchData();
    // This is the first render, so do the initial setup
    mountedRef.current = true;
    }
  },[]);

  return (
    <div className="App">
      

      <h1>Aplicación de </h1>
      <p>
        En la ruta / se hace la petición de los posteos al servidor, para que sea más rápida las operaciones posteriores
      </p>
      <Router>
        <Routes>
        <Route exact path="/" Component={Home} />
        <Route Path="/serie/view/:id" Component={SerieVer} />
        <Route exact path="/series" Component= {SerieListado} />
        <Route exact path="/serie/new" Component={SerieAgregar} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;

      
          
         
         