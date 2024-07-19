const sumArrivalsAndExistingInventory = (combined) => {
	const aggregatedResults = {};

	combined.forEach((item) => {
		const { descripcion, location, precio, clave, ...sizes } = item;

		// Make DESCRIPCION equal to descripcion
		const updatedItem = { ...item, DESCRIPCION: descripcion };

		// Delete the 'descripcion', 'location', and 'precio' properties
		delete updatedItem.descripcion;
		delete updatedItem.location;
		delete updatedItem.precio;
		delete updatedItem.clave;
		delete updatedItem.categoria;
		if (!aggregatedResults[descripcion]) {
			aggregatedResults[descripcion] = { ...updatedItem }; // Initialize with the updated item itself
		} else {
			for (const size in sizes) {
				if (sizes.hasOwnProperty(size) && !isNaN(sizes[size])) {
					aggregatedResults[descripcion][size] =
						(aggregatedResults[descripcion][size] || 0) +
						(sizes[size] || 0);
				}
			}
		}
	});

	const summed = Object.values(aggregatedResults);
	console.log(summed, `this is summed`);
	const result = summed.flatMap((item) =>
		Object.entries(item)
			.filter(([key]) => key !== "DESCRIPCION")
			.map(([key, exi]) => ({
				descripcion: `${item.DESCRIPCION} ${key}`,
				exi,
			}))
	);

	return result;
};

export default sumArrivalsAndExistingInventory;
