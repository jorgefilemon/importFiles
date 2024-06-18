// const compareArrays = (original, transformed) => {
// 	transformed.forEach((itemCompared) => {
// 		original.forEach((originalItem) => {
// 			if (itemCompared["descripcion"] == item["DESCRIPCION"]) {
// 				({ ...originalItem, EXIST: itemCompared.exi });
// 			}
// 		});
// 	});

// 	return original;
// };

// export default compareArrays;

const compareArrays = (original, transformed) => {
	transformed.forEach((itemCompared) => {
		for (const originalItem of original) {
			if (itemCompared["descripcion"] === originalItem["DESCRIPCION"]) {
				originalItem["EXIST."] = itemCompared.exi;
				break; // Break the loop once a match is found
			}
		}
	});

	return original;
};

export default compareArrays;
