//////////////////////////////
// Experimenting with models
//////////////////////////////


class Product {
  static get async fields(dispatch) {
    const T = dispatch('model.types')

    return await dispatch('product.fields', {
      id:          T.string.isRequired,
      slug:        T.string.isRequired,
      name:        T.string.isRequired,
      price:       T.objectOf(Money),
      cost:        T.objectOf(Money),
      sku:         T.string,
      description: T.string,
      categories:  T.oneOfType([T.objectOf(Category), T.arrayOf(T.number)])
      stock:       T.number,
      images:      T.array,
      active:      T.bool,
      created:     T.objectOf(Date),
      updated:     T.objectOf(Date),
      variants:    T.oneOfType([T.objectOf(Product), T.arrayOf(T.number)]),
      weight:      T.objectOf(Weight)
    })
  }

  get variants() {
    return await this.query(this.variants)
  }

  get categories() {
    return await Category.query(this.category_ids)
  }

  static middleware(app) {
    return startsWith('product.', async (action, next) => {
      const [, eventType, queryName] = action.event.split('.')

      case eventType {
        'query':
          return Product.query(queryName, action.params)
        'mutate':
          return Product.mutate(queryName, action.params)
        'get':
          return Product.query('get', action.params)
        'update':
          return Product.mutate('update', action.params)
        'delete':
          return Product.mutate('delete', action.params)
      }
    })
  }
}

Product = mixin(Product, [ArgoModel, Sluggable, Versionable, SoftDeletable])

export default function Products(app) {
  const { dispatch } = app

  // const products = resolve('products')
  // product.get(10)
  // product.get({
  //   id: $in: [1,2,3,4]
  // })
  // product.delete(10)

  // product.query()
  // product.mutate()

  return Product.middleware(app)
}


// Example mixin
export default function ArgoModel(child) {
  child.query = () => {

  }

  child.mutate = () => {

  }
}