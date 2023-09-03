import { IDocument } from "./bpac";
import style from "./footer.module.css";

function Footer({ productsArray }) {
	const printLabelsData = async (convertedData) => {
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
	};

	const printLabels = async () => {
		try {
			const newData = JSON.parse(JSON.stringify(productsArray)); // creates a deep copy of productsArray.

			const convertedData = [];

			newData.forEach((item) => {
				const descripcion = item.descripcion;

				delete item.descripcion;
				delete item.clave;
				delete item.precio;

				Object.entries(item).forEach(([key, value]) => {
					if (value != 0) {
						const getClave = descripcion.split(" ");
						const brand = getClave[0].slice(0, 3);
						const model = getClave[1];
						const color = getClave[2].slice(0, 2);

						convertedData.push({
							descripcion: `${descripcion} ${key}`,
							existencia: value,
							clave: `${brand}${model}${color}${key}`,
						});
					}
				});
			});

			console.log("this is converted data", convertedData);
			const label = await IDocument.Open(
				"C:/Users/jorge/Desktop/boxLabel.lbx"
			);

			const displayLabel = await IDocument.Open(
				"C:/Users/jorge/Desktop/displayLabel.lbx"
			);

			console.log(label);

			if (label === true) {
				// Call the function to print the labels after setting the convertedData
				await printLabelsData(convertedData);
			} else {
				console.log("label not found");
			}
		} catch (error) {
			console.log(error);
		}

		IDocument.Close();
	};

	return (
		<footer className={style.footerContainer}>
			<button onClick={printLabels}>imprimir</button>
		</footer>
	);
}

export default Footer;
