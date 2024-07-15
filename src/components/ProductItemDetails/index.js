// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemsList: [],
    similarProductsList: [],
    addCartCount: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        title: data.title,
        totalReviews: data.total_reviews,
        rating: data.rating,
      }

      const similarProductsData = data.similar_products.map(eachsimiData => ({
        id: eachsimiData.id,
        availability: eachsimiData.availability,
        brand: eachsimiData.brand,
        description: eachsimiData.description,
        imageUrl: eachsimiData.image_url,
        price: eachsimiData.price,
        rating: eachsimiData.rating,
        style: eachsimiData.style,
        title: eachsimiData.title,
        totalReviews: eachsimiData.total_reviews,
      }))

      this.setState({
        productItemsList: updatedData,
        similarProductsList: similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickCartIncrease = () => {
    this.setState(prevState => ({addCartCount: prevState.addCartCount + 1}))
  }

  onClickCartDecrese = () => {
    const {addCartCount} = this.state
    if (addCartCount > 1) {
      this.setState(prevState => ({addCartCount: prevState.addCartCount - 1}))
    }
  }

  onClickContinueShopingBtn = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="error-products-conatainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-products-img"
      />
      <h1 className="error-product-header">Product Not Found</h1>
      <button
        type="button"
        className="continue-shopping-btn"
        onClick={this.onClickContinueShopingBtn}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderSimilerProducts = () => {
    const {similarProductsList} = this.state
    return (
      <div className="similar-products-container">
        <h1 className="similar-product-header">Similar Products</h1>
        <ul className="similar-products-ul-container">
          {similarProductsList.map(eachItem => (
            <SimilarProductItem
              key={eachItem.id}
              similarProductsDetails={eachItem}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductItemsView = () => {
    const {productItemsList, addCartCount} = this.state
    const {
      /* id, */
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productItemsList
    return (
      <div className="products-items-container">
        <div className="product-img-content-container">
          <img src={imageUrl} className="product-item-img" alt="product" />
          <div className="product-content-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="star-reviews-div">
              <div className="star-raing-div">
                <p className="product-raing"> {rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-png"
                  alt="star"
                />
              </div>
              <p className="product-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="product-availability">
              <span className="availability-span">Available: </span>
              {availability}
            </p>
            <p className="product-brand">
              <span className="brand-span">Brand: </span>
              {brand}
            </p>
            <hr className="hr-line" />
            <div className="cart-count-btns-container">
              <button
                type="button"
                data-testid="minus"
                className="cart-count-btns"
                onClick={this.onClickCartDecrese}
              >
                <BsDashSquare className="dash-icon" />.
              </button>

              <p className="cart-count"> {addCartCount} </p>
              <button
                type="button"
                data-testid="plus"
                className="cart-count-btns"
                onClick={this.onClickCartIncrease}
              >
                <BsPlusSquare className="plus-icon" />.
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilerProducts()}
      </div>
    )
  }

  renderAllStatusContainers = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return ''
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="products-similar-container">
          {this.renderAllStatusContainers()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
