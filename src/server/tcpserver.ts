import { createServer, Server, Socket } from 'net';

export interface TCPServerOptions {
    port?: number;
    host?: string;
}

export default class TCPServer {
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
        this.server = createServer(this.handleConnection());

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

    private onData() {
        return (data: Buffer) => {
            console.log(data.toString().trimEnd());
            this.connection.write(data);
        };
    }

    private handleConnection() {
        return (socket: Socket) => {
            if (!this.connection) {
                this.connection = socket;
                socket.on('data', this.onData());
                socket.on('error', (err) => {
                    console.error(err);
                    this.connection = null;
                });
                socket.on('end', this.handleClosedConnection);

                console.log(
                    `Client connected to server from ${socket.remoteAddress}:${socket.remotePort}`
                );
            } else {
                socket.write('Server already has a client connected\n');
                socket.end();
            }
        };
    }

    public write(text: string): void {
        this.connection && this.connection.write(text);
    }

    private handleClosedConnection() {
        this.connection = null;
        console.log('Client disconnected');
    }
}
