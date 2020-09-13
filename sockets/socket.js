

const {io} = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');


const bands = new Bands();

bands.addBand( new Band('Velociraptor'));
bands.addBand( new Band('Belociraptor'));
bands.addBand( new Band('Zelociraptor'));
bands.addBand( new Band('Xelociraptor'));



// Mensaje de Sockets
io.on('connection', client => {
    console.log('cliente conectado');

    client.emit('active-bands',bands.getBands());
    
    client.on('disconnect', () => {
        console.log('Cliente desconectado');  
    });

    client.on('mensaje', (payload) => {
        console.log('MEnsajeeee!' , payload);
        io.emit( 'mensaje', { admin: 'Nuevo Mensaje' })
    });

    client.on('emitir-mensaje', (payload) => {
        io.emit('nuevo-mensaje', payload);  
    })

    client.on('vote-band', (payload) =>{

        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());

    });

    // Escuchar  'add-band'

    client.on('add-band' , (payload) => {
        const newB = new Band(payload.name)
        bands.addBand(newB);
        io.emit('active-bands', bands.getBands());
    });

    client.on('eliminar', (payload) => {
        
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands()); 
    });


});