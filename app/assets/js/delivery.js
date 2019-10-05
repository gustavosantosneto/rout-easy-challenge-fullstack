let app = angular.module('roat_easy_app', [])

app.controller('delivery_controller', ($scope, $http, $timeout) => {
  $scope.form_customer = { endereco: { geo_localizacao: {} } }
  $scope.customers = []
  $scope.markers = []
  $scope.total_weight = 0
  $scope.avg_ticket = 0
  $scope.map = null

  const inp_address = document.getElementById('inp_address')

  const init = () => {
    create_map()
    get_customers()
  }

  const create_map = () => {
    $scope.map = L.map('map', {
      center: [-23.533773, -46.62529], // SAO PAULO COMO PADRAO
      zoom: 11 // ZOOM DA CIDADE
    })
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; Contribuidores do <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo($scope.map)
  }

  const create_marker = (customer, fit) => {
    let marker = L.marker([customer.endereco.geo_localizacao.latitude, customer.endereco.geo_localizacao.longitude], {})
      .addTo($scope.map)
      .openPopup()
      .bindPopup(`${customer.nome_cliente}<br/>Peso:${customer.peso_kg}Kg`)

    marker.on('mouseover', function(ev) {
      ev.target.openPopup()
    })
    marker.on('mouseout', function(ev) {
      ev.target.closePopup()
    })

    $scope.markers.push(marker)
    if (fit) {
      var group = new L.featureGroup($scope.markers)
      console.log(group.getBounds())
      $scope.map.fitBounds(group.getBounds())
    }
  }

  const get_customers = () => {
    $http({
      method: 'GET',
      url: `/deliveries`
    }).then(
      res => {
        if (res.data.error) return

        $scope.customers = res.data.data || []

        update_metrics()

        $scope.customers.map(c => create_marker(c))

        var group = new L.featureGroup($scope.markers)
        console.log(group.getBounds())
        $scope.map.fitBounds(group.getBounds())
      },
      err => {}
    )
  }

  const search_address = () => {
    console.log('search_address', $scope.form_customer)
    if (!$scope.form_customer.endereco.address || $scope.form_customer.endereco.address.length < 5) return
    $http({
      method: 'GET',
      url: `/deliveries/search_address/${$scope.form_customer.endereco.address}`
    }).then(
      res => {
        if (res.data.error) search_error(res.data.error)

        $scope.form_customer.endereco = { ...$scope.form_customer.endereco, ...res.data.data }
      },
      err => {
        search_error()
      }
    )
  }

  const save_customer = data => {
    $http({
      method: 'POST',
      url: '/deliveries',
      data
    }).then(res => {}, err => {})
  }

  const update_metrics = () => {
    $scope.total_weight = $scope.customers.reduce((sum, item) => sum + item.peso_kg, 0)
    $scope.avg_ticket = ($scope.total_weight / $scope.customers.length).toFixed(1)
  }

  const search_error = error => {
    $scope.form_customer.endereco = { geo_localizacao: {} }
    $scope.form_customer.endereco.address = error || 'Falha ao buscar endereço'
    $timeout(() => {
      $scope.form_customer.endereco.address = null
    }, 3000)
  }

  // AO DIGITAR ALGO
  document.addEventListener('keypress', e => {
    if (document.activeElement === inp_address) {
      const key = e.which || e.keyCode
      if (key == 13) {
        // ENTER
        e.preventDefault()
        search_address()
      }
    }
  })

  $scope.search_address_click = search_address

  $scope.btn_save_click = () => {
    if (!$scope.form_customer.nome_cliente) return
    if ($scope.form_customer.peso_kg === undefined || $scope.form_customer.peso_kg === 0) return
    if ($scope.form_customer.endereco.geo_localizacao.latitude === undefined) return

    $scope.customers.push($scope.form_customer)
    save_customer($scope.form_customer)
    create_marker($scope.form_customer, true)
    $scope.form_customer = {}

    update_metrics()
  }

  $scope.btn_reset_click = () => {
    $scope.customers = []

    $scope.markers.map(m => $scope.map.removeLayer(m))

    $http({
      method: 'DELETE',
      url: `/deliveries`
    }).then(res => {}, err => {})
  }

  init()
})
