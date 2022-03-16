let map
let marker
let watchId
let geoLoc

const key = 'AIzaSyDclB576uKj0JjBouR4RYLh8xQ6W_S2OqY'


const msj = document.getElementById('msj')


function iniciarMapa(){
    const myLatLng = {lat: -25.363, lng: 131.044}
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 15,
        center: myLatLng,
    });
    marker = new google.maps.Marker({
        position: myLatLng,
        map,
        title: 'Hola desde maps'
    });
    getPosition()
}

function getPosition(){
    if(navigator.geolocation){
        let options = {
            enableHighAccuracy: true, //para que sea lo más presizo posible
            timeout: 5000, //Cada un min se va actualizando la ubicación
            maximumAge: 0
         } 
        geoLoc = navigator.geolocation
         
        watchId = geoLoc.getCurrentPosition(showLocationOnMap, errorHandler, options)
    } else{
        alert('Lo sentimos, su navegador no soporta geolocalización')
    }
}

//Función que toma la latitud y longitud del navegador y muestra dirección y CP
function showLocationOnMap (position){
    const latitud = position.coords.latitude
    const longitud = position.coords.longitude
    const precision = position.coords.accuracy
    const ul = document.createElement('ul')
    const regexp = /\d{4}/

    console.log(`Precisión: ${precision} metros`)
    console.log(`Latitud: ${latitud}, Longitud: ${longitud}`)

    const myLatLng = { lat: latitud, lng: longitud }
    marker.setPosition(myLatLng)
    map.setCenter(myLatLng)

    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${key}`

    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        const parts = data.results[0].address_components
        const cp_array = data.results[0].address_components
        const cp = cp_array[cp_array.length - 1].long_name.slice(1)
        const direccion = data.results[0].formatted_address
        const cp_array1 = data.results[1].address_components
        const cp1 = cp_array1[cp_array1.length - 1].long_name.slice(1)
        
     
        if(cp.match(regexp)){
            msj.appendChild(ul).innerHTML = `
            <li><b>Lat:</b> ${latitud}</li>
            <li><b>Lng</b>: ${longitud}</li>
            <li><b>Precisión:</b> ${precision} metros</li>
            <li><b>CP:</b> ${cp}</li>
            <li><b>Dirección Completa:</b> ${direccion}</li>
            `
            console.log(`CP: ${cp}`)
            console.log(`Dirección Completa: ${direccion}`)
        } else if(cp1.match(regexp)){
            msj.appendChild(ul).innerHTML = `
            <li>CP: ${cp1}</li>
            <li>Dirección Completa: ${direccion}</li>
            `
            console.log(`CP: ${cp1}`)
            console.log(`Dirección Completa: ${direccion}`)
        } else{
            msj.appendChild(ul).innerHTML = `
            <li>No posee CP</li>
            <li>Dirección Completa: ${direccion}</li>
            `
            console.log(`No posee CP`)
            console.log(`Dirección Completa: ${direccion}`)
        }
       
        parts.forEach( part =>{
            if(part.types.includes('administrative_area_level_2')){
               console.log(`Localidad: ${part.long_name}`)
            }
        })
        
    })
    .catch(err => console.warn(err.message))
}


//Función en caso que no esté disponible la geolocalización
function errorHandler (err){
    if(err.code == 1){
       // msj.innerHTML = `<p><mark>Error ${err.code}: ${err.message}</mark></p>`
        alert(`Error ${err.code}: ${err.message}`)
    } else if(err.code == 2){
        alert(`Error ${err.code}: ${err.message}`)
    }
}






