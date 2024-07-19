import bpac from "./bpac";

const checkPrinter = () => {
	return new Promise((resolve) => {
		const objPrinter = new bpac.PrinterInfo();

		try {
			const printerName = objPrinter.GetPrinterName();
			console.log("Printer name:", printerName);

			if (printerName) {
				resolve(true);
			} else {
				resolve(false);
			}
		} catch (error) {
			console.error("Error checking printer status:", error);
			resolve(false);
		}
	});
};

export default checkPrinter;
