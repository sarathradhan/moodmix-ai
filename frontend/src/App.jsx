/**
 * Root component — composes the three top-level layers of the UI:
 * 1. AppProvider (global auth + mood/analysis state)
 * 2. MainLayout (header, main content area, footer)
 * 3. AppRoutes (which page to render based on URL)
 */
import AppRoutes from './routes/AppRoutes.jsx';
import { AppProvider } from './context/AppContext.jsx';
import MainLayout from './components/layout/MainLayout.jsx';

function App() {
  return (
    <AppProvider>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </AppProvider>
  );
}

export default App;
