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

/**
 * Extension event used for chatty communication
 */
export enum ExtensionEvent {
  /**
   * Notification from host to client
   */
  EXTENSION_HOST_NOTIFICATION = 'EXTENSION_NOTIFICATION',
  /**
   * Process request from client. This is actually a sendAndRecieve request
   */
  EXTENSION_API_REQUEST = 'EXTENSION_API_REQUEST'
}

/**
 * Request types used by the underlying API. The ENTENSION_API_REQUEST delegates
 * work based upon the request type
 */
export enum ExtensionRequestType {
  /**
   * Verify that the host exists and is working correctly. Host is the Looker window
   * instance that owns the client IFRAME.
   */
  VERIFY_HOST = 'VERIFY_HOST',
  /**
   * Execute a call on the Looker CORE SDK
   */
  INVOKE_CORE_SDK = 'INVOKE_CORE_SDK',
  /**
   * Update title
   */
  UPDATE_TITLE = 'UPDATE_TITLE',
  /**
   * Update location
   */
  UPDATE_LOCATION = 'UPDATE_LOCATION',
  /**
   * Location route changed
   */
  ROUTE_CHANGED = 'ROUTE_CHANGED'
}

/**
 * The message that is associated with the Chatty EXTENSION_API_REQUEST event
 */
export interface ExtensionRequest {
  /**
   * Extension request type
   */
  type: ExtensionRequestType
  /**
   * Optional payload assocoayed with extension request type
   */
  payload?: InvokeCoreSdkRequest | undefined
}

export interface InvokeCoreSdkRequest {
  apiMethodName?: string
  httpMethod?: string
  path?: string
  body?: any
  params?: any
  options?: any
}

export interface UpdateTitleRequest {
  title: string
}

export interface UpdateLocationRequest {
  url: string
  state?: any
}

export interface ExtensionHostApi {
  handleNotification (message: ExtensionNotification): any | void
  verifyHostConnection (): Promise<boolean>
  invokeCoreSdkByName (
    methodName: string,
    body?: any,
    params?: any,
    options?: any
  ): Promise<any>
  invokeCoreSdkByPath (
    httpMethod: string,
    path: string,
    body?: any,
    params?: any,
    authenticator?: any,
    options?: any
  ): Promise<any>
  updateTitle (title: string): void
  updateLocation (url: string, state?: any, target?: string): void
  openBrowserWindow (url: string, target?: string): void
  clientRouteChanged (route: string): void
}

export interface ExtensionClientApi {
  handleRequest (message: ExtensionRequest): any | void
}

export interface RouteChangeRequest {
  route: string
}

/**
 * Notification type
 */
export enum ExtensionNotificationType {
  /**
   * Initialize message sent when chatty host and client have established
   * communication
   */
  INITIALIZE = 'INITIALIZE'
}

/**
 * Initialize notification payload
 */
export interface InitializeNotification {
  route?: string
}

/**
 * Extension notification
 */
export interface ExtensionNotification {
  type: ExtensionNotificationType
  payload?: InitializeNotification | undefined
}

/**
 * Extension host configuration
 */
export interface ExtensionHostConfiguration {
  initializedCallback?: () => void
  restoreRoute?: boolean
  setInitialRoute?: (route: string) => void
}

export interface ExtensionHostApiConfiguration
  extends ExtensionHostConfiguration {
  chattyHost: ChattyHostConnection
}
