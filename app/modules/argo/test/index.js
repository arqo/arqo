import should from 'should'
import Argo from '../'

function wait(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve()
    }, time)
  })
}

describe('Argo', function() {
  beforeEach(function() {
    this.argo = new Argo()
  })

  describe('#use()', function() {
    it('should take a function and return itself', function() {
      this.argo.use(() => {}).should.equal(this.argo)
    })

    it('should take an array of functions and return itself', function() {
      this.argo.use([() => {}]).should.equal(this.argo)
    })

    it('should take a nested array of functions and flatten them', function() {
      var fn = () => {}
      this.argo.use([
        fn, [fn, fn, [fn, [fn, fn]]]
      ]).middleware.length.should.equal(6)
    })
  })

  describe('#dispatch()', function() {
    it('should dispatch an action', function() {
      this.argo.use((action) => action)
      this.argo.dispatch('something').should.be.fulfilledWith({
        event: 'something',
        params: []
      })
    })

    it('should dispatch an action with parameters', function() {
      this.argo.use((action) => action)
      this.argo.dispatch('something', [1, 2, 3]).should.be.fulfilledWith({
        event: 'something',
        params: [1, 2, 3]
      })
    })

    it('should return a value', function() {
      this.argo.use(() => 'test')
      this.argo.dispatch('something').should.be.fulfilledWith('test')
    })

    it('should return a value (async)', async function() {
      this.argo.use([
        async function() {
          return 'test'
        }
      ])

      let res = await this.argo.dispatch('something')
      res.should.equal('test')
    })

    it('should skip the return value if a middleware returns undefined', async function() {
      this.argo.use([
        async function() { },
        async function() { return 'test' },
        async function() { },
        function() { }
      ])

      let res = await this.argo.dispatch('something')
      res.should.equal('test')
    })

    it('should await next', async function() {
      let arr = []

      this.argo.use([
        async function(_, next) {
          arr.push(1)
          await wait(4)
          await next
          arr.push(5)
        },
        async function(_, next) {
          arr.push(2)
          await wait(3)
          await next
          arr.push(6)
        },
        async function(_, next) {
          arr.push(3)
          await wait(2)
          await next
          arr.push(7)
        },
        async function(_, next) {
          arr.push(4)
          await wait(1)
          await next
          arr.push(8)
        }
      ])

      await this.argo.dispatch('something')
      arr.should.eql([1,2,3,4,5,6,7,8])
    })
  })
})