export function buildIndex(geometry) {
  var indexBuffer = [];
  const indexCalc = (i, j) => j + (geometry.cols + 1) * i;
  for (let i = 0; i < geometry.rows; i++) {
    for (let j = 0; j <= geometry.cols; j++) {
      indexBuffer.push(indexCalc(i, j), indexCalc(i + 1, j));
    }
  }
  geometry.index = indexBuffer;
}
export function buildBuffers(geometry) {
  var rows = geometry.rows;
  var cols = geometry.cols;
  for (var i = 0; i <= rows; i++) {
    for (var j = 0; j <= cols; j++) {
      var alfa = i / rows;
      var beta = j / cols;
      var {p, n} = geometry.getPointData(alfa, beta);
      geometry.position.push(...p);
      geometry.normal.push(...n);
    }
  }
}
