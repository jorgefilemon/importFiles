import "../App.css";
import Header from "../components/Header/Header";
import Table from "../components/Table/Table";
import Footer from "../components/Footer/Footer";
import { useState, useEffect } from "react";

const Home = () => {
	const [productsArray, setProductsArray] = useState([]);

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
		<div>
			<Header setProductsArray={setProductsArray} />

			<Table
				productsArray={productsArray}
				handleInputChange={handleInputChange}
			/>

			<Footer productsArray={productsArray} />
		</div>
	);
};

export default Home;
