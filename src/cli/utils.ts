import { isIP } from 'net';
import { TCPServerOptions } from '../server/tcpserver';

export function validateServerOptions(
    options: TCPServerOptions
): true | string {
    if (!isIP(options.host))
        return 'Invalid host, host must be a valid IP address';

    const numberPort: number | typeof NaN = Number(options.port);
    if (!Number.isInteger(numberPort) || numberPort < 0 || numberPort > 65535)
        return 'Invalid port, port must be an integer between 0 and 65535';

    return true;
}
