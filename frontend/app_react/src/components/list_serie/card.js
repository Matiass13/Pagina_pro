export default function card(props) {
    return (
        <>
        <tr>
            <td>{props.nombre}</td>
            <td>{props.descripcion}</td>
            <td>{props.estado}</td>
            <td>{props.categoria_id}</td>
        </tr>
        </>
    )
}