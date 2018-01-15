window.addEventListener('load', function() {
   // alert('funciona');
    var tablaDeBaseDatos = firebase.database().ref('imagenes');
    $('#picture').change(function() {
    // alert('funcionando');
      if (this.files && this.files[0]) {
        var archivo = new FileReader();
        archivo.onload = function(event) {
          tablaDeBaseDatos.push({
            urlLarge: event.target.result,
          });
          // Visualizar la imagen en la etiqueta img
          /*$('#img').attr('src', event.target.result);*/
        };
        archivo.readAsDataURL(this.files[0]);
      }
    });
  
    tablaDeBaseDatos.on('value', function(snapshot) {
       // alert('hola');
      $('#divImagenes').html(''); // Limpiamos el contenedor de imagenes
      snapshot.forEach(function(event) {
        console.log(event);
        var objeto = event.val();
        if (objeto.url !== null) {
          // Agregamos las imagenes que se encuentran en la base de datos
          $('#divImagenes').prepend('<div class="new-item"><div class="row flex-box"><div class="col s10" id="new-container"><img src="' + objeto.urlLarge + '" class= "responsive-img redimensionar"/><div><i class="small material-icons chat">chat</i></div></div></div></div>');
        }
      });
    });
  });
  