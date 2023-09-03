import "./App.css";
// Pages
import PrintLabels from "./pages/PrintLabels";
import Import from "./pages/Import";
import Home from "./pages/Home";
import Root from "./pages/Root";
// react router
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Root />}>
				<Route index element={<Home />} />
				<Route path="/PrintLabels" element={<PrintLabels />} />
				<Route path="/Import" element={<Import />} />
			</Route>
		)
	);
	return (
		<div>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
