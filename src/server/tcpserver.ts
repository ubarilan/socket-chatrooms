import { createServer, Server, Socket } from 'net';
import { validateServerOptions } from '../cli/utils';

export interface TCPServerOptions {
    port?: number;
    host?: string;
}

export class TCPServer {
    private port: number;
    private host: string;
    private server: Server;
    private connection: Socket;

    constructor({ port = 42069, host = '0.0.0.0' }: TCPServerOptions) {
        this.port = port;
        this.host = host;
        this.initServer();
    }

    private initServer() {
        this.server = createServer(this.handleConnection.bind(this));

        this.server.listen(
            {
                port: this.port,
                host: this.host,
            },
            () => {
                console.log(`Server listening on ${this.host}:${this.port}`);
            }
        );
    }

    get isConnected() {
        return this.connection !== null;
    }

    private onData(data: Buffer) {
        console.log(data.toString().trimEnd());
        this.connection.write(data);
    }

    private handleConnection(socket: Socket) {
        if (!this.connection) {
            this.connection = socket;
            socket.on('data', this.onData.bind(this));
            socket.on('error', (err) => {
                console.error(err);
                this.connection = null;
            });

            socket.on('end', this.handleClosedConnection.bind(this));

            console.log(
                `Client connected to server from ${socket.remoteAddress}:${socket.remotePort}`
            );
        } else {
            socket.write('Server already has a client connected\n');
            socket.end();
        }
    }

    public write(text: string): void {
        this.connection && this.connection.write(text);
    }

    private handleClosedConnection() {
        this.connection = null;
        console.log('Client disconnected');
    }
}

export default function runServer(options: TCPServerOptions): void {
    function inputHandler(data: Buffer) {
        if (tcpServer.isConnected) {
            tcpServer.write(data.toString());
        }
    }

    const serverOptionsValid = validateServerOptions(options);
    if (serverOptionsValid !== true) {
        console.log(serverOptionsValid);
        process.exit(1);
    }

    const tcpServer = new TCPServer(options);
    process.stdin.on('data', inputHandler);
}
