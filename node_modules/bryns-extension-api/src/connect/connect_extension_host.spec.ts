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

import { connectExtensionHost } from './connect_extension_host'

let channel: any
class MockMessageChannel {
  port1: any = {
    postMessage: () => {}
  }
  port2: any = {}
  constructor () {
    channel = this
  }
}

describe('connect_extension_host tests', () => {
  beforeEach(() => {
    (global as any).MessageChannel = MockMessageChannel
  })

  it('handles basic connection', (done) => {
    connectExtensionHost({})
      .then((extensionHost: any) => {
        expect(extensionHost).toBeDefined()
        expect(extensionHost.chattyHost).toBeDefined()
        expect(extensionHost.initializedCallback).not.toBeDefined()
        expect(extensionHost.restoreRoute).not.toBeDefined()
        done()
      })
      .catch((error: any) => {
        fail('failed')
        done()
      })
    channel.port1.onmessage({ data: { action: 0 } })
  })

  it('handles connection with callback and route', (done) => {
    const initializedCallback = jest.fn()
    connectExtensionHost({ initializedCallback, restoreRoute: true })
      .then((extensionHost: any) => {
        expect(extensionHost).toBeDefined()
        expect(extensionHost.chattyHost).toBeDefined()
        expect(extensionHost.initializedCallback).toEqual(initializedCallback)
        expect(extensionHost.restoreRoute).toEqual(true)
        done()
      })
      .catch((error: any) => {
        fail('failed')
        done()
      })
    channel.port1.onmessage({ data: { action: 0 } })
  })
})
