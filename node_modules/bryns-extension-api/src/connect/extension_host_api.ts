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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { ChattyHostConnection } from '@looker/chatty'
import {
  ExtensionEvent,
  ExtensionHostApi,
  ExtensionHostApiConfiguration,
  ExtensionNotification,
  ExtensionNotificationType,
  ExtensionRequestType,
  InitializeNotification
} from './types'

export class ExtensionHostApiImpl implements ExtensionHostApi {
  private chattyHost: ChattyHostConnection
  private initializedCallback?: (payload?: InitializeNotification) => void
  private restoreRoute?: boolean
  private setInitialRoute?: (router: string) => void

  constructor (configuration: ExtensionHostApiConfiguration) {
    const {
      chattyHost,
      initializedCallback,
      restoreRoute,
      setInitialRoute
    } = configuration
    this.chattyHost = chattyHost
    this.initializedCallback = initializedCallback
    this.restoreRoute = restoreRoute
    this.setInitialRoute = setInitialRoute
  }

  handleNotification (message: ExtensionNotification): any | void {
    const { type, payload } = message
    switch (type) {
      case ExtensionNotificationType.INITIALIZE:
        if (this.restoreRoute && payload) {
          const { route } = payload
          if (route) {
            if (this.setInitialRoute) {
              this.setInitialRoute(route)
            }
          }
        }
        if (this.initializedCallback) {
          this.initializedCallback()
        }
        break
      default:
        console.error('Unrecognized extension notification', message)
        throw new Error(
          `Unrecognized extension notification type ${message.type}`
        )
    }
  }

  async verifyHostConnection () {
    return this.sendAndReceive(ExtensionRequestType.VERIFY_HOST)
  }

  async invokeCoreSdkByName (
    apiMethodName: string,
    body?: any,
    params?: any
  ): Promise<any> {
    return this.sendAndReceive(ExtensionRequestType.INVOKE_CORE_SDK, {
      apiMethodName,
      body,
      params
    })
  }

  async invokeCoreSdkByPath (
    httpMethod: string,
    path: string,
    params?: any,
    body?: any,
    authenticator?: any,
    options?: any
  ): Promise<any> {
    return this.sendAndReceive(ExtensionRequestType.INVOKE_CORE_SDK, {
      httpMethod,
      path,
      params,
      body,
      authenticator,
      options
    })
  }

  updateTitle (title: string) {
    this.send(ExtensionRequestType.UPDATE_TITLE, { title })
  }

  updateLocation (url: string, state?: any, target?: string) {
    this.send(ExtensionRequestType.UPDATE_LOCATION, { url, state, target })
  }

  openBrowserWindow (url: string, target?: string) {
    this.send(ExtensionRequestType.UPDATE_LOCATION, {
      url,
      undefined,
      target: target || '_blank'
    })
  }

  clientRouteChanged (route: string) {
    this.send(ExtensionRequestType.ROUTE_CHANGED, {
      route
    })
  }

  async sendAndReceive (type: string, payload?: any): Promise<any> {
    return this.chattyHost
      .sendAndReceive(ExtensionEvent.EXTENSION_API_REQUEST, {
        type,
        payload
      })
      .then((values) => values[0])
  }

  send (type: string, payload?: any) {
    this.chattyHost.send(ExtensionEvent.EXTENSION_API_REQUEST, {
      type,
      payload
    })
  }
}
