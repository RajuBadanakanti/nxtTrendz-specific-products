// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductsDetails} = props
  const {brand, imageUrl, price, rating, title} = similarProductsDetails
  return (
    <li className="similar-products-li-container">
      <img
        src={imageUrl}
        className="similar-products-imgs"
        alt="similar product"
      />
      <h1 className="similar-products-title">{title}</h1>
      <p className="similar-products-brand">{brand}</p>
      <div className="price-rating-container">
        <p className="similar-products-price">Rs {price}/-</p>

        <div className="similar-star-raing-div">
          <p className="similar-product-raing">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            className="similar-star-png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
