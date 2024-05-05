import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import LineChart from './components/LineChart';
import Map from './components/Map'
import BarChart from './components/UnemploymentBarChart';
import styles from '../styles/styles.module.css';

const mapUrl = "https://gist.githubusercontent.com/ke1thw/00ffa23f0248f0814a3bd7de8af236ec/raw/afcc32d94a35e2864dc5a7999b6ec026fa2eca00/usa-map.json";
const opioidUrl = "https://gist.githubusercontent.com/ke1thw/66611f79a85552e39816ed4356f64e0a/raw/92819b8d627e95edd80bfb28eeead778e768fef8/Opioid_Overdose_Deaths.csv";
const unemploymentUrl = "https://gist.githubusercontent.com/ke1thw/3ad13e0b168f9dd72286f0fb792f16f9/raw/2b6232fb8e454fe9e943f406aea6d3f02edb00b4/Unemployment_in_America.csv"

const OpioidMapChart = () => {
    const [deathsData, setDeathsData] = useState([]);
    const [unemploymentData, setUnemploymentData] = useState([]);
    const [monthData, setmonthData] = useState([]);
    const [selectedState, setSelectedState] = useState(null);

    
    useEffect(() => {
        const fetchData = async () => {
            const loadedData = await d3.csv(opioidUrl, d => ({
                state: d.State,
                year: +d.Year,
                deaths: +d.Deaths,
                population: +d.Population,
                cruderate: +d['Crude Rate'],
                prescriptions: +d["Prescriptions Dispensed by US Retailers in that year (millions)"],
            }));

            const loadedDeathsData = loadedData.map(d => ({
                state: d.state,
                year: d.year,
                deaths: d.deaths,
                deathsrate: (d.deaths / d.population) * 100,
                cruderate: d.cruderate,
                prescriptions: d.prescriptions
            }));
            setDeathsData(loadedDeathsData);
        };

        const fetchUnemploymentData = async () => {
            const data = await d3.csv(unemploymentUrl, d => ({
                state: d['State/Area'],
                year: +d.Year,
                month: +d.Month,
                rate: +d['Percent (%) of Labor Force Unemployed in State/Area']
            }));
        
            const processUnemploymentData = (data) => {
                // Group data by state, then by year, and calculate the average unemployment rate for each state and year
                const unemploymentByStateYear = d3.groups(data, d => d.state, d => d.year)
                    .map(([state, years]) => {
                        const yearlyData = years.map(([year, entries]) => {
                            const averageRate = d3.mean(entries, entry => entry.rate);
                            return { year, rate: averageRate };
                        });
                        return { state, data: yearlyData };
                    });
        
                return unemploymentByStateYear;
            };
        
            const processedData = processUnemploymentData(data);
            setUnemploymentData(processedData);
            setmonthData(data);
        };
        
        
        fetchData();
        fetchUnemploymentData();
    }, []);
    

    return (
        <div className={styles.container}>
            <div className={styles.title}>Visualization of Opioid Overdose Death in the USA</div>
            <div className={styles.map}>
                <Map mapUrl={mapUrl} deathsData={deathsData} onStateHover={setSelectedState} />
            </div>
            <div className={styles.description}>
                <h2>How to Use This Dashboard</h2>
                <p>This dashboard provides interactive visualizations of opioid overdose deaths and unemployment rates across the USA. By default, charts show the general index of the United States. Select a state on the map to view detailed statistics in the charts on the right.</p>
                <ul>
                    <li><strong>Deaths:</strong> Number of opioid overdose deaths.</li>
                    <li><strong>Crude Rate:</strong> The crude death rate per 100,000 population.</li>
                    <li><strong>Prescriptions:</strong> Number of opioid prescriptions dispensed by US retailers (in millions).</li>
                    <li><strong>Unemployment Rate:</strong> The percentage of the labor force that is unemployed in the state.</li>
                </ul>
            </div>
            <div className={styles.chartContainer}>
                <LineChart deathsData={deathsData} selectedState={selectedState} />
                <BarChart data={unemploymentData} monthData={monthData} selectedState={selectedState} />
            </div>
        </div>

    );
    
};

export default OpioidMapChart;

