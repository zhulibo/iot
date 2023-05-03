export const data = [
  { name: '设备1', value: 90, value2: 92 },
  { name: '设备2', value: 120, value2: 122 },
  { name: '设备3', value: 120, value2: 122 },
]

const geoCoordMap = {
  设备1: [111, 30],
  设备2: [109, 39],
  设备3: [121, 37],
}

export function convertData(data) {
  var res = [];
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value),
        value2: geoCoord.concat(data[i].value2)
      });
    }
  }
  return res;
}
