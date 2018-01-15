$(document).ready(function () {

  /*Evento a  click de  registrarse 

  $('.register').click(function () {
  $('.createCount').show('slow');

  });*/
  // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCP8cWojta5O-7-hinpXcZMTBX4-gi4HPg",
      authDomain: "usuarios-472dd.firebaseapp.com",
      databaseURL: "https://usuarios-472dd.firebaseio.com",
      projectId: "usuarios-472dd",
      storageBucket: "usuarios-472dd.appspot.com",
      messagingSenderId: "470644492759"
    };
    firebase.initializeApp(config);

  $('#submit').prop('disabled', true);

  // desactivando primer span
  $('#username').keyup(function () {
    $username = $('#username').val().length;
    if ($username >= 3) {
      $('span').eq(0).hide();
    }
    else {
      $('span').eq(0).show();
    }
  });
  // desactivando segundo span
  $('#password').keyup(function () {
    $password = $('#password').val().length;
    if ($password >= 6) {
      $('span').eq(1).hide();
    }
    else {
      $('span').eq(1).show();
    }
  });

  if ($('span').eq(0).hide() && $('span').eq(1).hide() && $('span').eq(2).hide()) {
    $('#submit').prop('disabled', false);
  }

  $('#submit').click(function () {
    var email = $('#username').val();
    var contraseña = $('#password').val();

    console.log(email);
    console.log(contraseña)

    firebase.auth().createUserWithEmailAndPassword(email, contraseña).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  });


  $('#submit2').click(function () {
    var email2 = $('#username2').val();
    var contraseña2 = $('#password2').val();

    firebase.auth().signInWithEmailAndPassword(email2, contraseña2).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.code);
      console.log(error.message);
      // ...
    });

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('usuario activo');
        //window.location.href = '../views/index2.html';
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // ...
      } else {
        console.log('usuario no existe');
        // User is signed out.
        /*$(document.body).html('<h1>NO ESTAS REGISTRADO</h1>');*/
        // ...
      }
    });
  });

  $('#submit2').click(function () {

    if ($('#username2').val('') && $('#password2').val('')) {
      window.location.href = 'views/profile.html';
      

    }
  });

  //login google
  var user = null;
  var $loginBtn = $('#start-login');

  $loginBtn.on('click', googleLogin);

  var provider = new firebase.auth.GoogleAuthProvider();
  function googleLogin() {

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        guardaDatos(result.user);
        console.log(user.displayName);
        console.log(user.photoURL);
        firebase.database().ref('users/' + user.uid).set({
          name: user.displayName,
          email: user.email,
          profilePhoto: user.photoURL
        });
        console.log('todo bien');
        window.location.href = '../views/profile.html';
        // ...

      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  /* Obteniendo datos del usuario actual*/
  var $username = $('.name');
  var $userEmail = $('.directionMail');
  var $profilePhoto = $('.small');
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var name = user.displayName;
      var email = user.email;
      var photoUrl = user.photoURL;
      var emailVerified = user.emailVerified;
      var uid = user.uid;
      console.log(user);
      $username.text(name);
      $userEmail.text(email);
      $profilePhoto.attr('src', photoUrl);
    } else {
      // No user is signed in.
    }
  });

  // Cerrar sesión
  $('.close').click(function () {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      console.log('Cerrando sesión...');
      $(location).attr('href', '../index.html');
    }).catch(function (error) {
      // An error happened.
    });
  });

  /*funcion que guarad  datos automaticamente*/
  function guardaDatos(user) {
    var usuario = {
      uid: user.uid,
      nombre: user.displayName,
      email: user.email,
      foto: user.photoURL
    }
    firebase.database().ref('rama1')
      .push(usuario)

  };

  /*Escribir  en  base  de datos*/
  $('.guardar').click(function () {
    firebase.database().ref('rama1')
      .set({
      });
  });

  /* POST y comentarios */
  var $btn = $('.btn-send');
  var $savePost = $('.save-post');
  var $post = $('#post');
  var $newDiv = $('<div></div>');
  var comentar = $('<span>comentar</span>');
  var $save = $('<span></span>');

  $btn.click(function (event) {
    event.preventDefault();
    $newDiv.addClass('new-div');
    $save.addClass('square-post');
    comentar.addClass('coment');
    var $content = $post.val();
    $save.text($content);
    $newDiv.append($save);
    $newDiv.append(comentar);
    $savePost.append($newDiv);
    $post.val('');
    $savePost.before($newDiv, $savePost.children[0]);
    //console.log($save);
  });

  /* Creando comentarios */
  comentar.click(function () {
    var $textArea = $('<textarea></textarea>');
    var $btn = $('<button></button>');
    $btn.addClass('add-comment');
    var $icon = $('<span></span>');
    var $divg = $('<div></div>');
    $btn.text('Enviar');
    $icon.text('X');
    $divg.append($textArea);
    $divg.append($btn);
    $divg.append($icon);
    $newDiv.append($divg);
    $newDiv.remove(comentar);

    $btn.click(function () {
      var $paragraph = $('<span></span>');
      var $box = $('<div></div>');
      var $box2 = $('<div></div>');
      var $text1 = $('<span></span>');
      $box.addClass('left');
      var $textAreaVal = $textArea.val();
      $paragraph.text($textAreaVal);
      $textArea.val('');
      $box.append($paragraph);
      $text1.text('Añadir tarea');
      $box2.append($text1);
      $box.append($box2);
      $newDiv.before($box, $divg);

      $text1.click(function () {
        var $tArea = $('<textarea></textarea>');
        var $text2 = $('<span></span>');
        var $button = $('<button></button>');
        $text2.text('x');
        $button.text('añadir');
        $box2.append($tArea);
        $box2.append($button);
        $box2.append($text2);
        $box2.remove($text1);

        button.click(function () {
          var $paragraph2 = $('<span></span>');
          var $textAVal = $tArea.val();
          $paragraph2.text($textAVal);
          $tArea.val('');
          $box.before($paragraph2, $box2);
        });
      });
    });
  });

  //fotos en linea

  /*var file;
  var storageRef;
  var uploadMessage;
  var postedImagesRef;
  var $postsContainer = $('#posts-container');

  function begin() {
    uploadMessage = $('#upload-msg');

    file = document.getElementById('file');
    file.addEventListener('change', selectFile, false);

    // Create a root reference
    storageRef = firebase.storage().ref();

    postedImagesRef = firebase.database().ref().child('postedImages');
  }

  function selectFile(event) {
    var selectedFile = file.files[0];

    var uploadTask = storageRef.child('postedImages/' + selectedFile.name).put(selectedFile);

    uploadTask.on('state_changed', function (snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {
      // Handle unsuccessful uploads
    }, function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log('subio imagen');
      createNode(FitnesFile.name, downloadURL);
      uploadMessage.text('Gracias por compartir :)');
      setTimeout(function () {
        uploadMessage.text(' ');
      }, 1000);
      $postsContainer.prepend('<div class="card del-post mt-3"><div class="card-header btn-yellowLab"><small>Publicado por</small> Usuario</div><div class="card-body" id="appendLike"><p class="card-text new-post"></p></div></div>');
      $('.new-post').first().html('<img src="' + downloadURL + '" class="img-fluid">');
      $('#appendLike').append('<button class="btn btn-secondary like-btn"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>Me gusta</button>');
      $('.card-header').first().prepend('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    });
  }

  function createNode(imageName, downloadUrl) {
    postedImagesRef.push({
      name: imageName,
      url: downloadUrl
    });
  }*/

})