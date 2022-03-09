#! /usr/bin/env node

import TCPServer from './server/tcpserver';

const tcpServer = new TCPServer({ port: 42069, host: '0.0.0.0' });

process.stdin.on('data', (data) => {
    tcpServer.write(data.toString());
});
