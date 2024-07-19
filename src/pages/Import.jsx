import "../App.css";
import Header from "../components/Header/Header";
import Table from "../components/Table/Table";
import Footer from "../components/Footer/Footer";
import Modal from "../components/Modal/Modal";
import { useState } from "react";

const Import = () => {
	const [productsArray, setProductsArray] = useState([]);
	const [originalArray, setOriginalArray] = useState([]);
	console.log("productsArray Import.jsx", productsArray);
	// modal
	const [modal, setModal] = useState({ visible: false, message: "" });

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
			<Header
				setProductsArray={setProductsArray}
				setOriginalArray={setOriginalArray}
			/>

			<Table
				productsArray={productsArray}
				handleInputChange={handleInputChange}
			/>

			<Footer
				setModal={setModal}
				originalArray={originalArray}
				productsArray={productsArray}
			/>
			{modal.visible && (
				<Modal
					visible={modal.visible}
					message={modal.message}
					setModal={setModal}
					productsArray={productsArray}
				/>
			)}
		</div>
	);
};

export default Import;
