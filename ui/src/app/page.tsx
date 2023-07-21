import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import dynamic from 'next/dynamic';

const Home = dynamic(() => import('./pages/Home'), { ssr: false });

export default function App() {
  return (
    <Home />
  )
}
