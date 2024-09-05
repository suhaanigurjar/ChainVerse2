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

# ChainVerse2

ChainVerse2 is a decentralized blockchain network that demonstrates peer-to-peer communication and distributed ledger management. This project allows multiple nodes to communicate via WebSockets, mine blocks, and synchronize their chains, ensuring a secure and immutable blockchain.

## Features
- **Peer-to-Peer Communication**: Nodes use WebSockets to exchange data, broadcast transactions, and synchronize chains.
- **Proof of Work (PoW)**: Implements mining with cryptographic puzzles to add new blocks to the blockchain.
- **Decentralized Transactions**: Nodes can independently create and broadcast transactions, which are added to the blockchain through mining.
- **Chain Validation**: Each node independently validates the blockchain to ensure its integrity and security.
- **Genesis Block**: The initial block of the blockchain is created upon startup.

## Technology Stack
- **Node.js**: JavaScript runtime for server-side scripting.
- **Express.js**: Web framework for handling HTTP requests.
- **WebSocket**: Protocol for real-time, bidirectional communication between nodes.
- **Crypto**: Provides cryptographic hashing (SHA-256) for block validation.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/multinode-blockchain.git
    cd multinode-blockchain
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

1. Start the first node:
    ```bash
    node app.js 3000
    ```

2. For additional nodes, open new terminal windows and run:
    ```bash
    node app.js <port>
    ```
   The WebSocket server will automatically run on `port + 1` (e.g., if you run on port 3000, the WebSocket server will use port 3001).

### Interacting with the Blockchain

- **Example Transactions**: Initial transactions (e.g., Alice sending 50 to Bob, Bob sending 25 to Charlie) are configured for demonstration purposes.
- **API Endpoints**:
  - **GET /chain**: Retrieve the current blockchain.
  - **POST /transaction**: Add a new transaction to the pending transactions. Requires a JSON body with `sender`, `receiver`, and `amount`.

## Testing the Blockchain

- Transactions are created and mined at each node.
- Nodes automatically synchronize their chains when new peers connect or broadcast updates.

## Contributions

Contributions are welcome! To contribute, open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

