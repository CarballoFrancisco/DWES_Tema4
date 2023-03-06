
$(function(){
    $.get({
        url: 'http://localhost:3000/inicio',
    }).done(function(listaPersonajes){
        actualizarTablaPersonajes(listaPersonajes);
    });
})

$('#mostrar-todos').on('click',function(){
    $.get({
        url: 'http://localhost:3000/inicio',
    }).done(function(listaPersonajes){
        actualizarTablaPersonajes(listaPersonajes);
    });
});
$('#filtro-1').on('click', function() {
    $.get({
        url: 'http://localhost:3000/humanos',
    }).done(function(listaPersonajes){
        actualizarTablaPersonajes(listaPersonajes);
    });
});

$('#filtro-2').on('click', function() {
    $.get({
        url: 'http://localhost:3000/anioMenor1979',
    }).done(function(listaPersonajes){
        actualizarTablaPersonajes(listaPersonajes);
    });
});
$('#filtro-3').on('click', function() {
    $.get({
        url: 'http://localhost:3000/holly',
    }).done(function(listaPersonajes){
        actualizarTablaPersonajes(listaPersonajes);
    });
});
$('#filtro-4').on('click', function() {
    $.get({
        url: 'http://localhost:3000/estudiantesvivos',
    }).done(function(listaPersonajes){
        actualizarTablaPersonajes(listaPersonajes);
    });
});




$('#boton-crear-personaje').on('click', function() {
    let imagenPersonaje = $('#imagenPersonaje').val();
    let nombrePersonaje = $('#nombrePersonaje').val();
    let especiePersonaje = $('#especiePersonaje').val();
    let generoPersonaje = $('#generoPersonaje').val();
    let casaPersonaje = $('#casaPersonaje').val();
    let anoNacimientoPersonaje = parseInt($('#anoNacimientoPersonaje').val());
    let personaje =     {
        "_id":uuid.v4(),
        "name": nombrePersonaje,
        "species": especiePersonaje,
        "gender": generoPersonaje,
        "house": casaPersonaje,
        "dateOfBirth": "",
        "yearOfBirth": anoNacimientoPersonaje,
        "ancestry": "",
        "eyeColour": "",
        "hairColour": "",
        "wand": {

        },
        "patronus": "",
        "hogwartsStudent": true,
        "hogwartsStaff": false,
        "actor": "",
        "alive": true,
        "image": imagenPersonaje
    };
   $.ajax({
        url: 'http://localhost:3000/crearPersonaje',
        type: 'POST',
        data: JSON.stringify(personaje),
        contentType: 'application/json; charset=UTF-8',
        success:function(response){
            alert(response);
            $.get({
                url: 'http://localhost:3000/inicio',
            }).done(function(listaPersonajes){
                actualizarTablaPersonajes(listaPersonajes);
            });
            $('#imagenPersonaje').val('');
            $('#nombrePersonaje').val('');
            $('#especiePersonaje').val('');
            $('#generoPersonaje').val('');
            $('#casaPersonaje').val('');
            $('#anoNacimientoPersonaje').val('');
        }         
    });
});


function actualizarTablaPersonajes(listaPersonajes) {
    $('#todos-registros tbody').empty();
    let cadenaTds='';
    for(let x = 0; x < listaPersonajes.length; x++){
        cadenaTds += '<tr><td><img style="width:100px" src="'+listaPersonajes[x].image+'"></td><td>'+listaPersonajes[x].name+'</td><td>'+listaPersonajes[x].species+'</td><td>'+listaPersonajes[x].gender+'</td><td>'+listaPersonajes[x].house+'</td><td>'+listaPersonajes[x].yearOfBirth+'</td><td><a class="btn btn-danger btnEliminar" id="'+listaPersonajes[x].name+'">Eliminar</a></td></tr>';  
    }
    $('#todos-registros tbody').append(cadenaTds);
    $('.btnEliminar').on('click',function(){
        let nombre = $(this).attr('id');
        $.ajax({
            type: 'DELETE',
            url: 'http://localhost:3000/borrarPersonaje'+nombre,
            success: function(response){
                alert(response);
                $.get({
                    url: 'http://localhost:3000/inicio',
                }).done(function(listaPersonajes){
                    actualizarTablaPersonajes(listaPersonajes);
                });
            },
            error: function(err){
            }
        });
    });
}