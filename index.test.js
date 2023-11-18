import assert from 'node:assert'
import Product from './product.js'
import Service from './service.js'
import { describe, it, mock, beforeEach } from 'node:test'

describe('Test Integration of product.js and service.js', () => {
  beforeEach(() => {
     // Impedir que seja online => stub do método save
     mock
      .method(Service.prototype, 'save')
      .mock.mockImplementation(async (params) => {
        return `${params.id} saved with success`
      })
  })

  it('should throw an error when description is less than 5 caracters long', async (t) => {
    const params = { description: 'my p', id: 1, price: 10000 }

    const product = new Product({
      onCreate: () => {},
      service: new Service()
    })

    await assert.rejects(
      () => product.create(params),
      { message: 'description must be higher than 5' },
    )
  })

  it('should pass right arguments to onCreate', async (t) => {
    // mock => o que precisamos pro teste funcionar
    const params = { description: 'my product', id: 1, price: 10000 }

    // "Espia" a função onCreate => onCreate é um stub, e a gente faz o spy para validar
    const onCreateSpy = mock.fn((msg) => {
      assert.deepStrictEqual(msg.id, params.id, 'Id should be the same')
      assert.deepStrictEqual(msg.description, params.description.toUpperCase(), 'description should be the same')
      assert.deepStrictEqual(msg.price, params.price, 'price should be the same')
    })

    const product = new Product({
      onCreate: onCreateSpy,
      service: new Service()
    })

    await product.create(params)

    assert.deepStrictEqual(onCreateSpy.mock.callCount(), 1)
  })

  it('should save process successufully', async (t) => {
    // mock => o que precisamos pro teste funcionar
    const params = { description: 'my product', id: 1, price: 10000 }

    const product = new Product({
      onCreate: mock.fn(),
      service: new Service()
    })

    const result = await product.create(params)

    assert.deepStrictEqual(Service.prototype.save.mock.callCount(), 1)
    assert.deepStrictEqual(result, `${params.id} SAVED WITH SUCCESS`)
  })
})

