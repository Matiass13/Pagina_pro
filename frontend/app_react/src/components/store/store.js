import { createStore } from 'redux';

const estadoInicial = {
  series: []
};

function reducer(state = estadoInicial, action) {
  const nuevoState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case 'AGREGAR_UNA_SERIE':
      nuevoState.series.push(action.serie);
      return nuevoState;
    case 'AGREGAR_LISTADO_SERIES':
      nuevoState.series = action.listado;
      return {series: nuevoState.series }
    case 'REMOVER_SERIE':
      nuevoState.series = nuevoState.series.filter((unElemento) => unElemento.id !== action.idElementoARemover);
      return nuevoState;
    default:
      return state;
  }
}

export default createStore(reducer);
