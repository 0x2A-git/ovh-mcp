import { logger } from '../../lib/logger'
import { Client, ClientChannel } from 'ssh2'

const sshClientLogger = logger.child({
    moduleName: 'SSH Client',
})

export interface SSHCommandExecutionResult {
    data: Buffer | string
    code: number
    signal: string | null
}

export const sshClientReady = (client: Client) =>
    new Promise<void>((resolve, reject) => {
        client.on('ready', () => {
            sshClientLogger.debug(`SSH Client ready !`)

            resolve()
        })
    })

export const sshSendCommand = (
    client: Client,
    command: string,
    rawOutput: boolean = false
) =>
    new Promise<SSHCommandExecutionResult>((resolve, reject) => {
        client.exec(command, (err, commandChannel: ClientChannel) => {
            if (err) {
                reject(err)
            } else {
                let buffer = Buffer.from([])

                commandChannel
                    .on('close', (code: number, signal: string) => {
                        sshClientLogger.debug(
                            `SSH command stream closed with code ${code} and signal ${signal ?? null}`
                        )

                        const commandResult = {
                            data: rawOutput ? buffer : buffer.toString('utf8'),
                            code,
                            signal: signal ?? null,
                        }

                        if (code !== 0) {
                            reject(commandResult)
                        } else {
                            resolve(commandResult)
                        }
                    })
                    .on('data', (data: Buffer) => {
                        sshClientLogger.verbose(
                            `SSH command stream received data`
                        )

                        buffer = Buffer.concat([buffer, data])
                    })
                    .stderr.on('data', (data: Buffer) => {
                        sshClientLogger.verbose(
                            `SSH command stream received error`
                        )
                        buffer = Buffer.concat([buffer, data])
                    })
            }
        })
    })
