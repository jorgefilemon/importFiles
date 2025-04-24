import { useState } from "react";
import axios from "axios";
import "../../App.css";
import style from "./printLabels.module.css";

import { IDocument } from "../../components/Modal/bpac";

function PrintLabels() {
	//
	const [input, setInput] = useState("");

	const [productList, addProduct] = useState([]);

	const removeItem = (index) => {
		const updatedproductList = [...productList];
		updatedproductList.splice(index, 1);
		addProduct(updatedproductList);
	};
	console.log(productList);
	// gets product from the api call
	const getArticulo = async (e) => {
		e.preventDefault();

		const words = input.trim().split(/\s+/);

		let apiInput = input; // Initialize apiInput with the original input value

		if (/^[a-zA-Z]+$/.test(words[0]) && /^[a-zA-Z]+$/.test(words[1])) {
			// If both the first and second words consist of letters, join them
			apiInput =
				words.slice(0, 2).join("") + " " + words.slice(2).join(" ");
		} else {
			apiInput = input; // Use the original input value
		}

		console.log("apiInput", apiInput);
		try {
			const response = await axios.get(
				`http://localhost:3001/product/${apiInput}`
			);

			// get data with [0] only to get the object {}
			const newProduct = response.data[0];
			// Functional Programming: Some developers prefer this approach because it aligns with functional programming principles.
			// It emphasizes immutability by creating a new array based on the old one, which can make your code more predictable.
			// create a copy of productList so productList stays immutable
			const updatedproductList = [...productList, newProduct];

			addProduct(updatedproductList);

			// Clear the input field
			setInput("");
		} catch (error) {
			setInput("");
			console.error("Error fetching data:", error);
		} finally {
			setTimeout(() => {}, 500);
		}
	};

	const printLabelsData = async () => {
		//checks if label exists.
		try {
			const label = await IDocument.Open(
				"C:/Users/jorge/Desktop/boxLabel.lbx"
			);

			//console.log(label);

			const newData = JSON.parse(JSON.stringify(productList));
			console.log("newData", newData);
			if (label) {
				const code = await IDocument.GetObject("barCode");
				const brandLabel = await IDocument.GetObject("brand");
				const modelLabel = await IDocument.GetObject("model");
				const colorLabel = await IDocument.GetObject("color");
				const sizeLabel = await IDocument.GetObject("size");

				for (const data of newData) {
					code.Text = data.clave;

					const description = data.descripcion.split(" ");
					const brand = description[0];
					const model = description[1];
					let color = description[2];
					color = color.length > 11 ? color.substring(0, 11) : color;
					let size = description[description.length - 1];

					brandLabel.Text = brand;
					modelLabel.Text = model;
					colorLabel.Text = color;
					sizeLabel.Text = (size * 0.1).toFixed(1); // adds the decimal to shoe size, example 5.0 to the size

					IDocument.StartPrint("", 0);
					IDocument.PrintOut(1, 0);
					IDocument.EndPrint();
					console.log("end of printing");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	const printDisplayLabel = async () => {
		try {
			await IDocument.Open("C:/Users/jorge/Desktop/displayLabel.lbx");

			// get label labels name.
			const precioLabel = await IDocument.GetObject("precioLabel");
			const marcaLabel = await IDocument.GetObject("marcaLabel");
			const modeloLabel = await IDocument.GetObject("modeloLabel");

			const newData = JSON.parse(JSON.stringify(productList));
			for (const data of newData) {
				// Skip iteration if descripcion is empty or not a string
				if (!data.descripcion || data.descripcion.trim() === "")
					continue;
				//
				const description = data.descripcion.split(" ");
				let brand = data.brand;
				console.log("this is marca", brand);

				if (brand === "LOLITA DAVAL") {
					brand = "LOLITA"; // Change the brand value
				} else if (brand === "SAAVE CAMINAR") {
					brand = "SUAVE CAMINAR";
				}

				if (brand === "LOLITA CONFORT") {
					brand = "LOLITA";
				}

				const model = description[1];

				let color = description[2];
				color = color.length > 11 ? color.substring(0, 11) : color;
				const precio = (data.precio1 * 1.16).toFixed(0);

				precioLabel.Text = `$${precio}`;
				marcaLabel.Text = brand;
				modeloLabel.Text = `${model} ${color}`;

				IDocument.StartPrint("", 0);
				IDocument.PrintOut(1, 0);
				IDocument.EndPrint();
				console.log(`${brand} ${model} ${color} ${precio} - printed!`);
			}
		} catch (error) {
			console.log(error);
		}
		IDocument.Close();
	};

	return (
		<div className="container">
			<div className={style.formContainer}>
				<form onSubmit={getArticulo}>
					<input
						type="text"
						placeholder="buscar..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<button type="submit">buscar</button>
				</form>
			</div>
			<div className={style.tableContainerPrint}>
				<table>
					<thead>
						<tr>
							<th>clave</th>
							<th>descripcion</th>
							<th>existencia</th>
							<th>precio</th>
							<th>Borrar</th>
						</tr>
					</thead>
					<tbody>
						{productList.map((product, index) => (
							<tr key={index}>
								<td>{product.clave}</td>
								<td>{product.descripcion}</td>
								<td>{parseFloat(product.existencia)}</td>
								<td>${(product.precio1 * 1.16).toFixed(0)}</td>
								<td>
									<button onClick={() => removeItem(index)}>
										X
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={style.footerPrintLabels}>
				<button onClick={printLabelsData}>imprimir etiquetas</button>
				<button onClick={printDisplayLabel}>
					imprimir precio aparador
				</button>
			</div>
		</div>
	);
}

export default PrintLabels;
