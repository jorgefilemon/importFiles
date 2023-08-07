function Table({ productsArray, handleInputChange }) {
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
						onChange={(e) =>
							handleInputChange(e, index, size.toString())
						}
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

	const { headerCells, renderProductInputs } = generateHeaderAndInputs();

	return (
		<div className="tableContainer">
			<table>
				<thead>
					<tr>
						<th>descripcion</th>
						<th>precio</th>
						{headerCells}
					</tr>
				</thead>
				<tbody>
					{productsArray.map((product, index) => (
						<tr key={index}>
							<td>{product.descripcion}</td>
							<td>${product.precio}</td>
							{renderProductInputs(product, index)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default Table;
