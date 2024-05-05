import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, monthData, selectedState }) => {
    const chartRef = useRef();
    const subgraphRef = useRef();

    useEffect(() => {
        if (data) {
            updateBarChart(selectedState);
        }
    }, [data, monthData, selectedState]);

    // console.log(monthData);

    const updateBarChart = (stateName) => {
        // Find the data for the selected state or default to showing all states
        let stateData = data.find(d => d.state === stateName);
        let yearlyData = stateData ? stateData.data : data.flatMap(d => d.data);

        // Sort data by year for consistent axis ordering
        yearlyData = yearlyData.sort((a, b) => a.year - b.year);

        d3.select(chartRef.current).selectAll("svg").remove();
        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', 600)
            .attr('height', 400);

        const xScale = d3.scaleBand()
            .domain(yearlyData.map(d => d.year))
            .range([60, 540])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(yearlyData, d => d.rate)])
            .range([350, 50]);

        svg.append("g").attr("transform", `translate(60,0)`);
        
        svg.append("g")
            .attr("transform", `translate(0,350)`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg.append("g")
            .attr("transform", "translate(60,0)")
            .call(d3.axisLeft(yScale));

        // console.log(yearlyData);

        svg.selectAll(".bar")
            .data(yearlyData)
            .enter()
            .append("rect")
            .attr("class", d => `bar year-${d.year}`)
            .attr("x", d => xScale(d.year))
            .attr("width", xScale.bandwidth())
            .attr("y", d => yScale(d.rate))
            .attr("height", d => 350 - yScale(d.rate))
            .attr("fill", "steelblue")
            .on("mouseover", function (event, d) {
                d3.select(`.year-${d.year}`)
                    .attr('fill', 'red')            
                    .attr('stroke-width', 2);      
            })
            .on("mouseout", function (event, d) {
                d3.select(`.year-${d.year}`)
                    .attr('fill', 'steelblue')    
                    .attr('stroke', 'none');       
            });

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 15)
            .attr("x", -200)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Rate of Unemployment (%)");
        // Add the X title
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
            <div ref={chartRef}></div>
        
    );
};

export default BarChart;
