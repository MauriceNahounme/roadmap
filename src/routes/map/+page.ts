export async function load() {
  const response = await fetch(
    "https://api-adresse.data.gouv.fr/search/?q=Ile-de-France"
  );
  const data = await response.json();

  let speed = 10;

  // Extraire les routes de la réponse de l'API
  const routes = data.features.map((feature) => ({
    id: feature.properties.id,
    maxSpeed: feature.properties.max_speed,
    position: {
      x: feature.geometry.coordinates[0],
      y: feature.geometry.coordinates[1],
    },
  }));

  // Object.keys(routes).filter((key) => key[2] === speed);

  routes.filter((route) => route.maxSpeed === speed)

  return { routes };
}
