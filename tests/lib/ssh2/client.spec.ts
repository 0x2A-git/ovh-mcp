import { PassThrough } from 'stream'
import { sshClientReady, sshSendCommand } from '../../../src/lib/ssh2/client'
import { Client } from 'ssh2'
import EventEmitter from 'events'

class ClientChannelMock extends EventEmitter {
    stderr: EventEmitter

    constructor() {
        super()
        this.stderr = new EventEmitter()
    }
}

describe('Lib SSH2 Client', () => {
    test('should resolve SSH client ready when connected', async () => {
        const sshClient = new Client()

        setTimeout(() => {
            sshClient.emit('ready')
        }, 0)

        await expect(sshClientReady(sshClient)).resolves.not.toThrow()
    })

    test('should SSH send command and return result as buffer', async () => {
        const sshClient = new Client()

        const dataMock = Buffer.from('Beep beep')

        const streamMock = new ClientChannelMock()

        sshClient.exec = jest.fn().mockImplementation((command, callback) => {
            callback(null, streamMock)

            streamMock.emit('data', dataMock)
            streamMock.emit('close', 0, undefined)
        })

        setTimeout(() => {
            sshClient.emit('ready')
        }, 0)

        const result = await sshSendCommand(sshClient, 'foo', true)

        expect(result.code).toEqual(0)

        expect(result.data).toEqual(dataMock)

        expect(result.signal).toBeNull()
    })

    test('should SSH send command and return result as string', async () => {
        const sshClient = new Client()

        const dataMock = Buffer.from('Beep beep')

        const streamMock = new ClientChannelMock()

        sshClient.exec = jest.fn().mockImplementation((command, callback) => {
            callback(null, streamMock)

            streamMock.emit('data', dataMock)
            streamMock.emit('close', 0, undefined)
        })

        setTimeout(() => {
            sshClient.emit('ready')
        }, 0)

        const result = await sshSendCommand(sshClient, 'foo')

        expect(result.code).toEqual(0)

        expect(result.data).toEqual(dataMock.toString('utf8'))

        expect(result.signal).toBeNull()
    })

    test('should SSH send command and fail', async () => {
        const sshClient = new Client()

        const dataMock = Buffer.from("Uh oh didn't work :(")
        const codeMock = 1
        const signalMock = 'SIGSEGV'

        const streamMock = new ClientChannelMock()

        sshClient.exec = jest.fn().mockImplementation((command, callback) => {
            callback(null, streamMock)

            streamMock.stderr.emit('data', dataMock)
            streamMock.emit('close', codeMock, 'SIGSEGV')
        })

        setTimeout(() => {
            sshClient.emit('ready')
        }, 0)

        await expect(sshSendCommand(sshClient, 'foo')).rejects.toEqual({
            code: codeMock,
            data: dataMock.toString('utf8'),
            signal: signalMock,
        })
    })

    test('should SSH send command reject if error', async () => {
        const sshClient = new Client()

        const errorMock = new Error('Error mock')

        sshClient.exec = jest.fn().mockImplementation((command, callback) => {
            callback(errorMock, null)
        })

        setTimeout(() => {
            sshClient.emit('ready')
        }, 0)

        await expect(sshSendCommand(sshClient, 'foo')).rejects.toEqual(
            errorMock
        )
    })
})
