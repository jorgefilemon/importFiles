import axios from "axios";
import sumArrivalsAndExistingInventory from "../Header/sumArrivalsAndExistingInventory";
import compareArrays from "../Header/compareArrays";
import style from "./footer.module.css";

function Footer({ productsArray, originalArray, setModal }) {
	// prints in brother printer shoe labels.
	// checks printer connection.

	const importArray = async (data, original) => {
		// check data length
		if (data.length === 0) {
			setModal({ visible: true, message: "Nada que importar!" });
			return; // exit the function
		} else {
			setModal({ visible: true, message: "Importing" });
		}

		data = data.filter(product => product.location !== "nuevo");
		// sums products in table if they are the same models in the rows.
		const sumProducts = sumArrivalsAndExistingInventory(data);

		// updates products arrays with quantities
		const arrayToImport = compareArrays(original, sumProducts);

		// call to the backend
		try {
			const response = await axios.post(
				"http://localhost:3001/import",
				arrayToImport
			);
			// console.log("info from backend", response.data.message);
			if (response.data.message == "success") {
				// console.log(response.data.data);
				setModal({ visible: true, message: "success" });
			}
		} catch (error) {
			// console.error("Error sending data to the backend:", error);
		}
	};

	return (
		<footer className={style.footerContainer}>
			{/* <button onClick={printLabels}>imprimir</button> */}
			<button onClick={() => importArray(productsArray, originalArray)}>
				importar articulos
			</button>
		</footer>
	);
}

export default Footer;
