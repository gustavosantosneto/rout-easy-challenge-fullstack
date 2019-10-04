let app = angular.module('roat_easy_app', [])

app.controller('delivery_controller', $scope => {
  $scope.firstName = 'John'
  $scope.lastName = 'Doe'
  let map = L.map('map', {
    center: [-23.533773, -46.62529],
    zoom: 11
  })

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; Contribuidores do <a href="http://osm.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  L.marker([-23.533773, -46.62529])
    .addTo(map)
    .openPopup()
})
