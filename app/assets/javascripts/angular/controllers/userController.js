app.controller("userController", function($scope, blockUI, Nominate, Vote, User) {

  //Bindables

  $scope.category = {id:1, name: 'Premio a la Calidad Administrativa'}
  $scope.bolRequired = false
  $scope.identification = null
    //def functions
  $scope.fnSaveData = fnSaveData;
  $scope.fnGetNominates = fnGetNominates;
  $scope.fnAddVote = fnAddVote;
  $scope.fnshowNominate = fnshowNominate;
  $scope.fnhideNominate = fnhideNominate;
  $scope.showAlertConfirmation = showAlertConfirmation;
  var arrAceptedCategory = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  $scope.categorias = [{
    id: 1,
    name: 'Premio a la Calidad Administrativa'
  }, {
    id: 2,
    name: 'Premio a la Calidad Asistencial'
  }, {
    id: 3,
    name: 'Premio al Desempeño Asistencial'
  }, {
    id:4 ,
    name: 'Premio al Desempeño Administrativa'
  }, {
    id:5,
    name: 'Premio a la Seguridad Administrativa'
  }, {
    id:6 ,
    name: 'Premio a la Seguridad del paciente Asistencial'
  }, {
    id:7 ,
    name: 'Premio al Liderazgo Administrativo'
  }, {
    id:8 ,
    name: 'Premio al Liderazgo Asistencial'
  }, {
    id:9 ,
    name: 'Premio al Espíritu FSB  Admnistrativo'
  }, {
    id:10 ,
    name: 'Premio al Espíritu FSB Asistencial'
  }, {
    id:10 ,
    name: 'New category'
  }

  ];

    // Autoinit
  fnInit();

  //functions
  function fnInit() {

    fnGetNominates($scope.category.id);
    fnValidateVote();
  }

  function fnGetNominates(category) {
    blockUI.start();
    fnValidateVote()
    var objParams = {
      category: category
    };
    var promise = Nominate.get_by_category(objParams)
    promise.$promise.then(function(response) {
      $scope.nominates = response
    })
    promise.$promise.finally(blockUI.stop);
  }

  function fnSaveData() {

    if ($scope.name == undefined) {
      $scope.bolRequired = true
      return;
    }
    var objParams = {
      name: $scope.name,
      category: $scope.category.id
    };
    if ($scope.identification == null) {
      sweetAlert({
        title: "Ingresa identification",
        type: "input",
        showCancelButton: false,
        closeOnConfirm: false,
        closeOnCancel: true,
        confirmButtonColor: "#2C4693",
        animation: "slide-from-top",
        inputPlaceholder: "Ingresa tú cédula",
        confirmButtonText: "Ingresar",
      }, function(inputValue) {
        if (inputValue === false) {
          return
        };
        if (inputValue === "") {
          swal.showInputError("Ingresa un número de cédula!");
          return false
        }
        $scope.identification = inputValue
        fnSaveNominate(objParams)
      });
    } else {
      fnSaveNominate(objParams)
    }

  }

  function fnSaveNominate(objParams) {
    var user = User.find_by_identificacion({
      identification: $scope.identification
    })
    user.$promise.then(function(data) {
      if (data.id) {
        var nominate = Nominate.save(objParams)
        nominate.$promise.then(function(data) {
          fnAddVote(data.id)
          fnGetNominates($scope.category.id);
        })
        $scope.name = null;
        fnhideNominate()
      } else {
        swal("Error!", "Cedula no encontrada", "error");
        return
      }
    })


  }

  function fnSetConfirmation(identification, presence) {
    var objParams = {
      presence: presence
    };
    var nominate = User.update({
      id: identification
    }, objParams)
    nominate.$promise.then(function(data) {
      console.log(data.user_name);
      if (data.response == true && presence == 1) {
        swal(data.user_name, "Te esperamos!", "success");
      }

      if (data.response == 'NOT_FOUND') {
        swal({
          title: "No hemos encontrado la cedula",
          text: "Desea intentar de nuevo?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#2C4693",
          confirmButtonText: "Si",
          cancelButtonText: "No",
          closeOnConfirm: false
        }, function() {
          showAlertConfirmation();
        });
      }
    }, function(error) {
      console.log(error)
    })
  }

  function fnAddVote(nominate_id) {
    
    if ($scope.identification == null) {
      sweetAlert({
        title: "Ingresa identification",
        type: "input",
        showCancelButton: false,
        closeOnConfirm: false,
        closeOnCancel: true,
        confirmButtonColor: "#2C4693",
        animation: "slide-from-top",
        inputPlaceholder: "Ingresa tú cédula",
        confirmButtonText: "Ingresar",
      }, function(inputValue) {
        if (inputValue === false) {
          return
        };
        if (inputValue === "") {
          swal.showInputError("Ingresa un número de cédula!");
          return false
        }
        $scope.identification = inputValue
        fnVote(nominate_id);
      });
    } else {
      fnVote(nominate_id);
    }
  }

  function fnVote(nominate_id) {
    fnValidateVote()
    var objParams = {
      nominate_id: nominate_id,
      user_identification: $scope.identification,
      category: $scope.category.id
    };
    var user = User.find_by_identificacion({
      identification: $scope.identification
    })
    user.$promise.then(function(response) {
      if (response.id) {
        var vote = Vote.save(objParams)
        vote.$promise.then(function(data) {
          if (data.errors == "REPEAT") {
            swal(response.name, "Ya has votado por esta categoría!", "error");
            return
          }
          if (data.id) {
            swal(response.name, "Tú voto ha sido registrado!", "success");
            return
          }
        }, function(error) {
          console.log(error)
        })

      } else {
        swal("Error!", "Cedula no encontrada", "error");
        return
      }

    })

  };

  function showAlertConfirmation() {
    sweetAlert({
      title: "Confirma",
      text: "Tú asistencia",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      closeOnCancel: false,
      confirmButtonColor: "#2C4693",
      animation: "slide-from-top",
      inputPlaceholder: "Ingresa tú cédula",
      confirmButtonText: "Sí, asistiré",
      cancelButtonText: "No puedo ir",
    }, function(inputValue) {
      if (inputValue === false) {
        swal("Lastima!", "Desearíamos que nos acompañaras", "success");
        return
      };
      if (inputValue === "") {
        swal.showInputError("Ingresa un número de cédula!");
        return false
      }
      $scope.identification = inputValue;
      fnSetConfirmation(inputValue, 1)
    });
  }

  function fnValidateVote() {
    $scope.bolIsNominated = true
    // if (arrAceptedCategory.indexOf($scope.category.id) >= 0) {
    //   $scope.bolIsNominated = true
    // }
  }

  function fnshowNominate() {
    $scope.bolNominate = true;
  }

  function fnhideNominate() {
    $scope.bolNominate = false;
  }

})
