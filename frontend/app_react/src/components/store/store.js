import { createStore } from 'redux';


const estadoInicial = {
  series: [],
  categorias: []
};


function reducer(state = estadoInicial, action) {
  const nuevoState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case 'AGREGAR_UNA_SERIE':
      nuevoState.series.push(action.serie);
      return nuevoState;
    case 'AGREGAR_LISTADO_SERIES':
      nuevoState.series = action.listado;
      return {
        series: nuevoState.series,
        categorias: nuevoState.categorias
      }
    case 'REMOVER_SERIE':
      nuevoState.series = nuevoState.series.filter((unElemento) => unElemento.id !== action.idElementoARemover);
      return nuevoState;
    // case 'AGREGAR_UNA_CATE':
    //   nuevoState.categorias.push(action.categorias);
    //   return nuevoState;
     case 'AGREGAR_LISTADO_CATE':
       nuevoState.categorias = action.listado_cate;
       return {
        series: nuevoState.series,
        categorias: nuevoState.categorias
      }
    // case 'REMOVER_CATE':
    //   nuevoState.categorias = nuevoState.categorias.filter((unElemento) => unElemento.id !== action.idElementoARemover);
    //   return nuevoState;
    default:
      return state;
  }
}

export default createStore(reducer);
