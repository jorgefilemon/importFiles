import style from "./table.module.css";
import { useEffect, useState } from "react";

function Table({ productsArray, handleInputChange }) {
	const [activeInputIndex, setActiveInputIndex] = useState(-1);

	//use keyboard arrow keys
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
					`.${style.tableContainer} input[type="text"]`
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
							`.${style.tableContainer} tbody tr`
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
	// generates header and inputs
	const generateHeaderAndInputs = () => {
		const headerValues = [...Array(17)].map((_, i) => 20 + i * 5);

		const headerCells = headerValues.map((value, index) => (
			<th key={index}>{value}</th>
		));

		const renderProductInputs = (product, index) => {
			const generateInput = (size) => (
				<td key={size}>
					<input
						type="text"
						onFocus={(e) => e.target.select()}
						defaultValue={
							product.hasOwnProperty(size.toString())
								? product[size] !== 0
									? product[size]
									: null
								: null
						}
						onChange={(e) => {
							handleInputChange(e, index, size.toString());
							updateSumSizes(index, productsArray[index]);
						}}
					/>
				</td>
			);

			const inputCells = headerValues.map((value) => {
				const size = value;
				return generateInput(size);
			});

			return inputCells;
		};

		return { headerCells, renderProductInputs };
	};

	// Create a state variable to store sums for each row
	const [rowSums, setRowSums] = useState([]);

	const calculateSumSizes = (product) => {
		let sum = 0;
		for (let key in product) {
			const size = parseFloat(key);
			if (!isNaN(size) && size >= 20 && size <= 100) {
				sum += parseFloat(product[key]);
			}
		}
		return sum;
	};
	// Function to calculate the sum of sizes within the range [20, 100]
	const updateSumSizes = (index, product) => {
		const newRowSums = [...rowSums];
		newRowSums[index] = calculateSumSizes(product);
		setRowSums(newRowSums);
	};

	useEffect(() => {
		const newRowSums = productsArray.map((product) =>
			calculateSumSizes(product)
		);
		setRowSums(newRowSums);
	}, [productsArray]);

	const { headerCells, renderProductInputs } = generateHeaderAndInputs();

	return (
		<div className={style.tableContainer}>
			<table>
				<thead>
					<tr>
						<th>marca</th>
						<th>descripcion</th>
						<th>precio</th>
						<th>categoria</th>
						{headerCells}

						<th>total</th>
					</tr>
				</thead>
				<tbody>
					{productsArray.map((product, index) => (
						<tr key={index}>
							<td>{product.marca}</td>
							<td>{product.descripcion}</td>
							<td>${product.precio}</td>
							<td>{product.categoria}</td>
							{renderProductInputs(product, index)}
							<td>{rowSums[index]}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
