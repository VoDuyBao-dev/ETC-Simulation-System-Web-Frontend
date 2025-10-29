import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routers/AppRouter'
import GlobalStyles from './assets/css/globalStyles';
function App() {
  return (
    <GlobalStyles>
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
    </GlobalStyles>
    
  )
}

export default App;