import { useRef, useState } from "react";
import style from "./header.module.css";
import * as XLSX from "xlsx";
import axios from "axios";
import filterExcel from "./filterExcel";
import compareArrays from "./compareArrays";
import sumArrivalsAndExistingInventory from "./sumProduct";
// header for working on
function Header({ setProductsArray, setSearchProducts }) {
	//

	const fileInputRef = useRef(null);
	// get productSizes = this is for getting the stock of the about to get imported product.
	const getProduct = async (e) => {
		const file = e.target.files[0];
		const data = await file.arrayBuffer(); // what is this for?
		const workbook = XLSX.read(data);
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);

		// removes the columns that dont have any name
		const filteredData = jsonData.map((row) => {
			const filteredRow = {};
			Object.keys(row).forEach((key) => {
				if (!key.startsWith("__EMPTY_")) {
					filteredRow[key] = row[key];
				}
			});
			return filteredRow;
		});

		const filteredArray = filteredData.filter((obj) => {
			// Check if any property of the object is non-empty
			return Object.values(obj).some(
				(value) => value !== undefined && value !== ""
			);
		});

		// FIND IF PRODUCT EXISTS
		try {
			const response = await axios.post(
				"http://localhost:3001/productSizes",
				filteredArray
			);

			const data = response.data;
			console.log(data, "this is the data from getProduct");

			if (response) {
				const products = {};

				data.forEach((item) => {
					const parts = item.descripcion.split(" "); // Adjusted to match the response data field
					let clave = item.clave.split(""); // Adjusted to match the response data field
					clave = clave.slice(0, -2).join("");

					console.log(clave);

					const description = parts.slice(0, -1).join(" ");
					console.log(description);
					const size = parts[parts.length - 1];
					console.log(size);

					if (!products[description]) {
						products[description] = {
							marca: parts[0],
							descripcion: description,
							precio: (item.precio1 * 1.16).toFixed(2), // Adjusted to match the response data field
							clave: clave,
						};
					}

					products[description][size] = Math.round(item.existencia); // Adjusted to match the response data field
				});

				setProductsArray(Object.values(products));
			}

			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error) {
			console.error("Error sending data to the backend:", error);
		}
	};
	// loads excel spreadsheet and import it to backend.

	const handleFile = async (e) => {
		const file = e.target.files[0];
		const data = await file.arrayBuffer(); // what is this for?
		const workbook = XLSX.read(data);
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);

		const filteredData = jsonData.map((row) => {
			const filteredRow = {};
			Object.keys(row).forEach((key) => {
				if (!key.startsWith("__EMPTY_")) {
					filteredRow[key] = row[key];
				}
			});
			return filteredRow;
		});

		const filteredArray = filteredData.filter((obj) => {
			// Check if any property of the object is non-empty
			return Object.values(obj).some(
				(value) => value !== undefined && value !== ""
			);
		});
		console.log("filteredArray", filteredArray);

		const filtered = filterExcel(filteredArray);

		// get searched product
		let serverData = [];
		try {
			const response = await axios.post(
				"http://localhost:3001/productSizes",
				filteredArray
			);

			const data = response.data;
			console.log(data, "this is the data from getProduct");

			if (response) {
				const products = {};

				data.forEach((item) => {
					const parts = item.descripcion.split(" "); // Adjusted to match the response data field
					let clave = item.clave.split(""); // Adjusted to match the response data field
					clave = clave.slice(0, -2).join("");

					const description = parts.slice(0, -1).join(" "); // removes description size.
					console.log(description);
					const size = parts[parts.length - 1];

					if (!products[description]) {
						products[description] = {
							marca: parts[0],
							descripcion: description,
							precio: (item.precio1 * 1.16).toFixed(2), // Adjusted to match the response data field
							clave: clave,
						};
					}

					products[description][size] = Math.round(item.existencia); // Adjusted to match the response data field
				});

				serverData = Object.values(products);
			}

			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error) {
			console.error("Error sending data to the backend:", error);
		}

		const arrivados = filtered.map((item) => ({
			location: "arrivados",
			...item,
		}));

		const bodega = serverData.map((item) => ({
			location: "bodega",
			...item,
		}));

		const combined = [...arrivados, ...bodega].sort((a, b) => {
			if (a.descripcion < b.descripcion) return -1;
			if (a.descripcion > b.descripcion) return 1;
			return a.location < b.location ? -1 : 1;
		});

		setProductsArray(combined);

		// here starts import process
		const sumProducts = sumArrivalsAndExistingInventory(combined);

		const arrayToImport = compareArrays(filteredArray, sumProducts);

		// here it's when it imports it.
		// try {
		// 	const response = await axios.post(
		// 		"http://localhost:3001/import",
		// 		arrayToImport
		// 	);
		// 	console.log(response.data); // Assuming the backend responds with some data
		// 	//  setResponseData(response.data);
		// 	if (fileInputRef.current) {
		// 		fileInputRef.current.value = "";
		// 	}

		// } catch (error) {
		// 	console.error("Error sending data to the backend:", error);
		// }
	};

	return (
		<nav className={style.navbar}>
			<label className={style.customFileUpload}>
				Select file
				<input
					type="file"
					ref={fileInputRef}
					onChange={(e) => handleFile(e)}
				/>
			</label>
		</nav>
	);
}

export default Header;
