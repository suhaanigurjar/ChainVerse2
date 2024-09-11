{\rtf1\ansi\ansicpg1252\cocoartf2759
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const WebSocket = require('ws');\
const express = require('express');\
const crypto = require('crypto');\
const repl = require('repl');  // Import the REPL module\
\
// Function to connect to a peer\
const connectToPeer = (peerAddress) => \{\
    const ws = new WebSocket(peerAddress);\
    \
    ws.on('open', () => \{\
        console.log(`Connected to peer: $\{peerAddress\}`);\
        peers.push(ws);  // Add the peer to the list\
\
        // Send blockchain to the newly connected peer\
        ws.send(JSON.stringify(blockchain.chain));\
    \});\
\
    ws.on('message', (message) => \{\
        const receivedChain = JSON.parse(message);\
        synchronizeChain(receivedChain);\
    \});\
\
    ws.on('error', (error) => \{\
        console.log(`Error connecting to peer: $\{peerAddress\}`, error);\
    \});\
\};\
\
// Array to store peers\
let peers = [];\
\
// Add peer to the array\
const addPeer = (ws) => \{\
    peers.push(ws);\
\};\
\
// Broadcast chain to all connected peers\
const broadcastChain = (blockchain) => \{\
    peers.forEach(peer => \{\
        peer.send(JSON.stringify(blockchain.chain));\
    \});\
\};\
\
// Synchronize chains when receiving data\
const synchronizeChain = (receivedChain) => \{\
    if (receivedChain.length > blockchain.chain.length) \{\
        console.log('Received new chain. Updating blockchain...');\
        blockchain.chain = receivedChain;\
    \}\
\};\
\
// Function to start WebSocket server on a separate port\
const startWebSocketServer = (wsPort) => \{\
    const server = new WebSocket.Server(\{ port: wsPort \});\
\
    server.on('connection', (ws) => \{\
        console.log(`Peer connected on port $\{wsPort\}`);\
        addPeer(ws);\
\
        ws.on('message', (message) => \{\
            const receivedChain = JSON.parse(message);\
            synchronizeChain(receivedChain);\
        \});\
\
        ws.on('close', () => \{\
            console.log('Peer disconnected');\
        \});\
\
        // Send the current blockchain to the new peer\
        ws.send(JSON.stringify(blockchain.chain));\
    \});\
\
    console.log(`WebSocket server started on port $\{wsPort\}`);\
\};\
\
// Start the WebSocket server\
const wsPort = parseInt(process.argv[2]) + 1; // WebSocket port is HTTP port + 1\
startWebSocketServer(wsPort);\
\
// Block class: represents each block in the blockchain\
class Block \{\
    constructor(index, previousHash, timestamp, transactions, nonce = 0) \{\
        this.index = index;\
        this.previousHash = previousHash;\
        this.timestamp = timestamp;\
        this.transactions = transactions;\
        this.nonce = nonce;\
        this.hash = this.calculateHash();\
    \}\
\
    // Hash calculation method\
    calculateHash() \{\
        return crypto.createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');\
    \}\
\
    // Proof-of-Work mining\
    mineBlock(difficulty) \{\
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) \{\
            this.nonce++;\
            this.hash = this.calculateHash();\
        \}\
        console.log("Block mined: " + this.hash);\
    \}\
\}\
\
// Blockchain class: manages the chain of blocks\
class Blockchain \{\
    constructor() \{\
        this.chain = [this.createGenesisBlock()];\
        this.difficulty = 2;\
        this.pendingTransactions = [];\
        this.miningReward = 100; // Reward for mining a block\
    \}\
\
    // Create the genesis block (first block in the chain)\
    createGenesisBlock() \{\
        return new Block(0, "0", Date.now(), "Genesis Block", 0);\
    \}\
\
    // Get the latest block in the chain\
    getLatestBlock() \{\
        return this.chain[this.chain.length - 1];\
    \}\
\
    // Mining pending transactions into a block\
    minePendingTransactions(minerAddress) \{\
        // Create a block with pending transactions\
        const block = new Block(this.chain.length, this.getLatestBlock().hash, Date.now(), this.pendingTransactions);\
        block.mineBlock(this.difficulty);\
\
        console.log('Block successfully mined!');\
        this.chain.push(block);\
\
        // Create a reward transaction for the miner\
        const rewardTransaction = \{\
            sender: "system",\
            receiver: minerAddress,\
            amount: this.miningReward\
        \};\
        this.pendingTransactions = [rewardTransaction];\
\
        // Broadcast the updated chain to connected peers\
        broadcastChain(this);\
    \}\
\
    // Add a new transaction to the pending transactions\
    createTransaction(transaction) \{\
        this.pendingTransactions.push(transaction);\
    \}\
\
    // Validate the blockchain's integrity\
    isChainValid() \{\
        for (let i = 1; i < this.chain.length; i++) \{\
            const currentBlock = this.chain[i];\
            const previousBlock = this.chain[i - 1];\
\
            if (currentBlock.hash !== currentBlock.calculateHash()) \{\
                return false;\
            \}\
\
            if (currentBlock.previousHash !== previousBlock.hash) \{\
                return false;\
            \}\
        \}\
        return true;\
    \}\
\
    // Synchronize chain with other peers\
    synchronizeChain(newChain) \{\
        if (newChain.length > this.chain.length && this.isChainValid(newChain)) \{\
            this.chain = newChain;\
            console.log('Blockchain updated to the longest chain');\
        \}\
    \}\
\}\
\
// Create a new instance of the blockchain\
const blockchain = new Blockchain();\
\
// Express.js setup for HTTP server\
const app = express();\
const PORT = process.argv[2] || 3000;\
\
// Start the Express server\
app.listen(PORT, () => \{\
    console.log(`Server is running on port $\{PORT\}`);\
\});\
\
// Example transactions to test the blockchain\
blockchain.createTransaction(\{ sender: "Alice", receiver: "Bob", amount: 50 \});\
blockchain.minePendingTransactions("Alice");  // Mine and reward Alice\
blockchain.createTransaction(\{ sender: "Bob", receiver: "Charlie", amount: 25 \});\
blockchain.minePendingTransactions("Bob");    // Mine and reward Bob\
\
// Example: Automatically connect to other peers\
if (PORT != 3000) \{\
    connectToPeer('ws://localhost:3001');  // Connecting Node 2 to Node 1\
\}\
\
// Start REPL to interact with the blockchain\
const startRepl = () => \{\
    const replServer = repl.start('> ');\
\
    // Expose blockchain and peers array in the REPL context\
    replServer.context.blockchain = blockchain;\
    replServer.context.peers = peers;\
    replServer.context.connectToPeer = connectToPeer;\
    replServer.context.broadcastChain = broadcastChain;\
\};\
\
startRepl();\
}

