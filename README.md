# ChainVerse2

This project demonstrates a decentralized blockchain network with multiple nodes communicating via WebSockets. Each node independently mines blocks, broadcasts its chain, and synchronizes with peers, ensuring a distributed and secure ledger.

## Features
- **Peer-to-Peer Communication**: Nodes communicate over WebSockets, broadcasting transactions and synchronizing chains.
- **Proof of Work (PoW)**: Nodes perform mining, solving cryptographic puzzles to add blocks to the chain.
- **Decentralized Transactions**: Each node can create and broadcast transactions, which are added to the blockchain through mining.
- **Chain Validation**: Every node independently verifies the blockchain's integrity, ensuring immutability and security.
- **Genesis Block**: The first block in the chain is created upon startup.

## Technology Stack
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Lightweight web framework for serving HTTP requests.
- **WebSocket**: Protocol for peer-to-peer communication between nodes.
- **Crypto**: For creating cryptographic hashes (SHA-256) in the blockchain.

## How to Run
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/multinode-blockchain.git
    cd multinode-blockchain
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start a node (specify a port if needed):
    ```bash
    node app.js 3000
    ```

4. For each additional node, open a new terminal window and run:
    ```bash
    node app.js <port>
    ```

5. The WebSocket server will run on `port + 1` (e.g., if you run on port 3000, WebSocket will use port 3001).

## Testing the Blockchain
- Transactions are created and mined at each node.
- Nodes automatically sync their chains when a peer joins or broadcasts.
- Example transactions (Alice sending 50 to Bob, Bob sending 25 to Charlie) are pre-configured to demonstrate functionality.

## API Endpoints
- **GET /chain**: Returns the current blockchain.
- **POST /transaction**: Adds a new transaction to the pending transactions (requires JSON body with `sender`, `receiver`, and `amount`).

## Contributions
Contributions are welcome! Feel free to open an issue or submit a pull request to improve the project.

## License
This project is licensed under the MIT License.
