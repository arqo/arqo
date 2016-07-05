import should from 'should'
import Argo from '../'

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
    it('should dispatch an action event', function() {
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
        async function() {
          return 'test'
        },
        async function() {
          return
        },
        function() {
          return
        }
      ])

      let res = await this.argo.dispatch('something')
      res.should.equal('test')
    })

    it('should allow middleware to await until the next middleware(s) finish', async function() {
      this.argo.use([
        async function(action, next, prev = '') {
          prev = await next()
          // prev = await next()
          // prev = await next()
          return prev + '1'
        },
        async function(action, next, prev = '') {
          return prev + '2'
        },
        async function(action, next, prev = '') {
          return prev + '3'
        },
        async function(action, next, prev = '') {
          return prev + '4'
        }
      ])

      let res = await this.argo.dispatch('something')
      res.should.equal('2341')
    })
  })
})