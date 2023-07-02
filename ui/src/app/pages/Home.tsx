'use client'
import { useState, useEffect } from 'react';

const Home = () => {
  const [data, setData] = useState<null | string>(null);

  useEffect(() => {
    // Fetch data from Flask API when component mounts
    fetch('http://localhost:5000')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => setData(data))
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }, []);

  return (
    <div>
      <h1>Hello from Next.js!</h1>
      {data && <p>Data from Flask API: {data}</p>}
    </div>
  );
}

export default Home;
