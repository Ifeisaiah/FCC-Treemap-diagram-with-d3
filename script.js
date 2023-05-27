let movieData;

let svg = d3.select('#chart');
let tooltip = d3.select('#tooltip');

let drawTreeMap = () => {
  let hierarchy = d3.hierarchy(movieData, (node) => {
    return node.children
  }).sum((node)=> {
    return node.value
  }).sort((node1, node2) => {
    return node2.value - node1.value
  })

  let createTreeMap = d3.treemap()
  .size([1000, 600 ])
  createTreeMap(hierarchy)

  let movieTiles = hierarchy.leaves();
  console.log(movieTiles)

  let block = svg.selectAll('g')
  .data(movieTiles)
  .enter()
  .append('g')
  .attr('transform', (movie) => {
    return `translate(${movie.x0}, ${movie.y0})`
  })

  block.append('rect')
    .attr('class', 'tile') 
    .attr('fill', (movie) => {
    let category = movie.data.category; 
    if (category == 'Action') {
      return '#161b33'
    } else if (category == 'Drama') {
      return '#474973'
    }
    else if (category == 'Adventure') {
      return '#edae49'
    }else if (category == 'Family') {
      return '#0d0c1d'
    }else if (category == 'Animation') {
      return '#16425b'
    }else if (category == 'Comedy') {
      return 'green'
    }else if (category == 'Biography') {
      return '#3a7ca5'
    } else {
      return '#967aa1'
    }
  })          
    .attr('data-name', (movie) => {
    return movie.data.name
  })
    .attr('data-category', (movie) => {
    return  movie.data.category
  })
    .attr('data-value', (movie) => {
    return  movie.data.value
  })
    .attr('width', (movie) => {
    return movie.x1- movie.x0
  })
    .attr('height', (movie) => {
    return movie.y1- movie.y0
  })
    .on('mouseover', (movie, index) => {
    let revenue = index['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    tooltip.style('visibility', 'visible')
      .html(`Movie: ${index.data.name} Revenue: $${revenue}`)
      .attr('data-value', index.data.value)
  })
    .on('mouseout', () => {
    tooltip.style('visibility', 'hidden')
  })

  block.append('text')
    .text((movie) => {
    return movie.data.name
  })
    .attr('x', 5)
    .attr('y', 20)
}
fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json')
  .then(res =>  res.json())
  .then(data => {
  movieData = data;
  drawTreeMap()
})
