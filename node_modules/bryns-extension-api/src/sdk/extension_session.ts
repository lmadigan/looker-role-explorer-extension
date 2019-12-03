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

import { IApiSettings } from '@looker/sdk/dist/rtl/apiSettings'
import {
  IAuthorizer,
  IRequestInit,
  ITransport
} from '@looker/sdk/dist/rtl/transport'

export class ExtensionSession implements IAuthorizer {
  sudoId: string = ''
  transport: ITransport

  constructor (public settings: IApiSettings, transport: ITransport) {
    this.settings = settings
    this.transport = transport
  }

  isAuthenticated () {
    // Assume if the extensions exists then it is authenticated
    return true
  }

  async authenticate (init: IRequestInit) {
    return new Promise<IRequestInit>((resolve, reject) => {
      reject('Authenticate not supported from ExtensionSession')
    })
  }

  // async getToken (): Promise<IAccessToken> {
  //   throw new Error('Access to token is not allowed from ExtensionSession')
  // }

  isSudo (): boolean {
    throw new Error('isSudo is not allowed from ExtensionSession')
  }

  // async login (sudoId?: string | number): Promise<IAccessToken> {
  //   return new Promise<IAccessToken>((resolve, reject) =>
  //     reject('Login not supported from ExtensionSession')
  //   )
  // }

  async logout (): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) =>
      reject('Logout not supported from ExtensionSession')
    )
  }

  reset (): void {
    // noop
  }
}
