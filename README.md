## Clien Gateway
Punto de Comunicacion entre los servicios y los clientes.
Se encarga de Mantener las Peticiones de los Clientes y sus Respectivas Respuestas

## DEV
1. Clonar el Repositorio
2. Instalar Dependencias
3. Crear Archivo `.env` en base al `env.template`
4. Ejecutar `npm run start:dev`

## NATS
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats
```