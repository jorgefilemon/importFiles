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
		console.log("filteredArray", filteredArray);
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

		const arrivados = filtered.map((item) => ({
			location: "arrivados",
			...item,
		}));

		const bodega = serverData.map((item) => ({
			location: "bodega",
			...item,
		}));

		const combined = arrivados.flatMap((arrivado) => {
			const matchIndex = bodega.findIndex(
				(b) => b.descripcion === arrivado.descripcion
			);

			if (matchIndex !== -1) {
				const match = bodega[matchIndex];
				bodega.splice(matchIndex, 1); // avoid duplication
				return [arrivado, match]; // arrivado + matching bodega
			}

			// No match: insert "new" version
			const newItem = {
				location: "nuevo",
			};

			return [arrivado, newItem]; // arrivado + "new"
		});

		// Add remaining unmatched bodega items at the end
		const finalArray = [...combined, ...bodega];

		// Now update the state
		setProductsArray(finalArray);
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
