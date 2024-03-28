import axios from "axios";
import React, { useState, useEffect, useRef } from 'react';
import Card from "./card";

function MiComp () {
    const [serie, setSerie] = useState([]);
    // const [nombre, setNombre] = useState("")
    // const [estado, setEstado] = useState("")
    // const [descripcion, setDescripcion] = useState("")
    // const [categoria_id, setCategoria_id] = useState()
    const mountedRef = useRef(false);
    useEffect(()=> { 
        if (!mountedRef.current) {
            async function fetchData(){
                try{
                    const respuesta = await axios.get("http://127.0.0.1:3000/serie");
                    if (respuesta.status !== 200 ){
                        throw new Error("error al conectarse con el servidor");
                    }
                    setSerie([...respuesta.data]);
                }catch(e){
                    console.error(e.message);
                    return({"Error":e.message});
                }}
                fetchData();
            // This is the first render, so do the initial setup
            mountedRef.current = true;
          }
    },[])


        const resp = serie.map(unItem => {
            return <Card key= {unItem.id} nombre = {unItem.nombre}  estado =  {unItem.estado} descripcion = {unItem.descripcion}   categoria_id =  {unItem.categoria_id} />
        })
        return (
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>descripcion</th>
                        <th>Categoria</th>
                    </tr>
                </thead>
                <tbody>
                {resp}
                </tbody>
            </table>
            
        )

}
export default MiComp;