import {Route, Routes} from "react-router"
import {EditTestPage, MainPage, TestPage} from "./pages"

export const Quiz = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/quiz" element={<TestPage/>}/>
                <Route path="/quiz/edit" element={<EditTestPage/>}/>
            </Routes>
        </div>
    )
}