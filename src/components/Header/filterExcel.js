const filterExcel = (data) => {
	let newArray = [];

	const products = {};

	data.forEach((item) => {
		//
		const parts = item.DESCRIPCION.split(" ");
		// let clave = item.CLAVE.split("");
		// clave = clave.slice(0, -2).join("");
		const description = parts.slice(0, -1).join(" ");

		const size = parts[parts.length - 1];

		if (!products[description]) {
			products[description] = {
				descripcion: description,
				precio: item["PRECIO 1"].toFixed(2),
				// clave: clave,
				// marca: item["DEPARTAMENTO"],
				categoria: item["CATEGORIA"],
			};
		}

		products[description][size] = item["EXIST."];
	});

	newArray = Object.values(products);

	return newArray;
};

export default filterExcel;
