import {createRoot} from "react-dom/client"
import {BrowserRouter} from "react-router"
import {Quiz} from "./quiz-0.1.jsx"
import "./index.css"

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Quiz/>
    </BrowserRouter>
)