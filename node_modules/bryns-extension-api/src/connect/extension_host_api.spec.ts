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
import { ExtensionHostApiImpl } from './extension_host_api'
import { ExtensionNotificationType } from './types'

describe('extension_host_api tests', () => {
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

  it('handles empty initialize notification', () => {
    const initializedCallback = jest.fn()
    new ExtensionHostApiImpl({
      chattyHost,
      initializedCallback
    }).handleNotification({
      type: ExtensionNotificationType.INITIALIZE
    })
    expect(initializedCallback).toHaveBeenCalledWith()
  })

  it('handles invalid initialize notification', () => {
    const initializedCallback = jest.fn()
    try {
      new ExtensionHostApiImpl({
        chattyHost,
        initializedCallback
      }).handleNotification({
        type: 'XXX'
      } as any)
      fail('expected an error')
    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  it('verifies host connection', (done) => {
    try {
      const hostApi = createHostApi()

      hostApi
        .verifyHostConnection()
        .then((message: any) => {
          expect(sendAndReceiveSpy).toHaveBeenCalledWith(
            'EXTENSION_API_REQUEST',
            { payload: undefined, type: 'VERIFY_HOST' }
          )
          done()
        })
        .catch((error: any) => {
          console.error('>>>', error)
          fail()
          done()
        })
    } catch (error) {
      console.error('>>>>', error)
      fail()
    }
  })

  it('invoke core sdk by name', (done) => {
    try {
      const hostApi = createHostApi()
      hostApi
        .invokeCoreSdkByName(
          'all_connections',
          { body: true },
          { params: true }
        )
        .then((message: any) => {
          expect(sendAndReceiveSpy).toHaveBeenCalledWith(
            'EXTENSION_API_REQUEST',
            {
              payload: {
                apiMethodName: 'all_connections',
                body: { body: true },
                params: { params: true }
              },
              type: 'INVOKE_CORE_SDK'
            }
          )
          done()
        })
        .catch((error: any) => {
          console.error('>>>', error)
          fail()
          done()
        })
    } catch (error) {
      console.error('>>>>', error)
      fail()
    }
  })

  it('invoke core sdk by path', (done) => {
    try {
      const hostApi = createHostApi()
      hostApi
        .invokeCoreSdkByPath(
          'POST',
          '/looker/all_connections',
          { params: true },
          { body: true },
          undefined,
          { options: true }
        )
        .then((message: any) => {
          expect(sendAndReceiveSpy).toHaveBeenCalledWith(
            'EXTENSION_API_REQUEST',
            {
              payload: {
                httpMethod: 'POST',
                path: '/looker/all_connections',
                body: { body: true },
                params: { params: true },
                options: { options: true }
              },
              type: 'INVOKE_CORE_SDK'
            }
          )
          done()
        })
        .catch((error: any) => {
          console.error('>>>', error)
          fail()
          done()
        })
    } catch (error) {
      console.error('>>>>', error)
      fail()
    }
  })

  it('updates title', () => {
    const hostApi = createHostApi()
    hostApi.updateTitle('NEW TITLE')
    expect(sendSpy).toHaveBeenCalledWith('EXTENSION_API_REQUEST', {
      payload: {
        title: 'NEW TITLE'
      },
      type: 'UPDATE_TITLE'
    })
  })

  it('updates location', () => {
    const hostApi = createHostApi()
    hostApi.updateLocation('/marketplace', { state: true }, '_blank')
    expect(sendSpy).toHaveBeenCalledWith('EXTENSION_API_REQUEST', {
      payload: {
        url: '/marketplace',
        state: { state: true },
        target: '_blank'
      },
      type: 'UPDATE_LOCATION'
    })
  })

  it('opens window', () => {
    const hostApi = createHostApi()
    hostApi.openBrowserWindow('/marketplace')
    expect(sendSpy).toHaveBeenCalledWith('EXTENSION_API_REQUEST', {
      payload: {
        url: '/marketplace',
        state: undefined,
        target: '_blank'
      },
      type: 'UPDATE_LOCATION'
    })
    hostApi.openBrowserWindow('/marketplace', 'target')
    expect(sendSpy).toHaveBeenCalledWith('EXTENSION_API_REQUEST', {
      payload: {
        url: '/marketplace',
        state: undefined,
        target: 'target'
      },
      type: 'UPDATE_LOCATION'
    })
  })

  it('notifies route change', () => {
    const hostApi = createHostApi()
    hostApi.clientRouteChanged('/sandbox')
    expect(sendSpy).toHaveBeenCalledWith('EXTENSION_API_REQUEST', {
      payload: {
        route: '/sandbox'
      },
      type: 'ROUTE_CHANGED'
    })
  })
})
