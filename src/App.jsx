import "./App.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Pages
import PrintLabelsPage from "./pages/PrintLabelsPage";
import Import from "./pages/Import";
import Home from "./pages/Home";
import Root from "./pages/Root";
import PrintDisplayLabelsPage from "./pages/PrintDisplayLabelsPage";
import StockPage from "./pages/Stock";
// react router
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";

// const queryClient = new QueryClient();

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Root />}>
				<Route index element={<Home />} />
				<Route path="/PrintLabelsPage" element={<PrintLabelsPage />} />
				<Route path="/Import" element={<Import />} />
				<Route
					path="/PrintDisplayLabelsPage"
					element={<PrintDisplayLabelsPage />}
				/>
				<Route path="/stock" element={<StockPage />} />
			</Route>
		)
	);
	return (
		<div>
			{/* <QueryClientProvider client={queryClient} */}
			<RouterProvider router={router} />
			{/* </QueryClientProvider> */}
		</div>
	);
}

export default App;
