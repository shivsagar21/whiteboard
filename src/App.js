import "./App.css";
import Board from "./components/board";
import Temp from "./Temp";
import Toolbar from "./components/Toolbar";
import BoardProvider from "./store/BoardProvider";
import ToolBox from "./components/ToolBox";
import ToolboxProvider from "./store/ToolboxProvider";

function App() {
  return (
    <>
      <ToolboxProvider>
        <BoardProvider>
          <Toolbar />
          <Board />
          <ToolBox />
        </BoardProvider>
      </ToolboxProvider>
    </>
  );
}

export default App;
