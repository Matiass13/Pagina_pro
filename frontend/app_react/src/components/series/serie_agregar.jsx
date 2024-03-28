import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PostsAgregar(props) {
  const [form, setForm] = React.useState({ nombre: '', descripcion: '', categoria: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [err, setErr] = React.useState("");
  const handleNombreChange = (e) => {
    const newForm = JSON.parse(JSON.stringify(form));
    newForm.nombre = e.target.value;
    setForm(newForm);
  };
  const handleDescripcionChange = (e) => {
    const newForm = JSON.parse(JSON.stringify(form));
    newForm.descripcion = e.target.value;
    setForm(newForm);
  };
  const handleCategoriaChange = (e) => {
    const newForm = JSON.parse(JSON.stringify(form));
    newForm.categoria = e.target.value;
    setForm(newForm);
  };

  const handleCancel = () => {
    navigate('/series');
  };

  const handleSave = async () => {
    try {
      if (!form.nombre || !form.categoria){
        throw new Error("Faltan datos")
      }
      const serverResponse = await axios.post(`https://localhost:3000/serie`, form);
      dispatch({ type: 'AGREGAR_UNA_SERIE', serie: serverResponse.data });
      navigate('/series');
    } catch (e) {
      
      setErr(e.message);
      console.error(err);
  
      return({"Error":e.message});
    }
  };

  // const DeployableMenu = () => {
  //   const [isOpen, setIsOpen] = useState(false);
  // }
  
  //   const toggleMenu = () => {
  //     setIsOpen(!isOpen);
  //   };

  return (

    <div>
      <div>{err}</div>
      <div>
        <label>Nombre</label>
        <input type="text" value={form.nombre} onChange={handleNombreChange} />
      </div>
      <div>
        <label>Descripcion</label>
        <input type="text" value={form.descripcion} onChange={handleDescripcionChange} />
      </div>
      <div>
        <label>Categoria</label>
        <input type="text" value={form.categoria} onChange={handleCategoriaChange} />
      </div>
      <div>
        <button onClick={handleSave}>Guardar</button>
        <button onClick={handleCancel}>Cancelar</button>
        <p>El nuevo posteo se va a agregar al final del listado</p>
      </div>
    </div>
  );
}

export default PostsAgregar;
