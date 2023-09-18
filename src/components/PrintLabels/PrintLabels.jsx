import { useState } from "react";
import axios from "axios";
import "../../App.css";
import style from "./printLabels.module.css";

import { IDocument } from "../../components/Footer/bpac";

function PrintLabels() {
	//
	const [input, setInput] = useState("");

	const [productList, addProduct] = useState([]);
	// gets product from the api call
	const getArticulo = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.get(
				`http://localhost:3001/product/${input}`
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
		try {
			const label = await IDocument.Open(
				"C:/Users/jorge/Desktop/boxLabel.lbx"
			);

			console.log(label);

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
					sizeLabel.Text = (size * 0.1).toFixed(1);

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

	const clearRow = () => {};

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
							<th>Borrar</th>
						</tr>
					</thead>
					<tbody>
						{productList.map((product, index) => (
							<tr key={index}>
								<td>{product.clave}</td>
								<td>{product.descripcion}</td>
								<td>{parseFloat(product.existencia)}</td>
								<td>
									<button onClick={clearRow}>X</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={style.footerContainer}>
				<button onClick={printLabelsData}>print Labels</button>
			</div>
		</div>
	);
}

export default PrintLabels;
