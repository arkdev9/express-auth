const Peer = require("peerjs-nodejs");
const { v4: uuidv4 } = require('uuid');

const id = uuidv4()
console.log(id)

var peer = Peer(
    {
	host: 'https://stormy-escarpment-78427.herokuapp.com',
	path: '/peerjs'
})

