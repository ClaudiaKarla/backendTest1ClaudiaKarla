### Locations CRUD

Crear un **CRUD** para el dominio de locations con los cuales podremos indicar el origen y el destino de una orden.

Requisitos:

- Crear un location a partir de un place_id de Google Maps
- Obtener las coordenadas y dirección de los place_id utilizando la API de Google Maps.
- No crear la misma location dos veces.
- Poder listar, modificar y eliminar las locations creadas por el usuario

```
- address (string)
- place_id (string)
- latitude (number)
- longitude (number)
```

#### Nota

[Documentación de place_id](https://developers.google.com/maps/documentation/places/web-service/place-id)

Estos son algunos ejemplos de place_id que puedes usar

- ChIJiRp93iEC0oURvJVqErpVVHw
- ChIJsUDXn2od0oURpAnsjV2k44A
- ChIJGQkBCFIAzoURlLaQUWnuYZc
