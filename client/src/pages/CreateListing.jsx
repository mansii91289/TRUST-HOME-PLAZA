
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    imageUrls: [],
  });

const getImageUrl = (url) => {
  if (!url) return 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg';
  
  if (url.startsWith('http')) {
    return url;
  }
  if (url.startsWith('/uploads/listings/')) {
    return `${window.location.origin}${url}`;
  }
  if (url.startsWith('/uploads')) {
    return `${window.location.origin}${url}`;
  }
  return url;
};

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setImageUploadError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }
    
    // Validate file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setImageUploadError('Images must be less than 5MB each');
      return;
    }
    
    setFiles(selectedFiles);
    setImageUploadError(false);
  };

 const handleImageSubmit = async (e) => {
  e.preventDefault();
  
  // If no files selected but we need images, use defaults
  if ((!files || files.length === 0) && formData.imageUrls.length === 0) {
    console.log('No images selected, using default images');
    
    // Use default image URLs
    const defaultImageUrls = [
      '/uploads/listings/house1.jpg',
      '/uploads/listings/house11.jpg',
      '/uploads/listings/house111.jpg'
    ];
    
    setFormData({
      ...formData,
      imageUrls: defaultImageUrls
    });
    
    setImageUploadError(false);
    return;
  }
  
  if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
    setUploading(true);
    setImageUploadError(false);

    const uploadFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadFormData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/listing/upload-images', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(data.imageUrls),
        });
        setImageUploadError(false);
        document.getElementById('images').value = '';
        setFiles([]);
      } else {
        // If upload fails, use default images
        console.log('Upload failed, using default images:', data.message);
        useDefaultImages();
      }
    } catch (error) {
      console.error('Upload error, using default images:', error);
      useDefaultImages();
    }

    setUploading(false);
  } else {
    setImageUploadError('You can only upload 6 images per listing');
    setUploading(false);
  }
};

// Helper function to use default images
const useDefaultImages = () => {
  const defaultImageUrls = [
    'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da835d3?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1594736797933-d0401ba2a65a?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=800&auto=format&fit=crop&q=60'
  ];
  
  setFormData({
    ...formData,
    imageUrls: formData.imageUrls.length > 0 ? formData.imageUrls : defaultImageUrls
  });
  setImageUploadError('images');
};
  const handleRemoveImage = (url) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((image) => image !== url),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // If no images, use defaults
  if (formData.imageUrls.length < 1) {
    console.log('No images, Images');
    const defaultImageUrls = [
      '/uploads/listings/house1.jpg',
      '/uploads/listings/house11.jpg',
      '/uploads/listings/house111.jpg'
    ];
    
    setFormData({
      ...formData,
      imageUrls: defaultImageUrls
    });
    
    // Continue with submission after setting defaults
    setTimeout(() => {
      handleSubmit(e); // Recursive call with updated formData
    }, 100);
    return;
  }
  
  if (+formData.regularPrice < +formData.discountPrice) {
    return setError('Discount price must be less than regular price');
  }
  
  setError(false);
  setLoading(true);

  try {
    const res = await fetch('/api/listing/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        userRef: currentUser._id,
      }),
    });
    
    const data = await res.json();
    if (data.success === false) {
      setError(data.message);
      setLoading(false);
      return;
    }
    
    setLoading(false);
    navigate(`/listing/${data._id}`);
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }
};
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
       <div className='flex flex-col flex-1 gap-4'>
  <p className='font-semibold'>
    Images:
    <span className='font-normal text-gray-600 ml-2'>
      The first image will be the cover (max 6)
    </span>
  </p>
  
  <div className='flex gap-4 items-center'>
    <input
      onChange={handleImageChange}
      className='p-3 border border-gray-300 rounded w-full'
      type='file'
      id='images'
      accept='image/jpeg,image/png,image/webp'
      multiple
    />
    <button
      type='button'
      disabled={uploading || files.length === 0}
      onClick={handleImageSubmit}
      className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
    >
      {uploading ? 'Uploading...' : 'Upload'}
    </button>
  </div>

  {/* Add button to use default images */}
  <button
    type='button'
    onClick={useDefaultImages}
    className='p-3 text-blue-700 border border-blue-700 rounded uppercase hover:shadow-lg'
  >
  Images
  </button>

  <p className='text-red-700 text-sm'>
    {imageUploadError ? imageUploadError : ''}
  </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center rounded-lg'
              >
                <img
                  src={getImageUrl(url)}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                  onError={(e) => {
                    console.log('Image failed to load:', url);
                    e.target.src = 'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg';
                  }}
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(url)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create listing'}
          </button>
          {error && <p className='text-red-500 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}