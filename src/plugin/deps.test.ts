import { describe, expect, it } from '@jest/globals'

import { addConstraint } from './deps'

describe('Plugin', () => {
  it('deps', () => {
    expect(addConstraint('~', '^0.1.0')).toEqual('~0.1.0')
  })
})
