const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
const port = 3000;

// Configurar body-parser
app.use(bodyParser.json());

// Conectar a la base de datos
mongoose.connect('mongodb://uzodv7nfipolfja4xja6:lisvNi94z0dzyey34LLh@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bpyarpzxh2qhqhl?replicaSet=rs0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado correctamente a la base de datos'))
  .catch(err => console.error(err));

// Definir el esquema de la tarea
const tareaSchema = new mongoose.Schema({
  descripcion: String,
  completada: Boolean,
  fecha: String
});

// Definir el modelo de la tarea
const Tarea = mongoose.model('Tarea', tareaSchema);




// Endpoint para obtener todas las tareas
app.get('/', function(req, res) {
  Tarea.find({})
    .exec()
    .then(function(tareas) {
      res.json(tareas);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Error al obtener las tareas');
    });
});

app.get('/busqueda', function(req, res) {
  let params = req.query.filtro;
  console.log(params);
  switch (params){
    case 'sin-f':
      Tarea.find({})
      .exec()
      .then(function(tareas) {
        res.json(tareas);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error al obtener las tareas');
      });
      break;
    case 'activas-p':
      Tarea.find({}).sort({ completada: -1 })
      .exec()
      .then(function(tareas) {
        res.json(tareas);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error al obtener las tareas');
      });
      break;
      case 'ncom-p':
        Tarea.find({}).sort({ completada: 1 })
        .exec()
        .then(function(tareas) {
          res.json(tareas);
        })
        .catch(function(err) {
          console.error(err);
          res.status(500).send('Error al obtener las tareas');
        });
        break;
    case 'proximas-p':
      Tarea.find({}).sort({ fecha: 1 })
      .exec()
      .then(function(tareas) {
        res.json(tareas);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error al obtener las tareas');
      });
      break;
    case 'solo-c':
      Tarea.find({completada: true})
      .exec()
      .then(function(tareas) {
        res.json(tareas);
      })
      .catch(function(err) {
        console.error(err);
        res.status(500).send('Error al obtener las tareas');
      });
      break;
      case 'solo-noc':
        Tarea.find({completada: false})
        .exec()
        .then(function(tareas) {
          res.json(tareas);
        })
        .catch(function(err) {
          console.error(err);
          res.status(500).send('Error al obtener las tareas');
        });
        break;
      case 'solo-c':
        Tarea.find({completada: true})
        .exec()
        .then(function(tareas) {
          res.json(tareas);
        })
        .catch(function(err) {
          console.error(err);
          res.status(500).send('Error al obtener las tareas');
        });
        break;
      case 'solo-ca':
        const ahora = new Date();
        const anio = ahora.getFullYear();
        const mes = ahora.getMonth() + 1;
        const dia = ahora.getDate();
        const fecha = `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
        console.log(fecha);
        Tarea.find({fecha: {$lt: fecha}})
        .exec()
        .then(function(tareas) {
          res.json(tareas);
        })
        .catch(function(err) {
          console.error(err);
          res.status(500).send('Error al obtener las tareas');
        });
        break;
      }
  }
);

// Endpoint para crear una nueva tarea
app.post('/tareas', function(req, res) {
  const tarea = new Tarea(req.body);
  tarea.save()
    .then(function(tareaGuardada) {
      res.send(tareaGuardada);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Error al guardar la tarea');
    });
});

// Endpoint para actualizar una tarea por su ID
app.put('/uptarea/:id', function(req, res) {
  const tareaId = req.params.id;
  const update = req.body;

  Tarea.findByIdAndUpdate(tareaId, update, { new: true })
    .exec()
    .then(function(tareaActualizada) {
      res.json(tareaActualizada);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Error al actualizar la tarea');
    });
});

// Endpoint para eliminar una tarea por su ID
app.delete('/deltarea/:id', function(req, res) {
  const tareaId = req.params.id;

  Tarea.findByIdAndDelete(tareaId)
    .exec()
    .then(function(tareaEliminada) {
      res.json(tareaEliminada);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send('Error al eliminar la tarea');
    });
});

// Iniciar el servidor
app.listen(port, function() {
  console.log('Servidor iniciado en el puerto ' + port);
});
