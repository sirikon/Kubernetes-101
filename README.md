# Kubernetes 101
Ejemplos de la charla "Kubernetes 101"

## Requisitos

- Docker
- Docker Compose
- Kubectl enganchado a un cluster de Kubernetes local (Por ejemplo el que viene con Docker for Windows).

## Levantar Docker Registry

Vamos a lanzar un Docker Registry local para subir ahí las imágenes que construyamos.

Dentro de la carpeta `registry`, ejecutamos:

```bash
docker-compose up -d
```
