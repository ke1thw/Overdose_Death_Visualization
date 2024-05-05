import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart = ({ deathsData, selectedState }) => {
    const chartRef = useRef();
    const [selectedDot, setSelectedDot] = useState(null);
    const [chartType, setChartType] = useState('deathRate');

    useEffect(() => {
        updateLineChart(selectedState, chartType);
    }, [deathsData, selectedState, chartType]);

    const updateLineChart = (stateName, type) => {
        const filteredData = deathsData.filter(d => !stateName || d.state === stateName);
        const dataByYear = d3.rollup(filteredData, v => {
            switch (type) {
                case 'deathRate':
                    return d3.sum(v, d => d.deathsrate);
                case 'crudeRate':
                    return d3.mean(v, d => d.cruderate);
                case 'prescriptions':
                    return d3.sum(v, d => d.prescriptions);
                default:
                    return 0;
            }
        }, d => d.year);

        const dataMap = Object.fromEntries(dataByYear);
        
        d3.select(chartRef.current).selectAll("svg").remove();
        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', 600)
            .attr('height', 400);

        const xScale = d3.scaleLinear()
            .domain(d3.extent(Array.from(dataByYear.keys())))
            .range([60, 540]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataByYear.values())])
            .range([350, 50]);

        const lineGenerator = d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]));

        svg.selectAll(".dot")
            .data(Array.from(dataByYear))
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 5)
            .attr("fill", "steelblue")
            .on("mouseover", function (event, d) {
                d3.select(this).attr("r", 7)
                // .transition()
                .attr("fill", "red");
            })
            .on("mouseout", function (event, d) {
                d3.select(this).attr("r", 5)
                // .transition()
                .attr("fill", "steelblue");
            });

        svg.append("path")
            .datum(Array.from(dataByYear))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", lineGenerator);

        svg.append("g")
            .attr("transform", `translate(0,350)`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg.append("g")
            .attr("transform", "translate(60,0)")
            .call(d3.axisLeft(yScale));
        switch (type) {
            case 'deathRate':
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("text-anchor", "middle")
                    .attr("y", 5)
                    .attr("x", -200)
                    .attr("dy", "1em")
                    .text("Opioid Overdose Death Rate (%)");
                break;
            case 'crudeRate':
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 5)
                    .attr("x", -200)
                    .attr("dy", "1em")
                    .attr("text-anchor", "middle")
                    .text("Crude Rate (%)");
                break;
            case 'prescriptions':
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 5)
                    .attr("x", -200)
                    .attr("dy", "1em")
                    .attr("text-anchor", "middle")
                    .text("Prescriptions Dispensed by US Retailers (millions)");
                break;
        };
        if (stateName === null) {
            svg.append("text")             
                .attr("transform",
                    "translate(300, 390)")
                .style("text-anchor", "middle")
                .text("Year");
        } else {
            svg.append("text")             
                .attr("transform",
                    "translate(300, 390)")
                .style("text-anchor", "middle")
                .text("Year - " + stateName);
        };
    };

    return (
        <div>
            <select onChange={e => setChartType(e.target.value)} value={chartType}>
                <option value="deathRate">Opioid Overdose Death Rate</option>
                <option value="crudeRate">Crude Rate</option>
                <option value="prescriptions">Prescriptions Dispensed by US Retailers</option>
            </select>
            <div ref={chartRef}></div>
        </div>
    );
};

export default LineChart;
