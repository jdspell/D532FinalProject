'use client'
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';

type SearchProps = {
    setData: (data: any) => void;
};

const Search: React.FC<SearchProps> = ({ setData }) => {
    const searchOptions = [
        { label: 'Series', value: 'series' },
        { label: 'Actor', value: 'actor' },
        { label: 'Director', value: 'director' },
        { label: 'Release Year', value: 'releaseYear' },
        { label: 'Certificate', value: 'certificate' },
        { label: 'Series Type', value: 'seriesType' },
        { label: 'Genre', value: 'genre' },
        { label: 'Rating', value: 'rating' }
    ];

    const [searchType, setSearchType] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const onSearchInputChange = (e: any) => {
        const input = e.target.value;
        // Checking for potential SQL injection attacks
        if (!input.match(/['"%;()]/)) { // You might need to adjust this regex according to your needs
            setSearchTerm(input);
        }
    };

    const executeSearch = () => {
        setCurrentPage(1);  // reset page count
        fetchData();
    }

    const reset = () => {
        setSearchType(null);
        setSearchTerm('');
        setCurrentPage(1);
    }

    const fetchData = async () => {
        try {
            let url;
            if(searchTerm) {
                url = `https://d532-web-service.onrender.com/search?type=${searchType}&term=${searchTerm}&page=${currentPage}&limit=30`;
            } else {
                url = `https://d532-web-service.onrender.com/series?page=${currentPage}&limit=30`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setData(data);  // pass data to the parent component
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [searchType, searchTerm, currentPage]);

    return (
        <div className="p-d-flex p-ai-center p-jc-between">
            <div className="p-d-flex p-ai-center">
                <Dropdown value={searchType} options={searchOptions} onChange={(e) => setSearchType(e.value)} placeholder="Select a search type"/>
                <InputText value={searchTerm} onChange={onSearchInputChange} placeholder="Search term"/>
                <Button label="Search" onClick={executeSearch} />
                <Button label="Reset" onClick={reset} />
            </div>
            <div className="p-d-flex p-ai-center">
                <Button icon="pi pi-chevron-left" className="p-button-rounded p-button-success" onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}/>
                <div className="p-ml-2 p-mr-2">{currentPage}</div>
                <Button icon="pi pi-chevron-right" className="p-button-rounded p-button-success" onClick={() => setCurrentPage(prevPage => prevPage + 1)}/>
            </div>
        </div>
    );
}

export default Search;
