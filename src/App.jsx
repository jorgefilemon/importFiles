import * as XLSX from "xlsx"
import './App.css'
import axios from 'axios';
import {useRef, useState, useEffect} from 'react';
import {IDocument} from './bpac'


function App() {


  const fileInputRef = useRef(null);

  const [productsArray, setProductsArray] = useState([]);


  const [activeInputIndex, setActiveInputIndex] = useState(-1);

  useEffect(() => {
    const handleArrowNavigation = (event) => {
      const { key } = event;
      if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault(); // Prevent the default behavior for arrow keys

        const inputs = document.querySelectorAll('.tableContainer input[type="text"]');
        const inputsArray = Array.from(inputs);
        const activeElement = document.activeElement;

        if (activeElement && inputsArray.length > 0) {
          const activeIndex = inputsArray.indexOf(activeElement);
          let nextIndex = activeIndex;

          if (key === 'ArrowRight') {
            nextIndex = (activeIndex + 1) % inputsArray.length;
          } else if (key === 'ArrowLeft') {
            nextIndex = (activeIndex - 1 + inputsArray.length) % inputsArray.length;
          } else if (key === 'ArrowDown' || key === 'ArrowUp') {
            const rows = document.querySelectorAll('.tableContainer tbody tr');
            const activeRow = activeElement.closest('tr');
            const activeRowIndex = Array.from(rows).indexOf(activeRow);

            const numInputsPerRow = 15; // Assuming there are 15 inputs per row, adjust accordingly
            let nextRowInputIndex = (activeRowIndex + (key === 'ArrowDown' ? 1 : -1)) * numInputsPerRow + (activeIndex % numInputsPerRow);
            if (nextRowInputIndex < 0) nextRowInputIndex = 0;
            if (nextRowInputIndex >= inputsArray.length) nextRowInputIndex = inputsArray.length - 1;

            nextIndex = nextRowInputIndex;
          }

          inputsArray[nextIndex].focus();
          setActiveInputIndex(nextIndex);
        }
      }
    };

    document.addEventListener('keydown', handleArrowNavigation);

    return () => {
      document.removeEventListener('keydown', handleArrowNavigation);
    };
  }, []);

  console.log('productsArray', productsArray)
 
  const handleFile = async (e) =>{

      const file = e.target.files[0];
      const data = await file.arrayBuffer(); // what is this for?
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      

      const filteredData = jsonData.map((row) => {
        const filteredRow = {};
        Object.keys(row).forEach((key) => {
          if (!key.startsWith('__EMPTY_')) {
            filteredRow[key] = row[key];
          }
        });
        return filteredRow
      });
  
    

      const filteredArray = filteredData.filter(obj => {
        // Check if any property of the object is non-empty
        return Object.values(obj).some(value => value !== undefined && value !== '');
      });
      
   
    
        try {
          const response = await axios.post('http://localhost:3001/import', filteredArray);
          console.log(response.data); // Assuming the backend responds with some data
         //  setResponseData(response.data);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }

          const products = {};

          response.data.forEach((item)=>{

            const parts = item.DESCRIPCION.split(" ");
            let clave = item.CLAVE.split('');
            clave = clave.slice(0, -2).join('');
            console.log(clave);
            
            const description = parts.slice( 0, -1).join(" ");
            console.log(description)
            const size = parts[parts.length -1];
            console.log(size)
        
            if(!products[description]){
              products[description]= {
                descripcion: description,
                precio: item['PRECIO 1'],
                clave: clave,
             
              };
            }
        
            products[description][size] = item['EXIST.'];
          });
          setProductsArray(Object.values(products))
        } catch (error) {
          console.error('Error sending data to the backend:', error);
        }

        
  }
  // updates productsArray as values are changed in the inputs.
  const handleInputChange = (e,index, size) =>{
    const {value} = e.target;

    setProductsArray((prevState)=>{
      const updatedProductsArray = [ ...prevState];
      updatedProductsArray[index][size] =isNaN(parseInt(value)) ? 0 : parseInt(value);
      return updatedProductsArray;
    })
  };

  const printLabels = async () => {
    try {

      const newData = JSON.parse(JSON.stringify(productsArray)); // creates a deep copy of productsArray.

      const convertedData = [];

      newData.forEach((item)=>{
        const descripcion = item.descripcion;
  
        delete item.descripcion;
        delete item.clave;
        delete item.precio;
  
          Object.entries(item).forEach(([key,value])=>{

            if(value !=0) {
  
              const getClave = descripcion.split(' ');
              const brand = getClave[0].slice(0,3);
              const model = getClave[1];
              const color = getClave[2].slice(0,2);
  
              convertedData.push({
                descripcion: `${descripcion} ${key}`,
                existencia: value,
                clave: `${brand}${model}${color}${key}`
              })
            } 

          }
        )
      })
  
      console.log(convertedData);
      const label = await IDocument.Open("C:/Users/jorge/Desktop/boxLabel.lbx");

      if (label === true) {
        // Call the function to print the labels after setting the convertedData
        await printLabelsData(convertedData);
      } else {
        console.log('label not found');
      }
    } catch (error) {
      console.log(error);
    }
  
    IDocument.Close();
  };
  
  // Function to handle the label printing
  const printLabelsData = async (convertedData) => {

    const code = await IDocument.GetObject('barCode');
    const brandLabel = await IDocument.GetObject('brand');
    const modelLabel = await IDocument.GetObject('model');
    const colorLabel = await IDocument.GetObject('color');
    const sizeLabel = await IDocument.GetObject('size');

    for (const data of convertedData) {
      code.Text = data.clave;
  
      const description = data.descripcion.split(" ");
      const brand = description[0];
      const model = description[1];
      let color = description[2];
      color = color.length > 11 ? color.substring(0, 11) : color;
      const size = description[3];

      brandLabel.Text = brand;
      modelLabel.Text = model;
      colorLabel.Text = color;
      sizeLabel.Text = size;
  
      const quantity = data.existencia;
      if (quantity === 0) {
        IDocument.EndPrint();
      } else {
        IDocument.StartPrint("", 0);
        IDocument.PrintOut(quantity, 0);
        IDocument.EndPrint();
        console.log('end of printing');
      }
    }
  };

  return (
   
      <div className='container'>
        <nav className="navbar">
          <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e)} />
        </nav>
        <div className='tableContainer'>
        <table>
        <thead>
          <tr>
            <th>descripcion</th>
            <th>precio</th>
            {/* Generate input columns dynamically */}
            {[...Array(15)].map((_, i) => (
              <th key={i}>{20 + i * 5}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productsArray.map((product, index) => (
            <tr key={index}>
              <td>{product.descripcion}</td>
              <td>${product.precio}</td>
              {/* Generate inputs dynamically */}
              {[...Array(15)].map((_, i) => {
                const size = 20 + i * 5;
                return (
                  <td key={i}>
                    <input
                      type="text"
                      onFocus={(e)=> e.target.select()}
                      defaultValue={product.hasOwnProperty(size.toString()) ? product[size] : null}
                      onChange={(e) => handleInputChange(e, index, size.toString())}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
        </div>

        <footer>

          <button onClick={printLabels}>imprimir</button></footer>
      </div>
    );
    

}

export default App

