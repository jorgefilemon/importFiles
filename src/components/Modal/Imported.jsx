import style from "./modal.module.css";
import { useState } from "react";

import { IDocument, IPrinter } from "./bpac";

import printBoxesLabels from "./printBoxesLabels";
import printDisplayLabel from "./printDisplayLabel";

const Imported = ({ setModal, productsArray }) => {
	// prints in brother printer display prices.
	const [message, setMessage] = useState("");
	const printLabels = async () => {
		// creats deep copy of productsArray
		const productsArrayCopy = JSON.parse(JSON.stringify(productsArray));

		// removes objects with location arrivados
		const filteredData = productsArrayCopy.filter(
			(item) => item.location === "arrivados"
		);

		try {
			// Initialize an array to store the converted data in order to display model sizes in a row.
			const convertedData = [];
			filteredData.forEach((item) => {
				const descripcion = item.descripcion;
				const precio = item.precio;

				delete item.categoria;
				delete item.location;
				delete item.descripcion;
				delete item.precio;

				Object.entries(item).forEach(([key, value]) => {
					if (value != 0) {
						const getClave = descripcion.split(" ");
						const brand = getClave[0].slice(0, 3);
						const model = getClave[1];
						const color = getClave[2].slice(0, 2);

						convertedData.push({
							descripcion: `${descripcion} ${key}`,
							existencia: value,
							clave: `${brand}${model}${color}${key}`,
							precio: precio,
							brand: getClave[0],
						});
					}
				});
			});
			// create a printer class
			const printers = new IPrinter();
			const result = await printers.IsPrinterOnline("Brother QL-700");

			// checks if printer is online.
			if (result) {
				setMessage("Imprimiendo Etiquetas");
				// Call the function to print the labels after setting the convertedData
				await printBoxesLabels(convertedData);
				// productsArray is passed to only print one displayLabel per product model.
				await printDisplayLabel(productsArray);
				setMessage("Fin de impresion");
			} else {
				setMessage("Impresora no esta Prendida");
			}
			//
		} catch (error) {
			console.log(error);
			setMessage("Hay un error en la impresion");
		}

		IDocument.Close();
	};
	return (
		<>
			<button
				onClick={() =>
					setModal({
						visible: false,
						message: "",
					})
				}
			>
				X
			</button>
			<div className={style.message}>Articulos Importados con Exito</div>
			<div className={style.dataContainer}>{/* <Table /> */}</div>
			<div className={style.btn}>
				<button onClick={printLabels}>Imprimir Etiquetas</button>
			</div>
			<div className={style.btn}>{message}</div>
		</>
	);
};

export default Imported;
