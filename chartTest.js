const testCTRData = [
    { time: '2020-10-08 12:00', value: 86930194 },
    { time: '2020-10-08 11:00', value: 36826423 },
    { time: '2020-10-08 10:00', value: 84677299 },
    { time: '2020-10-08 09:00', value: 59587960 },
  
    { time: '2020-10-08 08:00', value: 20682192 },
    { time: '2020-10-08 07:00', value: 68986806 },
    { time: '2020-10-08 06:00', value: 19349722 },
    { time: '2020-10-08 05:00', value: 64320841 },
  
    { time: '2020-10-08 04:00', value: 64926524 },
    { time: '2020-10-08 03:00', value: 55552480 },
    { time: '2020-10-08 02:00', value: 79526370 },
    { time: '2020-10-08 01:00', value: 62585429 },
  
    { time: '2020-10-08 00:00', value: 73141705 },
    { time: '2020-10-07 23:00', value: 40343376 },
    { time: '2020-10-07 22:00', value: 54294158 },
    { time: '2020-10-07 21:00', value: 62905207 },
  
    { time: '2020-10-07 20:00', value: 76269059 },
    { time: '2020-10-07 19:00', value: 52357412 },
    { time: '2020-10-07 18:00', value: 40902891 },
    { time: '2020-10-07 17:00', value: 50151824 },
  
    { time: '2020-10-07 16:00', value: 63713117 },
    { time: '2020-10-07 15:00', value: 77130942 },
    { time: '2020-10-07 14:00', value: 63791200 },
    { time: '2020-10-07 13:00', value: 70542491 },
  ].reverse();
  
  const width = 900;
  const height = 900;
  const innerRadius = 250;
  const outerRadius = width * 0.6;
  
  const arc = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius((d) => y(d.value))
    .startAngle((d) => x(d.time.split(' ')[1]))
    .endAngle((d) => x(d.time.split(' ')[1]) + x.bandwidth())
    .padAngle(0.1)
    .padRadius(innerRadius);
  
  const x = d3
    .scaleBand()
    .domain(testCTRData.map((d) => d.time.split(' ')[1]))
    .range([0, 2 * Math.PI])
    .align(0);
  
  const maxYDomainValue = d3.max(testCTRData, (d) => d.value);
  
  const y = d3
    .scaleRadial()
    .domain([0, maxYDomainValue + maxYDomainValue * 0.2])
    .range([innerRadius, outerRadius]);
  
  const xAxis = (g) =>
    g.attr('text-anchor', 'middle').call((g) =>
      g
        .selectAll('g')
        .data(testCTRData)
        .enter()
        .append('g')
        .attr(
          'transform',
          (d) => `
              rotate(${
                ((x(d.time.split(' ')[1]) + x.bandwidth() / 2) * 180) / Math.PI -
                90
              })
              translate(${innerRadius - 28},0)
            `
        )
        .call((g) =>
          g
            .append('text')
            .attr('class', 'hour')
            .attr('fill', '#ffffff')
            .attr('transform', (d) => {
              const rotateAngle =
                ((x(d.time.split(' ')[1]) + x.bandwidth() / 2) * 180) / Math.PI;
  
              return (x(d.time.split(' ')[1]) + x.bandwidth() / 2 + Math.PI / 2) %
                (2 * Math.PI) <
                Math.PI
                ? `rotate(${90 - rotateAngle}) translate(0, 6)`
                : `rotate(${90 - rotateAngle}) translate(0, 6)`;
            })
            .text((d) => `${d.time.split(' ')[1].slice(0, 2)}H`)
        )
    );
  
  const yAxis = (g) =>
    g
      .attr('text-anchor', 'middle')
      .call((g) =>
        g
          .append('text')
          .attr('x', 0)
          .attr('y', -y(y.ticks().pop()))
          .attr('dy', '-2em')
          .attr('fill', '#ffffff')
          .text('POOL HASH RATE')
      )
      .call((g) =>
        g
          .append('circle')
          .attr('stroke', '#424259')
          .attr('r', innerRadius)
          .attr('fill-opacity', '0%')
      )
      .call((g) =>
        g
          .selectAll('g')
          .data(y.ticks(5).slice(1))
          .join('g')
          .attr('fill', 'none')
          .call((g) => g.append('circle').attr('stroke', '#424259').attr('r', y))
      );
  
  const tooltip = d3
    .select('.chart')
    .append('div')
    .style('position', 'absolute')
    .style('display', 'none')
    .style('color', '#ffffff')
    .style('font-family', 'verdana')
    .style('font-size', '12px')
    .style('background-color', '#424259')
    .style('border', '2px solid balck')
    .style('border-radius', '5px')
    .style('padding', '10px')
    .style('opacity', '0');
  
  const onMouseover = (event, datum) => {
    console.log(event);
    tooltip
      .style('display', 'block')
      .html(
        `Time: ${datum.time}<br/>Hash rate: ${d3.format('0.4s')(datum.value)}`
      )
      .style('opacity', '0.8');
  };
  
  const onMousemove = (event, datum) => {
    const { pageX, pageY } = event;
    tooltip.style('left', `${x(datum.time.split(' ')[1]) < Math.PI ? pageX - 200 : pageX}px`);
    tooltip.style('top', `${pageY - 60}px`);
  };
  
  const onMouseout = (event, datum) => {
    tooltip.style('display', 'none');
  };
  
  const svg = d3
    .select('.chart svg')
    .attr(
      'viewBox',
      `${-width / 2 - 150} ${-height / 2 - 150} ${width + 300} ${height + 300}`
    )
    .style('width', '100%')
    .style('height', 'auto')
    .style('font', '18px good-times');
  
  svg.append('g').call(xAxis);
  
  svg.append('g').call(yAxis);
  
  svg
    .append('g')
    .attr('fill', 'url(#arcGrad)')
    .selectAll('path')
    .data(testCTRData)
    .enter()
    .append('path')
    .attr('d', arc)
    .on('mouseover', onMouseover)
    .on('mousemove', onMousemove)
    .on('mouseout', onMouseout);
  
  svg.append('g').call((g) =>
    g
      .attr('text-anchor', 'middle')
      .selectAll('g')
      .data(y.ticks(5).slice(1))
      .join('g')
      .attr('fill', 'none')
      .call((g) => g.append('circle').attr('fill-opacity', '0%').attr('r', y))
      .call((g) =>
        g
          .append('text')
          .attr('x', 0)
          .attr('y', (d) => -y(d))
          .attr('dy', '0.35em')
          .attr('fill', '#ffffff')
          .text(y.tickFormat(10, 's'))
      )
  );
  
