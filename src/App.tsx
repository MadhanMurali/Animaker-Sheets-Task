import "./App.css";
import { Table } from "./components/table";

function App() {
    return (
        <div className="App">
            <p>1. Double click on the cell to type.</p>
            <p>2. Drag to select and use Ctrl + C to copy.</p>
            <p>3. Select a cell and use Ctrl + V to paste.</p>
            <Table />
        </div>
    );
}

export default App;
