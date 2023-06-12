import * as XLSX from "xlsx"
import './App.css'
import axios from 'axios';

function App() {

  const handleFile = async (e) =>{

    const file = e.target.files[0];
    const data = await file.arrayBuffer(); // what is this for?
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    try {
      const response = await axios.post('/api/endpoint', jsonData);
      console.log(response.data); // Assuming the backend responds with some data
    } catch (error) {
      console.error('Error sending data to the backend:', error);
    }
  }

  return (
   
      <div>
       <input type="file" onChange={(e)=>handleFile(e)} />
      </div>
  )
}

export default App
