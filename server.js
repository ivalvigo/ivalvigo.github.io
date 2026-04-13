const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());

// AJUSTE DE PUERTOS PARA EL PUNTO 2 (FRAGMENTACIÓN)
const nodes = [
  { name: 'Computadora A (Local - Servidor)', ip: '127.0.0.1', port: 27018, id: 'A' },
  { name: 'Computadora B (Amigo - Escuela)', ip: '100.77.242.36', port: 27018, id: 'B' }
];

app.get('/status', async (req, res) => {
  const statusResults = await Promise.all(nodes.map(async (node) => {
    const url = `mongodb://${node.ip}:${node.port}?connectTimeoutMS=2000&serverSelectionTimeoutMS=2000`;
    let client;
    try {
      client = new MongoClient(url);
      await client.connect();
      const admin = client.db('admin').admin();
      const info = await admin.serverStatus();
      await client.close();
      return { 
        ...node, 
        online: true, 
        version: info.version,
        replSet: info.repl ? info.repl.setName : 'Shard Activo',
      };
    } catch (err) {
      if (client) await client.close();
      console.log(`Error conectando a ${node.name}:`, err.message);
      return { ...node, online: false, error: err.message };
    }
  }));
  res.json(statusResults);
});

// Ruta de consulta para ver tus tablas de Clientes/Productos
app.get('/query/:id', async (req, res) => {
  const node = nodes.find(n => n.id === req.params.id);
  const url = `mongodb://${node.ip}:${node.port}?connectTimeoutMS=2000`;
  let client;
  try {
    client = new MongoClient(url);
    await client.connect();
    const db = client.db('VentasDB');
    const data = await db.collection('pedidos').find({}).limit(5).toArray();
    await client.close();
    res.json({ success: true, node: node.name, collection: 'pedidos', data });
  } catch (err) {
    if (client) await client.close();
    res.status(503).json({ success: false, message: `ATENCIÓN: La Computadora ${node.id} está deshabilitada.` });
  }
});

app.listen(3001, '0.0.0.0', () => {
    console.log('Monitor de Fragmentación activo en puerto 3001');
});
