app.controller("userController", function($scope, Nominate, Vote, User) {

  //Bindables
  $scope.category = '2'
  $scope.identification = null
    //def functions
  $scope.fnSaveData = fnSaveData;
  $scope.fnGetNominates = fnGetNominates;
  $scope.fnAddVote = fnAddVote;
  $scope.fnshowNominate = fnshowNominate;
  $scope.fnhideNominate = fnhideNominate;


  // Autoinit
  fnInit();

  //functions
  function fnInit() {
    fnGetNominates($scope.category);
     showAlertConfirmation();
  }

  function fnGetNominates(category) {

    var objParams = {
      category: category
    };
    var promise = Nominate.get_by_category(objParams)
    promise.$promise.then(function(response) {
      $scope.nominates = response
    })

  }

  function fnSaveData() {
    var nominate = Nominate.save($scope.newNominate)
    nominate.$promise.then(function(data) {
      fnAddVote(data.id)
      fnGetNominates($scope.category);
    })
    $scope.newNominate = {}
    fnhideNominate()
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
        swal(data.user_name, "Hallá nos vemos!!", "success");
      }

      if (data.response == 'NOT_FOUND') {
        swal({
          title: "No hemos encontrado la cedula",
          text: "Desea intentar de nuevo!",
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
    console.log("la indentificacion:", $scope.identification)
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
    var objParams = {
      nominate_id: nominate_id,
      user_identification: $scope.identification,
      category: $scope.category
    };
    var vote = Vote.save(objParams)
    vote.$promise.then(function(data) {
      console.log(data)
      if (data.errors == "REPEAT") {
        swal("Error!", "Ya has votado por esta categoria!!", "error");
        return
      }
      if (data.id) {
        swal("Corrercto!", "Tú voto ha sido registrado!!", "success");
        return
      }
    }, function(error) {
      console.log(error)
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
        swal("Lastima!", "Sera una proxima ocasion!!", "success");
        return
      };
      if (inputValue === "") {
        swal.showInputError("Ingresa un número de cédula!");
        return false
      }
       $scope.identification  = inputValue;
      fnSetConfirmation(inputValue, 1)
    });
  }

  function fnshowNominate() {
    $scope.bolNominate = true;
  }

  function fnhideNominate() {
    $scope.bolNominate = false;
  }

})
