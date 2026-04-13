# Guía: Configuración de Base de Datos Distribuida (Replica Set)

Para que la Computadora A y B compartan información en tiempo real y detecten fallos, utilizaremos un **Replica Set** de MongoDB.

## 1. Configuración de MongoDB (En AMBAS computadoras)

Busca tu archivo de configuración (normalmente `C:\Program Files\MongoDB\Server\X.X\bin\mongod.cfg`) y asegúrate de que contenga lo siguiente:

```yaml
# Configuración de Red
net:
  port: 27017
  bindIp: 0.0.0.0  # Permite conexiones desde la otra computadora

# Habilitar Replicación
replication:
  replSetName: "rs0"
```

**⚠️ RECUERDA:** Después de guardar el archivo, reinicia el servicio de MongoDB en el "Administrador de Tareas" -> "Servicios" -> `MongoDB`.

---

## 2. Inicializar el Sistema Distribuido (Solo en Computadora A)

Abre una terminal o el "MongoDB Shell" en la Computadora A y pega lo siguiente para conectar ambas máquinas:

```javascript
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "192.168.1.76:27017" }, // Esta computadora (A)
    { _id: 1, host: "192.168.1.224:27017" } // Computadora B (Esclavo)
  ]
})
```

Esto configurará a A como Master y B como Slave automáticamente. A partir de aquí, lo que guardes en A se verá en B y viceversa.

---

## 3. Ejecutar el Monitor de Estado y Detección de Desconexión

He creado un panel visual "Premium" que detectará si una computadora se apaga.

1. Abre la terminal en la carpeta `mongodb-sync-dashboard`.
2. Ejecuta: `node server.js`
3. Abre el archivo `index.html` en tu navegador para ver el estado en tiempo real.

### ¿Qué hace este Monitor (Monitor de Datos Distribuidos)?
- **Detección Automática**: Cada 3 segundos revisa si la Computadora B está en línea.
- **Mensaje de Error**: Si apagas la Computadora B, verás un aviso rojo intermitente: **"¡ERROR DE SISTEMA DISTRIBUIDO!: Computadora B se encuentra FUERA DE SERVICIO"**.
- **Vista Cruzada**: Al pulsar "Consultar Datos", el sistema intentará traer la información del nodo seleccionado y te avisará específicamente si no puede acceder por estar deshabilitada.
