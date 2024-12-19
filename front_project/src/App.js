import './App.css';
import GlobalContext from './context/GlobalContext';
import Verify from './modules/Verify';

function App() {

  return (
    <GlobalContext>
      <Verify />
    </GlobalContext>
  );
}

export default App;
