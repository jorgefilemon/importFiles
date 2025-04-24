import { IDocument } from "./bpac";

const printDisplayLabel = async (newData) => {
	console.log("newData at printDisplayLabel", newData);

	try {
		// gets label file.
		const displayLabel = await IDocument.Open(
			"C:/Users/jorge/Desktop/displayLabel.lbx"
		);

		if (displayLabel) {
			// get label labels name.
			const precioLabel = await IDocument.GetObject("precioLabel");
			const marcaLabel = await IDocument.GetObject("marcaLabel");
			const modeloLabel = await IDocument.GetObject("modeloLabel");

			const filteredData = newData
				.filter((item) => item.location !== "nuevo")
				.filter((item) => item.location !== "bodega")
				.map(({ descripcion, precio }) => ({ descripcion, precio }));
			console.log("filteredData at printDisplayLabel.js", filteredData);
			for (const data of filteredData) {
				const description = data.descripcion.split(" ");
				let brand = description[0].toUpperCase();
				console.log("this is marca", brand);
				if (brand === "LOLITADAVAL") {
					// it was "LOLITA DAVAL" before.
					brand = "LOLITA"; // Change the brand value
				}

				const model = description[1];

				let color = description[2];
				color = color.length > 11 ? color.substring(0, 11) : color;
				const precio = data.precio;
				const formattedPrice = parseInt(precio);

				precioLabel.Text = `$${formattedPrice}`;
				marcaLabel.Text = brand;
				modeloLabel.Text = `${model} ${color}`;

				IDocument.StartPrint("", 0);
				IDocument.PrintOut(1, 0);
				IDocument.EndPrint();
				console.log("end of display label printing");
			}
		}
	} catch (error) {
		console.log(error);
	}
	IDocument.Close();
};

export default printDisplayLabel;
