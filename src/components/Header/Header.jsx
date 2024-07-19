import { useRef, useState } from "react";
import style from "./header.module.css";
import * as XLSX from "xlsx";
import axios from "axios";
import filterExcel from "./filterExcel";
import filterData from "./filterData";
import compareArrays from "./compareArrays";
import sumArrivalsAndExistingInventory from "./sumArrivalsAndExistingInventory";
// header for working on
function Header({ setProductsArray, setOriginalArray }) {
	//

	const fileInputRef = useRef(null);

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
		// console.log("filteredArray", filteredArray);
		setOriginalArray(filteredArray);

		const filtered = filterExcel(filteredArray);

		// // get product in the inventory if exist with its qunatities
		let serverData = [];
		try {
			const response = await axios.post(
				"http://localhost:3001/productSizes",
				filteredArray
			);

			const data = response.data;
			// console.log("data", data);

			serverData = filterData(data);

			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error) {
			console.error("Error sending data to the backend:", error);
		}

		// console.log("filtered", filtered);
		const arrivados = filtered.map((item) => ({
			location: "arrivados",
			...item,
		}));

		// console.log("serverData", serverData);
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
		// console.log("setProductsArray in Header", combined);
		// // here starts import process
		// const sumProducts = sumArrivalsAndExistingInventory(combined);

		// const arrayToImport = compareArrays(filteredArray, sumProducts);
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
