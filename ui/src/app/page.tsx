'use client'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import Search from './pages/Search';

const Home = dynamic(() => import('./pages/Home'), { ssr: false });

export default function App() {
  const [data, setData] = useState([]);

  return (
    <div>
      <Search setData={setData} />
      <Home data={data} />
    </div>
  )
}
