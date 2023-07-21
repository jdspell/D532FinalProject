'use client'
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from Flask API when component mounts
    fetch('https://d532-web-service.onrender.com/series')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      setData(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }, []);

  return (
    <DataTable value={data}>
      <Column field='series_id' header='Series ID'></Column>
      <Column field='series_name' header='Series Name'></Column>
      <Column field='release_year' header='Release Year'></Column>
      <Column field='rating' header='Rating'></Column>
      <Column field='certificate' header='Certificate'></Column>
      <Column field='vote_count' header='Vote Count'></Column>
      <Column field='series_type' header='Series Type'></Column>
      <Column field='genre_name' header='Genre'></Column>
      <Column field='director_name' header='Director'></Column>
      <Column field='actor_name' header='Actor'></Column>
    </DataTable>
  );
}

export default Home;
