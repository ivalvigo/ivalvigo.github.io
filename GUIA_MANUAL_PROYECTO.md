# 🚀 GUÍA 100% MANUAL: Sistema de Datos Distribuido

**IMPORTANTE:** Como no tienes MongoDB instalado como servicio, **todo se activa manualmente abriendo ventanas de terminal (CMD o PowerShell)**. Si cierras las ventanas, el sistema se apaga.

Sigue estos pasos en orden:

## ⚠️ REQUISITO CRÍTICO: Tailscale
**Tailscale es el "puente" que conecta las dos computadoras.** 

*   **¿Por qué?** Sin Tailscale, tu PC y la de Angel no pueden verse a través de internet.
*   **Regla:** El icono de Tailscale en la barra de tareas debe estar **blanco/conectado** en AMBAS computadoras antes de empezar. Si uno se desconecta, el sistema dejará de sincronizar.

---

## 💻 PASO 1: Preparar y Activar las Bases de Datos
*Haz esto en tu PC A y dile a Angel que lo haga en su PC B.*

1.  **Abrir Tailscale:** Asegúrate de que el icono en la barra de tareas esté conectado (color blanco).

2.  **Crear carpetas de datos (SOLO SI ES LA PRIMERA VEZ):**
    MongoDB necesita que las carpetas existan antes de arrancar. Copia y pega esto según tu PC:
    *   **PC A (Tuya):** `mkdir "C:\data\shard1"`
    *   **PC B (Angel):** `mkdir "C:\data\shard2"`

3.  **Arrancar MongoDB (Ventana 1):**
    Abre una terminal y pega el comando de arranque:
    *   **PC A (Casa):** 
        `mongod --port 27018 --dbpath "C:\data\shard1" --replSet rsShard1 --bind_ip 0.0.0.0`
    *   **PC B (Escuela):** 
        `mongod --port 27018 --dbpath "C:\data\shard2" --replSet rsShard2 --bind_ip 0.0.0.0`
        
    **⚠️ REGLA DE ORO:** Esta ventana se debe quedar abierta todo el tiempo. NO LA CIERRES.

---

## 🏠 PASO 2: Activar el Monitor (Solo en tu PC A)

1.  **Abrir Terminal (Ventana 2):** Abre una nueva pestaña o ventana de terminal y pega lo siguiente:
    ```powershell
    d:
    cd "\.gemini\antigravity\scratch\mongodb-sync-dashboard"
    node server.js
    ```
    *(Si ves un mensaje que dice "Monitor de Fragmentación activo", vas por excelente camino).*

---

## 🌐 PASO 3: Ver el Dashboard

1.  Abre tu navegador (Chrome o Edge).
2.  Arrastra el archivo **`index.html`** al navegador o presiona `Ctrl + O` y búscalo.
3.  Verifica que los dos nodos (A y B) aparezcan en **VERDE**.

---

## 📊 PASO 4: Cómo manejar los datos (Manual)

Si quieres agregar o ver datos desde la terminal, abre una **Ventana 3** y entra con:
`mongosh --port 27018`

Luego usa estos comandos básicos:
*   `use VentasDB` (Entrar a la base de datos).
*   `db.pedidos.insertOne({ item: "Demo", precio: 50 })` (Guardar algo).
*   `db.pedidos.find()` (Ver todo lo guardado).

---

### 🚨 SI ALGO FALLA (Soluciones rápidas):
*   **¿Rojo en el Dashboard?** Angel cerró su ventana de terminal o Tailscale se desconectó.
*   **¿Error "Connection Refused"?** Olvidaste abrir la **Ventana 1** con el comando `mongod`.
*   **¿Error de "VentasDB" vacío?** Recuerda siempre poner `use VentasDB` antes de cualquier `insertOne`.
