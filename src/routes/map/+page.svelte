<script lang="ts">
// @ts-nocheck

import { onMount } from 'svelte';

let speed;

const accessToken = "hwukArNqBwb6ZGnQHuiX5shW5a06Jfwh8fbHPCUmYhIt96ZQjRpOQs9WdNqEEHEs"

  export let data;
  const { roads } = data;

  console.log("rou", roads);

  let selectedRoad = null;
  let maxSpeedFilter = null;

  const styles = [
	"jawg-streets",
	"jawg-sunny",
	"jawg-terrain",
	"jawg-dark",
	"jawg-light"
	]

  const mycustomLayer = {};



onMount(()=>{
	let latlng = [0,0]
	var mymap = L.map("map").setView(latlng,3)

	// CREATE TILE LAYER
	styles.forEach((style)=>{
		mycustomLayer[style] = L.tileLayer(`https://tile.jawg.io/${style}/{z}/{x}/{y}{r}.png?access-token=${accessToken}`,{
		maxZoom:22
	})
	})

	// SET DEFAULT IF OPEN THE MAPS FIRST
	mycustomLayer["jawg-streets"].addTo(mymap)

	// ADD CONTROLL IN TOP RIGHT FOR SWITCH THEME MAPS
	L.control.layers(mycustomLayer).addTo(mymap)
	

	// DETECT YOU CURRENT POSITION
navigator.geolocation.getCurrentPosition(location=>{
	latlng = new L.latLng(location.coords.latitude,location.coords.longitude)
	// ADD FLY IF YOU LOCATION IS DETECT
	mymap.flyTo(latlng,15,{
		animate:true,
		duration:0.5

	})
	// CREATE RADIUS CIRCLE ON MARKER
	L.circle(latlng,{radius:300}).addTo(mymap)

	// CREATE MARKER YOU LOCATION
	L.marker(latlng).addTo(mymap).bindPopup("Votre position").openPopup()

},
// IF ERROR FOR DETECT LOCATION SEND CONSOLE ERORR
error=>console.log(error),
// HIGH ACURACY YOU DETECT LOCATION
{enableHighAccuracy:true}
)

})

</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin="" />

  <script
    src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
    integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
    crossorigin="">

  </script>
</svelte:head>

<div>
  <h1>Réseau routier de l'Île-de-France</h1>
  <div class="filter">
    <label for="max-speed-filter">Filtrer par vitesse maximale :</label>
  <select id="max-speed-filter" bind:value={maxSpeedFilter}>
    <option value="">Tous</option>
    <option value="50">50 km/h</option>
    <option value="70">70 km/h</option>
    <option value="90">90 km/h</option>
    <option value="130">130 km/h</option>
  </select>
  </div>
  {#if roads.length === 0}
    <p>Chargement des données...</p>
  {:else}
    <div id="map" style="height: 500px;"></div>
  {/if}
  {#if selectedRoad}
    <div>
      <h2>Informations sur la route sélectionnée :</h2>
      <p>Nom : {selectedRoad.name}</p>
      <p>Vitesse maximale : {selectedRoad.maxSpeed} km/h</p>
    </div>
  {/if}
  <!-- <div>
    <h2>Statistiques sur le réseau routier :</h2>
    <p>Nombre de routes : {filteredRoads.length}</p>
    <p>Vitesse maximale moyenne : {filteredRoads.reduce((acc, road) => acc + road.maxSpeed, 0) / filteredRoads.length} km/h</p>
  </div>   -->
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Laila:wght@300&display=swap');

  * {
    font-family: 'Laila', sans-serif;
}


  #map {
    width: 100%;
  }

  .filter {
    margin-bottom: 20px;
  }
</style>