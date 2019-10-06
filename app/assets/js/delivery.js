let app = angular.module('roat_easy_app', [])

app.controller('delivery_controller', ($scope, $http, $timeout) => {
  // VARIAVEIS GLOBAIS
  $scope.form_customer = { endereco: { geo_localizacao: {} } }
  $scope.customers = []
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

    $scope.customers.filter(c => customer._id == c._id)[0].marker = marker

    if (fit) {
      var group = new L.featureGroup(get_markers())
      $scope.map.fitBounds(group.getBounds())
    }
  }

  const get_markers = () => {
    return $scope.customers.reduce((acum, item) => {
      acum.push(item.marker)
      return acum
    }, [])
  }

  const get_customers = () => {
    $http({
      method: 'GET',
      url: `/deliveries`
    }).then(
      res => {
        if (res.data.error) return

        $scope.customers = res.data.data || []

        if ($scope.customers.length > 0) {
          update_metrics()

          $scope.customers.map(c => create_marker(c))

          var group = new L.featureGroup(get_markers())
          $scope.map.fitBounds(group.getBounds(), { padding: [100, 100] })
        }
      },
      err => {
        debugger
        console.error(err)
      }
    )
  }

  const search_address = () => {
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
        debugger
        console.error(err)
        search_error()
      }
    )
  }

  const search_error = error => {
    $scope.form_customer.endereco = { geo_localizacao: {} }
    $scope.form_customer.endereco.address = error || 'Falha ao buscar endereço'
    $timeout(() => {
      $scope.form_customer.endereco.address = null
    }, 3000)
  }

  $scope.search_address_click = search_address

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

  const save_customer = async data => {
    // CLONA OBJ PARA NAO AFETAR OBJ ORIGINAL
    data = { ...data }
    delete data.marker
    await $http({
      method: 'POST',
      url: '/deliveries',
      data
    }).then(
      res => {
        $timeout(($scope.form_customer._id = res.data._id))
      },
      err => {
        debugger
        console.error(err)
      }
    )
  }

  const update_metrics = () => {
    $scope.total_weight = $scope.customers.reduce((sum, item) => sum + item.peso_kg, 0)
    $scope.avg_ticket = $scope.total_weight / $scope.customers.length || 0
    $scope.avg_ticket = $scope.avg_ticket.toFixed($scope.avg_ticket % 1 === 0 ? 0 : 1)
  }

  $scope.btn_save_click = async () => {
    if (!$scope.form_customer.nome_cliente) return
    if (
      $scope.form_customer.peso_kg === undefined ||
      $scope.form_customer.peso_kg === 0 ||
      $scope.form_customer.peso_kg === null
    )
      return
    if ($scope.form_customer.endereco.geo_localizacao.latitude === undefined) return

    await save_customer($scope.form_customer)
    $scope.customers.push({ ...$scope.form_customer })
    create_marker($scope.form_customer, true)
    $scope.form_customer = {}

    update_metrics()
  }

  $scope.delete_customer = id => {
    if (!id) return

    const marker = $scope.customers.filter(c => c._id == c._id)[0].marker

    $scope.map.removeLayer(marker)

    $scope.customers = $scope.customers.filter(c => c._id != id)

    $http({
      method: 'DELETE',
      url: `/deliveries/${id}`
    }).then(
      res => {},
      err => {
        debugger
        console.error(err)
      }
    )

    update_metrics()
  }

  $scope.btn_reset_click = () => {
    $scope.customers.map(c => $scope.map.removeLayer(c.marker))
    $scope.customers = []

    update_metrics()

    $http({
      method: 'DELETE',
      url: `/deliveries`
    }).then(
      res => {},
      err => {
        debugger
        console.error(err)
      }
    )
  }

  init()
})
