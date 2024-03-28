import React  from 'react';


import { BrowserRouter as Router, Link } from 'react-router-dom';
function Home() {
  
  return (
    <div>
      <h1>Página principal</h1>
      <Link to='/series' >Ver series</Link>
    </div>
  );
}

export default Home;
