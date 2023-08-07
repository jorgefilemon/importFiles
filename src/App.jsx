import "./App.css";
import Nav from "./components/Nav/Nav";
import Table from "./components/Table/Table";
import Footer from "./components/Footer/Footer";
import { useState, useEffect } from "react";


function App() {
	const [productsArray, setProductsArray] = useState([]);

	const [activeInputIndex, setActiveInputIndex] = useState(-1);

	useEffect(() => {
		const handleArrowNavigation = (event) => {
			const { key } = event;
			if (
				key === "ArrowRight" ||
				key === "ArrowLeft" ||
				key === "ArrowUp" ||
				key === "ArrowDown"
			) {
				event.preventDefault(); // Prevent the default behavior for arrow keys

				const inputs = document.querySelectorAll(
					'.tableContainer input[type="text"]'
				);
				const inputsArray = Array.from(inputs);
				const activeElement = document.activeElement;

				if (activeElement && inputsArray.length > 0) {
					const activeIndex = inputsArray.indexOf(activeElement);
					let nextIndex = activeIndex;

					if (key === "ArrowRight") {
						nextIndex = (activeIndex + 1) % inputsArray.length;
					} else if (key === "ArrowLeft") {
						nextIndex =
							(activeIndex - 1 + inputsArray.length) %
							inputsArray.length;
					} else if (key === "ArrowDown" || key === "ArrowUp") {
						const rows = document.querySelectorAll(
							".tableContainer tbody tr"
						);
						const activeRow = activeElement.closest("tr");
						const activeRowIndex =
							Array.from(rows).indexOf(activeRow);

						const numInputsPerRow = 17; // Assuming there are 17 inputs per row, adjust accordingly
						let nextRowInputIndex =
							(activeRowIndex + (key === "ArrowDown" ? 1 : -1)) *
								numInputsPerRow +
							(activeIndex % numInputsPerRow);

						if (nextRowInputIndex < 0) nextRowInputIndex = 0;
						if (nextRowInputIndex >= inputsArray.length)
							nextRowInputIndex = inputsArray.length - 1;

						// Check if there is a next row available
						const nextRowIndex =
							activeRowIndex + (key === "ArrowDown" ? 1 : -1);
						const nextRow = rows[nextRowIndex];
						if (nextRow) {
							nextIndex = nextRowInputIndex;
						}
					}

					inputsArray[nextIndex].focus();
					setActiveInputIndex(nextIndex);
				}
			}
		};

		document.addEventListener("keydown", handleArrowNavigation);

		return () => {
			document.removeEventListener("keydown", handleArrowNavigation);
		};
	}, []);

	console.log("productsArray", productsArray);

	// updates productsArray as values are changed in the input table.
	const handleInputChange = (e, index, size) => {
		const { value } = e.target;

		setProductsArray((prevState) => {
			const updatedProductsArray = [...prevState];
			updatedProductsArray[index][size] = isNaN(parseInt(value))
				? 0
				: parseInt(value);
			return updatedProductsArray;
		});
	};
	// converts the array of objects to its original form.

	// Function to handle the label printing

	return (
		<div className="container">
			<Nav setProductsArray={setProductsArray} />

			<Table
				productsArray={productsArray}
				handleInputChange={handleInputChange}
			/>

			<Footer productsArray={productsArray} />
		</div>
	);
}

export default App;
