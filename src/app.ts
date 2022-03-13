#! /usr/bin/env node
import { program } from 'commander';
import defaults from './cli/defaults.json';
import runServer from './server/tcpserver';

program
    .name('Socket Chatrooms')
    .description('A tool for P2P chats over TCP developen with NodeJS');

program
    .command('host')
    .description('Start a socket server as the host')
    .option(
        '-p, --port <port>',
        'Listening port for socket server',
        defaults.port
    )
    .option(
        '-a, --host <address>',
        'Listening address for socket server',
        defaults.host
    )
    .action(runServer);

program.parse();
