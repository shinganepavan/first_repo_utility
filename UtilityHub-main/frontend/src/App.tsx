import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Home } from './pages/Home';
import { Utilities } from './pages/Utilities';
import { Categories } from './pages/Categories';
import { CategoryPage } from './pages/CategoryPage';
import { ToolRunner } from './pages/ToolRunner';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/utilities" element={<Utilities />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:categoryId" element={<CategoryPage />} />
                <Route path="/tools/:toolId" element={<ToolRunner />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Fallback route */}
                <Route path="*" element={
                  <div className="py-20 text-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Page Not Found</h2>
                    <a href="/" className="text-indigo-500 hover:underline">Return to Home</a>
                  </div>
                } />
              </Routes>
            </Layout>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
