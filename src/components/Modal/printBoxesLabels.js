import { IDocument } from "./bpac";

const printBoxesLabels = async (data) => {
	// gets labels from label

	const convertedData = JSON.parse(JSON.stringify(data));

	try {
		const label = await IDocument.Open(
			"C:/Users/jorge/Desktop/boxLabel.lbx"
		);

		console.log("label", label);

		if (label) {
			const code = await IDocument.GetObject("barCode");
			const brandLabel = await IDocument.GetObject("brand");
			const modelLabel = await IDocument.GetObject("model");
			const colorLabel = await IDocument.GetObject("color");
			const sizeLabel = await IDocument.GetObject("size");

			for (const data of convertedData) {
				code.Text = data.clave;

				const description = data.descripcion.split(" ");
				const brand = description[0];
				const model = description[1];
				let color = description[2];
				color = color.length > 11 ? color.substring(0, 11) : color;
				let size = description[description.length - 1];

				brandLabel.Text = brand;
				modelLabel.Text = model;
				colorLabel.Text = color;
				sizeLabel.Text = (size * 0.1).toFixed(1);

				const quantity = data.existencia;
				if (quantity === 0) {
					IDocument.EndPrint();
				} else {
					IDocument.StartPrint("", 0);
					IDocument.PrintOut(quantity, 0);
					IDocument.EndPrint();
					console.log("end of printing");
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
};

export default printBoxesLabels;
