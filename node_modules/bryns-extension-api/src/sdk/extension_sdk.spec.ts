/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { ChattyHostConnection } from '@looker/chatty'
import { ExtensionHostApiImpl } from '../connect/extension_host_api'
import { ExtensionNotificationType } from '../connect/types'
import { LookerExtensionSDK } from './extension_sdk'

describe('extension_sdk tests', () => {
  let chattyHost: ChattyHostConnection
  let sendAndReceiveSpy: jest.SpyInstance
  let sendSpy: jest.SpyInstance

  beforeEach(() => {
    chattyHost = {
      send: (eventName: string, ...payload: any[]) => {
        // noop
      },
      sendAndReceive: (eventName: string, ...payload: any[]) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(['ss'])
          })
        })
    } as ChattyHostConnection
    sendAndReceiveSpy = jest.spyOn(chattyHost, 'sendAndReceive')
    sendSpy = jest.spyOn(chattyHost, 'send')
  })

  afterEach(() => {
    sendAndReceiveSpy.mockReset()
    sendSpy.mockReset()
  })

  const createHostApi = () => {
    const initializedCallback = jest.fn()
    const hostApi = new ExtensionHostApiImpl({
      chattyHost,
      initializedCallback
    })

    hostApi.handleNotification({
      type: ExtensionNotificationType.INITIALIZE
    })

    return hostApi
  }

  it('creates client', (done) => {
    const sdk = LookerExtensionSDK.createClient(createHostApi())
    expect(sdk).toBeDefined()
    sdk
      .all_connections()
      .then(() => {
        expect(sendAndReceiveSpy).toHaveBeenCalledWith(
          'EXTENSION_API_REQUEST',
          {
            payload: {
              body: null,
              httpMethod: 'GET',
              options: undefined,
              params: {},
              path: '/connections',
              authenticator: undefined
            },
            type: 'INVOKE_CORE_SDK'
          }
        )
        done()
      })
      .catch((error) => {
        console.error('>>>>', error)
        fail()
        done()
      })
  })
})
