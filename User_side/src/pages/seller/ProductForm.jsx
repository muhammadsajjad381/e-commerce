import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiUploadCloud, FiX } from 'react-icons/fi'
import { addProduct, updateProduct } from '../../store/productSlice'
import { categories } from '../../data/categories'
import { CURRENT_SELLER } from '../../config/seller'

const MAX_IMAGES = 4

// Shrink an uploaded photo to max 800px and convert it to a small JPEG data URL
const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, 800 / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const products = useSelector((state) => state.products.items)
  const existing = isEdit ? products.find((p) => p.id === Number(id)) : null

  const [formData, setFormData] = useState(() => ({
    title: existing?.title || '',
    category: existing?.category || '',
    subcategory: existing?.subcategory || '',
    condition: existing?.condition || 'new',
    price: existing?.price ?? '',
    oldPrice: existing?.oldPrice ?? '',
    stock: existing?.stock ?? '',
    description: existing?.description || '',
  }))
  const [images, setImages] = useState(existing?.images || [])
  const [errors, setErrors] = useState({})

  // Only a seller's own products can be edited
  if (isEdit && (!existing || existing.seller !== CURRENT_SELLER)) {
    return <Navigate to="/seller/dashboard" replace />
  }

  const subcategories = categories.find((c) => c.slug === formData.category)?.subcategories || []

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      // Changing the category invalidates the previously chosen subcategory
      if (name === 'category') next.subcategory = ''
      return next
    })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, MAX_IMAGES - images.length)
    const valid = files.filter((file) => file.type.startsWith('image/'))
    try {
      const compressed = await Promise.all(valid.map(compressImage))
      setImages((prev) => [...prev, ...compressed])
      setErrors((prev) => ({ ...prev, images: '' }))
    } catch {
      setErrors((prev) => ({ ...prev, images: 'One of the files could not be read' }))
    }
    e.target.value = ''   // lets the user pick the same file again later
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const validate = () => {
    const newErrors = {}
    const price = Number(formData.price)
    const oldPrice = Number(formData.oldPrice)
    const stock = Number(formData.stock)

    if (formData.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters'
    if (!formData.category) newErrors.category = 'Select a category'
    if (!formData.subcategory) newErrors.subcategory = 'Select a subcategory'
    if (!formData.price || price <= 0) newErrors.price = 'Enter a valid price'
    if (formData.oldPrice !== '' && oldPrice <= price) {
      newErrors.oldPrice = 'Original price must be higher than the selling price'
    }
    if (formData.stock === '' || !Number.isInteger(stock) || stock < 0) {
      newErrors.stock = 'Enter a whole number (0 or more)'
    }
    if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    }
    if (images.length === 0) newErrors.images = 'Add at least one image'

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const price = Number(formData.price)
    const hasDiscount = formData.oldPrice !== '' && Number(formData.oldPrice) > price

    const product = {
      id: isEdit ? existing.id : Date.now(),
      title: formData.title.trim(),
      price,
      oldPrice: hasDiscount ? Number(formData.oldPrice) : undefined,
      discount: hasDiscount ? Math.round((1 - price / Number(formData.oldPrice)) * 100) : undefined,
      image: images[0],
      images,
      description: formData.description.trim(),
      stock: Number(formData.stock),
      rating: existing?.rating ?? 0,
      reviews: existing?.reviews ?? 0,
      seller: CURRENT_SELLER,
      category: formData.category,
      subcategory: formData.subcategory,
      condition: formData.condition,
    }

    dispatch(isEdit ? updateProduct(product) : addProduct(product))
    navigate('/seller/dashboard')
  }

  const inputClass = (field) =>
    `w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 bg-white ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`

  const Label = ({ children }) => (
    <label className="block text-xs sm:text-sm text-gray-700 mb-1.5">{children}</label>
  )

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

      <div className="text-xs sm:text-sm text-gray-500 mb-3">
        <Link to="/seller/dashboard" className="hover:text-orange-500">Dashboard</Link> /{' '}
        {isEdit ? 'Edit Product' : 'Add Product'}
      </div>

      <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 flex flex-col gap-5">

        {/* Title */}
        <div>
          <Label>Product Title</Label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Wireless Bluetooth Headphones"
            className={inputClass('title')}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Category + subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <select name="category" value={formData.category} onChange={handleChange} className={inputClass('category')}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label>Subcategory</Label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              disabled={!formData.category}
              className={`${inputClass('subcategory')} disabled:bg-gray-100`}
            >
              <option value="">Select subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>{sub.name}</option>
              ))}
            </select>
            {errors.subcategory && <p className="text-red-500 text-xs mt-1">{errors.subcategory}</p>}
          </div>
        </div>

        {/* Condition */}
        <div>
          <Label>Condition</Label>
          <div className="flex gap-3">
            {['new', 'used'].map((value) => (
              <label
                key={value}
                className={`flex-1 flex items-center justify-center gap-2 border rounded-md py-2 text-sm cursor-pointer capitalize transition ${
                  formData.condition === value
                    ? 'border-orange-500 bg-orange-50 text-orange-500'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value={value}
                  checked={formData.condition === value}
                  onChange={handleChange}
                  className="accent-orange-500"
                />
                {value}
              </label>
            ))}
          </div>
        </div>

        {/* Price, original price, stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Selling Price (Rs.)</Label>
            <input type="number" min="0" name="price" value={formData.price} onChange={handleChange} className={inputClass('price')} />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <Label>Original Price (optional)</Label>
            <input type="number" min="0" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className={inputClass('oldPrice')} />
            {errors.oldPrice && <p className="text-red-500 text-xs mt-1">{errors.oldPrice}</p>}
          </div>
          <div>
            <Label>Stock Quantity</Label>
            <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} className={inputClass('stock')} />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the product, its features and condition"
            className={inputClass('description')}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Images */}
        <div>
          <Label>Images (up to {MAX_IMAGES}, the first one is the main image)</Label>

          <div className="flex flex-wrap gap-3">
            {images.map((src, index) => (
              <div key={index} className="relative w-20 h-20 sm:w-24 sm:h-24">
                <img src={src} alt="" className="w-full h-full object-cover rounded-md border border-gray-200" />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-[10px] text-center rounded-b-md">
                    Main
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <label className="w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-400 cursor-pointer hover:border-orange-500 hover:text-orange-500 transition">
                <FiUploadCloud size={22} />
                <span className="text-[11px] mt-1">Upload</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
          {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 sm:flex-none bg-orange-500 text-white px-8 py-2.5 rounded-md text-sm sm:text-base font-medium hover:bg-orange-600 transition"
          >
            {isEdit ? 'Save Changes' : 'Publish Product'}
          </button>
          <Link
            to="/seller/dashboard"
            className="flex-1 sm:flex-none text-center border border-gray-300 text-gray-600 px-8 py-2.5 rounded-md text-sm sm:text-base hover:border-gray-400 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ProductForm