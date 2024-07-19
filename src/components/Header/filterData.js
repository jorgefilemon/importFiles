const filterData = (data) => {
	let serverData = [];
	const products = {};

	data.forEach((item) => {
		const parts = item.descripcion.split(" "); // Adjusted to match the response data field
		let clave = item.clave.split(""); // Adjusted to match the response data field
		clave = clave.slice(0, -2).join("");

		const description = parts.slice(0, -1).join(" "); // removes description size.

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

	return serverData;
};

export default filterData;
