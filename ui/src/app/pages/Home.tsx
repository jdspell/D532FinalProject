'use client'
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type HomeProps = {
  data: any[];
};

const Home: React.FC<HomeProps> = ({ data }) => {
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
