import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Success from './pages/Success';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/book" 
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                } 
              />
              <Route path="/success" element={<Success />} />
              <Route path="/feedback/:ticketId" element={<Feedback />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}

export default App;
