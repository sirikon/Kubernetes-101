# Kubernetes 101
Ejemplos de la charla "Kubernetes 101"

## Requisitos

- Docker
- Docker Compose
- Kubectl enganchado a un cluster de Kubernetes local (Por ejemplo el que viene con Docker for Windows).

### Levantar Docker Registry

Vamos a lanzar un Docker Registry local para subir ahí las imágenes que construyamos.

Dentro de la carpeta `registry`, ejecutamos:

```bash
docker-compose up -d
```

### Compilar y subir aplicación de ejemplo al registry local

Tenemos una aplicación de ejemplo preparada para ser utilizada. La aplicación es simplemente un servidor web en Node que responde "Hello World!".

Vamos a la carpeta `app` y dentro ejecutamos:

```bash
docker-compose build
docker-compose push
```

Al terminar, tendremos la app en nuestro registry local.

### Aplicar definiciones del Nginx Ingress

Para poder hacer los ejemplos de Ingress, antes, necesitamos aplicar las definiciones de ingress-nginx.

```bash
kubectl apply -f ingress/mandatory.yml
kubectl apply -f ingress/cloud-generic.yml
```

## Ejemplos

### Namespace

Primero tenemos que crear el namespace sobre el que trabajaremos.

Un namespace es un espacio organizativo dentro de un cluster de Kubernetes. Nos permite unificar todos los recursos relativos a una aplicación o servicio bajo un recurso principal.

Tenemos preparada una definición de namespace, la cual aplicaremos al cluster tal que así:

```bash
kubectl apply -f namespace.yml
```

Esto nos creará un namespace llamado `example-namespace`.

### Pod

Vamos a desplegar la aplicación, y lo haremos lanzando un Pod.

Un Pod en Kubernetes es la unidad mínima de escalado. No hay nada más pequeño que un Pod, y este puede consistir en uno o más contenedores.

Para crear un pod con la aplicación, lanzamos este comando:

```bash
kubectl apply -f pod.yml
```

Con esto desplegamos un único Pod, que de hecho, podemos verlo correr así:

```bash
kubectl get pods -n example-namespace
```

Y podemos borrarlo así

```bash
kubectl delete pod app -n example-namespace
```

### Deployment

Crear un único Pod, realmente, no es la solución más práctica frente a escenarios reales, en los que queremos tener varias instancias de un mismo Pod repartidas en el cluster.

Para poder definir el despliegue de un conjunto de Pods, podemos usar los Deployments.

Un deployment es una definición de conjuntos de Pods iguales. Podemos definir cosas como la plantilla a utilizar para crearlos o el número de réplicas.

Creamos el deployment así:

```bash
kubectl apply -f deployment.yml
```

Ahora, si intentamos borrar un pod, este es recreado al momento. Esto sucede porque un Deployment se asegura de que el número de copias de un Pod se mantiene en el número especificado. Se ha especificado que el número de copias sean 3. Si una muere, se encargará de crear una nueva automáticamente. Kubernetes se encarga de que el estado prevalezca aunque sucedan errores.

### Service

Tenemos un namespace, en el que hemos desplegado un deployment, el cual se encarga de provisionar pods, pero todavía no podemos ver la aplicación.

Ahora vamos a crear un Service. Un Service es un elemento de red que unifica una serie de pods bajo una única dirección interna en el cluster.

Por ejemplo, si tenemos los pods `app-1, app-2 y app-3`, y queremos tener una única dirección a la que lanzar peticiones, crearemos un servicio llamado, por ejemplo, `app-service`, de forma que cuando queramos ir a cualquiera de las instancias de la app, la dirección a la que tendremos que ir desde dentro del cluster será `http://app-service`.

Primero vamos a crear un servicio de tipo NodePort. Cuando creamos un servicio tipo NodePort, queremos decir que el servicio estará disponible desde el exterior del cluster mediante un puerto, al cual se atachará en cada máquina del cluster.

```bash
kubectl apply -f service-nodeport.yml
```

Hecho esto, deberíamos poder ver la aplicación en nuestro navegador, entrando a http://localhost:31000.

### Ingress

Kubernetes permite alojar cualquier tipo de aplicación. No tiene por qué ser web. Pero la realidad es que es muy común el hospedar servicios web en Kubernetes.

Y todo servicio web, mínimo tendrá un balanceador de carga y un punto en el que securizar la conexión mediante HTTPS. En Kubernetes tenemos los Ingress para ayudar en esto.

Un Ingress es un frontal web configurable mediante definiciones en Kubernetes.

Por ejemplo, esta aplicación que tenemos funcionando, está escuchando peticiones inseguras HTTP. Si ponemos el Ingress por delante, podremos aplicar un certificado HTTPS para que todas las conexiones a un dominio concreto sean securizadas y redireccionadas al servicio correcto. También podemos hacer otras cosas como routing mediante path, reescritura de URLs, etc.

Primero vamos a crear un servicio interno (ClusterIP) dentro del cluster, para redirigir el Ingress hacia éste.

```bash
kubectl apply -f service.yml
```

Ahora vamos a desplegar una definición de routing de Ingress, tal que así:

```bash
kubectl apply -f ingress.yml
```

Con esta definición, todas las peticiones http serán redirigidas al servicio que hemos creado antes.

Por lo que deberíamos poder ver la app en http://localhost (El Ingress Nginx en la configuración por defecto, comienza a escuchar en el puerto 80 del nodo del cluster).
