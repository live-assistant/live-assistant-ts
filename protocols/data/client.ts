// MIT License

// Copyright (c) 2023 @live-assistant/protocols-data's Authors

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {
  PROTOCOL_VERSION,
} from './constants'
import {
  IClient,
} from './interfaces'
import {
  DataType,
  SocketDataPayload,
  SocketEventHandlerMap,
} from './types'

/**
 * Live Assistant Client
 */
export class LiveAssistantClient implements IClient {
  constructor (
    port: number,
    password: string,
    handlers: Partial<SocketEventHandlerMap>,
    autoRetryDuration = 15000,
  ) {
    this._port = port
    this._password = password
    this._types = Object.keys(handlers) as DataType[]
    this._handlers = handlers
    this._autoRetryDuration = autoRetryDuration
  }

  /** Port */
  private _port: number
  /** Password */
  private _password: string
  /** Types */
  private _types: DataType[]
  /** Auto retry interval */
  private _autoRetryDuration: number
  /** Retry interval */
  private _retryIimeout: ReturnType<typeof setTimeout> | undefined = undefined

  /** Socket */
  private _socket?: WebSocket = undefined

  /** Is connected */
  public get isStopped() {
    return (this._socket?.readyState ?? WebSocket.CLOSED) === WebSocket.CLOSED
  }

  /**
   * Start the client
   */
  public start(){
    if (!this.isStopped) return

    this._socket = new WebSocket(`ws://localhost:${this._port}/data?authorization=${this._password}&types=${this._types.join(',')}&version=${PROTOCOL_VERSION}`)
    this._socket.addEventListener('message', this.onMessage.bind(this))
    this._socket.addEventListener('open', this.onOpen.bind(this))
    this._socket.addEventListener('close', this.onClose.bind(this))
    this._socket.addEventListener('error', this.onError.bind(this))
  }

  /**
   * Stop the client
   */
  public stop(){
    this._socket?.close()
    this._socket?.removeEventListener('message', this.onMessage)
    this._socket?.removeEventListener('open', this.onOpen)
    this._socket?.removeEventListener('close', this.onClose)
    this._socket?.removeEventListener('error', this.onError)
    this._socket = undefined
  }

  /** Handle open event */
  private onOpen(e: Event) {
    this._handlers.open?.(e)

    if (this._retryIimeout !== undefined) {
      clearTimeout(this._retryIimeout)
      this._retryIimeout = undefined
    }
  }

  /** Handle close event */
  private onClose(e: CloseEvent) {
    this.stop()
    this._handlers.close?.(e)

    this._retryIimeout = setTimeout(() => {
      if (this.isStopped) {
        this.start()
        this._retryIimeout = undefined
      }
    }, this._autoRetryDuration)
  }

  /** Handle error event */
  private onError(e: Event) {
    this._handlers.error?.(e)
  }

  /**
   * Handle message event
   * @param e Message event
   */
  private onMessage(
    e: MessageEvent<string>,
  ) {
    const message: SocketDataPayload = JSON.parse(e.data)
    this._handlers[message.type]?.(message.payload as any)
  }

  /** Event handlers */
  private _handlers: Partial<SocketEventHandlerMap> = { }

  /**
   * Listen to an event
   * @param e Event type
   * @param handler Event handler
   */
  public on<E extends keyof SocketEventHandlerMap>(
    e: E,
    handler: SocketEventHandlerMap[E],
  ): void {
    this._handlers[e] = handler
  }
}
