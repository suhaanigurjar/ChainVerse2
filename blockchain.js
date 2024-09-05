const WebSocket = require('ws');
const express = require('express');
const crypto = require('crypto');

const connectToPeer = (peerAddress) => {
    const ws = new WebSocket(peerAddress);
    
    ws.on('open', () => {
        console.log(`Connected to peer: ${peerAddress}`);
        peers.push(ws);  // Add the peer to the list

        // Send blockchain to the newly connected peer
        ws.send(JSON.stringify(blockchain.chain));
    });

    ws.on('message', (message) => {
        const receivedChain = JSON.parse(message);
        synchronizeChain(receivedChain);
    });

    ws.on('error', (error) => {
        console.log(`Error connecting to peer: ${peerAddress}`, error);
    });
};


// Array to store peers
let peers = [];

// Add peer to the array
const addPeer = (ws) => {
    peers.push(ws);
};

// Broadcast chain to all connected peers
const broadcastChain = (blockchain) => {
    peers.forEach(peer => {
        peer.send(JSON.stringify(blockchain.chain));
    });
};

// Synchronize chains when receiving data
const synchronizeChain = (receivedChain) => {
    if (receivedChain.length > blockchain.chain.length) {
        console.log('Updating blockchain');
        blockchain.chain = receivedChain;
    }
};

// Function to start WebSocket server on a separate port
const startWebSocketServer = (wsPort) => {
    const server = new WebSocket.Server({ port: wsPort });

    server.on('connection', (ws) => {
        console.log(`Peer connected on port ${wsPort}`);
        addPeer(ws);

        ws.on('message', (message) => {
            const receivedChain = JSON.parse(message);
            synchronizeChain(receivedChain);
        });

        ws.on('close', () => {
            console.log('Peer disconnected');
        });
    });

    console.log(`WebSocket server started on port ${wsPort}`);
};

// Start the WebSocket server
const wsPort = parseInt(process.argv[2]) + 1; // WebSocket port is HTTP port + 1
startWebSocketServer(wsPort);


// Block class: represents each block in the blockchain
class Block {
    constructor(index, previousHash, timestamp, transactions, nonce = 0) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = nonce;
        this.hash = this.calculateHash();
    }

    // Hash calculation method
    calculateHash() {
        return crypto.createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }

    // Proof-of-Work mining
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

// Blockchain class: manages the chain of blocks
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.peers = [];
    }

    // Create the genesis block (first block in the chain)
    createGenesisBlock() {
        return new Block(0, "0", Date.now(), "Genesis Block", 0);
    }

    // Get the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Mining pending transactions into a block
    minePendingTransactions() {
        let block = new Block(this.chain.length, this.getLatestBlock().hash, Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [];
        this.broadcastChain();
    }

    // Add a new transaction to the pending transactions
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // Validate the blockchain's integrity
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    // Synchronize chain with other peers
    synchronizeChain(newChain) {
        if (newChain.length > this.chain.length && this.isChainValid(newChain)) {
            this.chain = newChain;
            console.log('Blockchain updated to the longest chain');
        }
    }

    // Broadcast the current chain to all peers
    broadcastChain() {
        this.peers.forEach(ws => ws.send(JSON.stringify(this.chain)));
    }

    // Add peers to the node
    addPeer(peer) {
        this.peers.push(peer);
    }
}

// Create a new instance of the blockchain
const blockchain = new Blockchain();

// Express.js setup for HTTP server
const app = express();
const PORT = process.argv[2] || 3000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket server for peer-to-peer communication
const wss = new WebSocket.Server({ port: PORT + 1 });

// Handle WebSocket connections (peers)
wss.on('connection', (ws) => {
    console.log('New peer connected');
    blockchain.addPeer(ws);

    // Receive messages from peers
    ws.on('message', (message) => {
        const receivedChain = JSON.parse(message);
        blockchain.synchronizeChain(receivedChain);
    });

    // Send the current blockchain to the new peer
    ws.send(JSON.stringify(blockchain.chain));
});

// Example transactions to test the blockchain
blockchain.createTransaction({ sender: "Alice", receiver: "Bob", amount: 50 });
blockchain.minePendingTransactions();
blockchain.createTransaction({ sender: "Bob", receiver: "Charlie", amount: 25 });
blockchain.minePendingTransactions();

// Example: Automatically connect to other peers
if (PORT != 3000) {
    connectToPeer('ws://localhost:3001');  // Connecting Node 2 to Node 1
}

