
import './App.css'
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Books from './components/Books'
import { Routes, Route } from 'react-router-dom'
import BookDetails from './components/BookDetails'

function App() {

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 min-h-0 overflow-auto">
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/books" element={<Books/>}/>
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
export default App
