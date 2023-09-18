import { useRef } from "react";
import style from "./header.module.css";
import * as XLSX from "xlsx";
import axios from "axios";

function Header({ setProductsArray }) {
	//
	const fileInputRef = useRef(null);
	// loads excel spreadsheet and import it to backend.
	const handleFile = async (e) => {
		const file = e.target.files[0];
		const data = await file.arrayBuffer(); // what is this for?
		const workbook = XLSX.read(data);
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];
		const jsonData = XLSX.utils.sheet_to_json(worksheet);
		// console.log("this is jsonData", jsonData);
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

		try {
			const response = await axios.post(
				"http://localhost:3001/import",
				filteredArray
			);
			// console.log(response.data); // Assuming the backend responds with some data
			//  setResponseData(response.data);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}

			if (response) {
				const products = {};

				filteredArray.forEach((item) => {
					const parts = item.DESCRIPCION.split(" ");
					let clave = item.CLAVE.split("");
					clave = clave.slice(0, -2).join("");

					console.log(clave);

					const description = parts.slice(0, -1).join(" ");
					console.log(description);
					const size = parts[parts.length - 1];
					console.log(size);

					if (!products[description]) {
						products[description] = {
							descripcion: description,
							precio: item["PRECIO 1"],
							clave: clave,
							marca: item["DEPARTAMENTO"],
							categoria: item["CATEGORIA"],
						};
					}

					products[description][size] = item["EXIST."];
				});
				setProductsArray(Object.values(products));
			}
		} catch (error) {
			console.error("Error sending data to the backend:", error);
		}
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
