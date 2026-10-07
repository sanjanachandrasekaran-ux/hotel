import { Helmet } from "react-helmet-async";
import React,{useState,useEffect} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {
  deleteHotel,
  updateHotel as updateHotelAction,
  addHotel as addHotelAction,
  fetchHotels,
  addHotelAsync,
  updateHotelAsync,
  deleteHotelAsync
} from './hotelSlice'
import api from './api'
import './App.css'

const App = () => {
  const[search,setSearch]=useState('')
  const[minPrice,setMinPrice]=useState('')
  const[maxPrice,setMaxPrice]=useState('')
  const[currentPage,setCurrentPage]=useState(1)
  const [showMessage,setShowMessage]=useState(false)
  const[editingHotel,setEditingHotel]=useState(null)
  const[hotelName,setHotelName]=useState('')
  const[hotelPrice,setHotelPrice]=useState('')
  const[hotelDescription,setHotelDescription]=useState('')
  const[hotelImage,setHotelImage]=useState('')
  const [selectedImageFile, setSelectedImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const[error,setError]=useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedRoomImage, setSelectedRoomImage] = useState('')
  const [showBooking, setShowBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
const [selectedBookingHotel, setSelectedBookingHotel] = useState('')
const [customerName, setCustomerName] = useState('')
const [customerEmail, setCustomerEmail] = useState('')
const [customerPhone, setCustomerPhone] = useState('')
const [checkIn, setCheckIn] = useState('')
const [checkOut, setCheckOut] = useState('')
const [guests, setGuests] = useState('')
const [bookingError, setBookingError] = useState('')
const [nights, setNights] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [stayType, setStayType] = useState('')
  const hotels = useSelector((state) => state.hotels.hotels)
  const loading = useSelector((state) => state.hotels.loading)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchHotels())
  }, [dispatch])

  const bookedHotel = hotels.find(
  (hotel) => hotel.name === selectedBookingHotel
)
  const deleteHotel1 = async (hotelIdentifier) => {
    try {
      await dispatch(deleteHotelAsync(hotelIdentifier)).unwrap()
      setShowMessage(true)
    } catch (err) {
      console.error("Delete failed:", err)
      dispatch(deleteHotel(hotelIdentifier))
      setShowMessage(true)
    }
  }
  const updateHotel = async () => {
      if (hotelName.trim() === '') {
    setError('Please enter hotel name')
    return
  }

  if (hotelPrice === '' || Number(hotelPrice) <= 0) {
    setError('Please enter a valid price')
    return
  }

  if (hotelDescription.trim() === '') {
    setError('Please enter hotel description')
    return
  }

  if (hotelImage === '') {
    setError('Please select a hotel image')
    return
  }
  if (latitude === '' || longitude === '') {
  setError('Please enter latitude and longitude')
  return
}
    let finalImageUrl = hotelImage
    if (selectedImageFile) {
      try {
        setUploading(true)
        const uploadRes = await api.uploadImage(selectedImageFile)
        finalImageUrl = uploadRes.url || uploadRes.filePath
      } catch (uploadErr) {
        setError('Image upload failed: ' + uploadErr.message)
        setUploading(false)
        return
      } finally {
        setUploading(false)
      }
    }

    const updatedHotel = {
      ...editingHotel,
      name: hotelName,
      title: hotelName,
      price: Number(hotelPrice),
      description: hotelDescription,
      image: finalImageUrl,
      latitude: Number(latitude),
      longitude: Number(longitude)
    }

    try {
      const identifier = editingHotel.id || editingHotel.name
      await dispatch(
        updateHotelAsync({
          identifier,
          data: updatedHotel,
          oldName: editingHotel.name
        })
      ).unwrap()
    } catch (err) {
      console.error("Update failed:", err)
      dispatch(
        updateHotelAction({
          oldName: editingHotel.name,
          updatedHotel: updatedHotel
        })
      )
    }
      
    setEditingHotel(null)
    setHotelName('')
    setHotelPrice('')
    setHotelDescription('')
    setHotelImage('')
    setSelectedImageFile(null)
    setError('')
    setLatitude('')
    setLongitude('')
  }

  const addHotel = async () => {
    if (hotelName.trim() === '') {
      setError('Please enter hotel name')
      return
    }
    if (hotelPrice === '' || Number(hotelPrice) <= 0) {
      setError('please enter hotel price')
      return
    }
    if (hotelDescription.trim() === '') {
      setError('please enter hotel description')
      return
    }
    if (hotelImage === '') {
      setError('please select a hotel image')
      return
    }
    if (latitude === '' || longitude === '') {
      setError('Please enter latitude and longitude')
      return
    }

    let finalImageUrl = hotelImage
    if (selectedImageFile) {
      try {
        setUploading(true)
        const uploadRes = await api.uploadImage(selectedImageFile)
        finalImageUrl = uploadRes.url || uploadRes.filePath
      } catch (uploadErr) {
        setError('Image upload failed: ' + uploadErr.message)
        setUploading(false)
        return
      } finally {
        setUploading(false)
      }
    }

    const newHotel = {
      name: hotelName,
      title: hotelName,
      price: Number(hotelPrice),
      description: hotelDescription,
      image: finalImageUrl,
      latitude: Number(latitude),
      longitude: Number(longitude),
      rating: 4.5,
      location: "Tamil Nadu",
      roomType: "Deluxe Room",
      offer: 10,
      suitableFor: ["Luxury", "Family"],
      amenities: ["Free Wi-Fi", "Room Service", "Free Parking"],
      roomImages: [finalImageUrl]
    }

    try {
      await dispatch(addHotelAsync(newHotel)).unwrap()
    } catch (err) {
      console.error("Add failed:", err)
      dispatch(addHotelAction(newHotel))
    }

    setHotelName('')
    setHotelPrice('')
    setHotelDescription('')
    setHotelImage('')
    setSelectedImageFile(null)
    setLatitude('')
    setLongitude('')
    setError('')
  }
          const matchedHotels = stayType
  ? hotels.filter((hotel) =>
      hotel.suitableFor?.includes(stayType)
    )
  : []
  const hotelsPerPage=3
  const filteredHotels = hotels.filter((hotel) =>{
    const matchesSearch =hotel.name.toLowerCase().includes(search.toLowerCase())
     const matchesMinPrice = minPrice===''|| hotel.price>=Number(minPrice)
     const matchesMaxPrice=maxPrice===''||hotel.price<=Number(maxPrice)
     return matchesSearch && matchesMinPrice && matchesMaxPrice
  }

   
  )
  const startIndex = (currentPage - 1)*hotelsPerPage
  const currentHotels =filteredHotels.slice(startIndex,startIndex+hotelsPerPage)
  const totalPages =Math.ceil(filteredHotels.length/hotelsPerPage)
  useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages)
  }
}, [currentPage, totalPages])
const calculateNights = () => {
  if (checkIn && checkOut) {
    const start = new Date(checkIn)
    const end = new Date(checkOut)

    const difference = end - start
    const numberOfNights = difference / (1000 * 60 * 60 * 24)

    setNights(numberOfNights)
  }
}
const confirmBooking = () => {

  if (selectedBookingHotel === '') {
    setBookingError('Please select a hotel')
    return
  }

  if (customerName.trim() === '') {
    setBookingError('Please enter customer name')
    return
  }

  if (customerEmail.trim() === '') {
    setBookingError('Please enter email')
    return
  }
 const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if (!emailPattern.test(customerEmail)) {
  setBookingError('Please enter a valid email address')
  return
}

  if (customerPhone.trim() === '') {
    setBookingError('Please enter phone number')
    return
  }
  const phonePattern = /^[0-9]{10}$/

if (!phonePattern.test(customerPhone)) {
  setBookingError('Please enter a valid 10-digit phone number')
  return
}

  if (checkIn === '') {
    setBookingError('Please select check-in date')
    return
  }

  if (checkOut === '') {
    setBookingError('Please select check-out date')
    return
  }
   if (checkOut <= checkIn) {
    setBookingError('Check-out date must be after check-in date')
    return
   }
   const start = new Date(checkIn)
const end = new Date(checkOut)

const difference = end - start
const numberOfNights = difference / (1000 * 60 * 60 * 24)

setNights(numberOfNights)
  if (guests === '') {
    setBookingError('Please enter number of guests')
    return
  }

  setBookingError('')
  setBookingSuccess(true)
}
  return (
    <div>
      <Helmet>
  <title>Velora Stay - Hotel Management</title>
  <meta
    name="description"
    content="Find and manage hotels with prices, descriptions and locations."
  />
</Helmet>

<section className="hero" id="home">
  <div className="hero-overlay">
    <p className="hero-subtitle">WELCOME TO VELORA STAY</p>

    <h1>Where Luxury Meets Comfort</h1>

    <p className="hero-text">
      Discover beautiful stays, unforgettable experiences
      and exceptional hospitality.
    </p>

    <button className="hero-button"
    onClick={()=>{
      document.getElementById("hotels").scrollIntoView({
        behavior:"smooth"
      })
    }}>
      Explore Hotels
    </button>
  </div>
</section>
         <nav className="luxury-nav">
  <div className="logo">
    VELORA <span>STAY</span>
  </div>

  <div className="nav-links">
    <a href="#home">HOME</a>
    <a href="#hotels">HOTELS</a>
    <a href="#location">LOCATION</a>
    <a href="#about">ABOUT</a>
  </div>

  <button
  className="nav-book-button"
  onClick={() => setShowBooking(true)}
>
  BOOK NOW
</button>
</nav>
<section className="stay-match" id="stay-match">

  <h2>FIND YOUR PERFECT STAY</h2>

  <p>
    Tell us what kind of experience you are looking for.
  </p>

  <div className="stay-options">

    <button onClick={() => setStayType("Nature")}>
      🌿 Nature
    </button>

    <button onClick={() => setStayType("Family")}>
      👨‍👩‍👧 Family
    </button>

    <button onClick={() => setStayType("Business")}>
      💼 Business
    </button>

    <button onClick={() => setStayType("Relaxing")}>
      🏖️ Relaxing
    </button>

    <button onClick={() => setStayType("City")}>
      🏙️ City
    </button>

    <button onClick={() => setStayType("Luxury")}>
      ✨ Luxury
    </button>

  </div>

  {stayType && (
    <p className="selected-stay">
      You selected: <strong>{stayType}</strong>
    </p>
  )}
  {stayType && (
  <div className="match-results">

    <h3>Recommended For You</h3>

    {matchedHotels.length > 0 ? (
      <div className="match-hotel-list">

        {matchedHotels.map((hotel) => (
          <div
            className="match-hotel-card"
            key={hotel.id || hotel.name}
            onClick={() => {
              setSelectedHotel(hotel)
              setSelectedRoomImage(hotel.image)
            }}
          >

            <img
              src={hotel.image}
              alt={hotel.name}
            />

            <div>
              <h4>{hotel.name}</h4>
              <p>⭐ {hotel.rating}/5</p>
              <p>📍 {hotel.location}</p>
              <p>₹{hotel.price} / day</p>
            </div>

          </div>
        ))}

      </div>
    ) : (
      <p className="no-match">
        No hotels found for this experience.
      </p>
    )}

  </div>
)}

</section>
              <section id="hotels">
                <h1 className="hotels-heading">OUR HOTELS</h1>
                <div className='search-box'>
                  <input type="text" placeholder='Search hotels...'
                  value={search}
                 onChange={(e)=>{
  setSearch(e.target.value)
  setCurrentPage(1)
}}/>
                  <input type="number" placeholder='Min Price' value={minPrice}onChange={(e)=>{
  setMinPrice(e.target.value)
  setCurrentPage(1)
} }/>
                  <input type='number' placeholder='Max Price' value={maxPrice}  onChange={(e)=>{
    setMaxPrice(e.target.value)
    setCurrentPage(1)
  }}/>
                  <button>Search</button>
                </div>
                <div className="hotel-container">
                  {loading && <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Loading hotels from database...</p>}
                  {currentHotels.map((hotel) => (
                    <div className='hotel-card' key={hotel.id || hotel.name}>
                    <img src={hotel.image} alt={hotel.name}/>
                    <h2>{hotel.name}</h2>
                    <p className="hotel-rating">
                      ⭐{hotel.rating}/5
                    </p>
                    <p className="hotel-location-name">
                       📍{hotel.location}
                    </p>
                    <p className="hotel-room-Type">
                      🛏️{hotel.roomType}
                    </p>
                    <p>{hotel.description}</p>
                    <p className="hotel-card-price">
                     ₹{hotel.price} / per day
                       </p>
                    <button onClick={()=>{setSelectedHotel(hotel)
                     setSelectedRoomImage(hotel.image)
                      console.log(hotel)
                    }
                    }>
                      View details
                       </button>
                    <button onClick={()=> deleteHotel1(hotel.id || hotel.name)}>
                      Delete
                    </button>
                    <button onClick={()=>{setEditingHotel(hotel)
                      setHotelName(hotel.name)
                      setHotelPrice(hotel.price)
                      setHotelDescription(hotel.description)
                      setHotelImage(hotel.image)
                      setSelectedImageFile(null)
                       setLatitude(hotel.latitude || '')
    setLongitude(hotel.longitude || '')
                   }}>
                      Edit
                    </button>
                    </div>

                 ))}
                    </div>
                    <div className='pagination'>
                      <button onClick={()=> setCurrentPage(currentPage -1)}
                      disabled={currentPage === 1}>
                        previous
                      </button>
                      <span>
                        page{currentPage} of {totalPages}
                      </span>
                      <button onClick={()=> setCurrentPage(currentPage+1)}
                      disabled={currentPage === totalPages}>
                        Next
                      </button>
                     </div>
                      {selectedHotel && (
  <div className="hotel-details" id ="location">

    <button
      className="close-details"
      onClick={() => setSelectedHotel(null)}
    >
      ×
    </button>

    <div className="hotel-detail-image">
      <img
        src={selectedRoomImage || selectedHotel.image}
        alt={selectedHotel.name}
        className="main-hotel-image"
      />
      <div className="room-gallery">
    {selectedHotel.roomImages?.map((image, index) => (
      <img
        key={index}
        src={image}
        alt={`${selectedHotel.name} room ${index + 1}`}
        onClick={() => setSelectedRoomImage(image)}
      />
    ))}
  </div>

      <button
        className="back-button"
        onClick={() => setSelectedHotel(null)}
      >
        ← Back to Hotels
      </button>
    </div>

    <div className="hotel-detail-info">

      <h2 className="hotel-detail-title">
        {selectedHotel.name}
      </h2>

      <p className="hotel-detail-description">
        {selectedHotel.description}
      </p>

      <h3 className="hotel-price">
        ₹ {selectedHotel.price} <span>/ per day</span>
      </h3>
      {selectedHotel.offer && (
        <p className="hotel-offer">
           🎉 {selectedHotel.offer}% OFF
        </p>
      )}
      <div className="hotel-detail-amenities">
  <h3>Amenities</h3>

  <div className="amenities-list">
    {selectedHotel.amenities?.map((amenity, index) => (
      <span key={index}>
        ✓ {amenity}
      </span>
    ))}
  </div>
</div>


      <div className="hotel-location">
        <p>📍 Latitude: {selectedHotel.latitude}</p>
        <p>📍 Longitude: {selectedHotel.longitude}</p>
      </div>

    </div>

    <div className="hotel-map">

      <div className="map-container">
        <iframe
          title="Hotel Location"
          src={`https://www.google.com/maps?q=${selectedHotel.latitude},${selectedHotel.longitude}&output=embed`}
        >
        </iframe>
      </div>

      <a
        className="map-button"
        href={`https://www.google.com/maps?q=${selectedHotel.latitude},${selectedHotel.longitude}`}
        target="_blank"
        rel="noreferrer"
      >
        📍 View on Map
      </a>

    </div>

  </div>
)}
<section className="location-section" id="location">
  <h2>OUR LOCATIONS</h2>

  <p>
    Discover comfortable stays in convenient locations
    with easy access to major attractions and facilities.
  </p>

  <div className="location-cards">
    <div>
      <h3>📍 Chennai</h3>
      <p>Hotels in the heart of Chennai.</p>
    </div>

    <div>
      <h3>📍 Coimbatore</h3>
      <p>Relaxing stays surrounded by comfort.</p>
    </div>

    <div>
      <h3>📍 Salem</h3>
      <p>Premium stays for business and leisure.</p>
    </div>
    <div>
      <h3>📍 Kerala</h3>
      <p>Comfortable stay with Relaxed place.</p>
    </div>
    <div>
      <h3>📍 Madurai</h3>
    <p>Comfortable stays near historic temples and cultural attractions.</p>
    </div>
    <div>
      <h3>📍 Pondicherry</h3>
      <p>Peaceful stays near beaches and beautiful coastal attractions.</p>
    </div>
    <div>
      <h3>📍 Ooty</h3>
      <p>Refreshing stays surrounded by scenic hills and cool weather.</p>
    </div>
    <div>
      <h3>📍 Bangalore</h3>
      <p>Luxury stays near business hubs and popular city attractions.</p>
    </div>
  </div>
</section>
<section className="about-section" id="about">
  <h2>ABOUT VELORA STAY</h2>

  <p>
    Velora Stay is a hotel management platform designed to
    help guests discover comfortable stays and manage their
    hotel bookings easily.
  </p>

  <p>
    Explore hotels, compare prices, view amenities and
    locations, and book your stay with ease.
  </p>
</section>

                      <div className="hotel-form">
                  <h2>{editingHotel ? "Edit Hotel":"Add Hotel"}</h2>
                  <input type="text" 
                  placeholder="Hotel name" 
                  value={hotelName} 
                  onChange={(e)=> setHotelName(e.target.value)}
                  />
                  <input type="number" 
                  placeholder="Price" 
                  value={hotelPrice} 
                  onChange={(e)=>setHotelPrice(e.target.value)}
                  />
                  <input
  type="number"
  step="any"
  placeholder="Latitude"
  value={latitude}
  onChange={(e) => setLatitude(e.target.value)}
/>

<input
  type="number"
  step="any"
  placeholder="Longitude"
  value={longitude}
  onChange={(e) => setLongitude(e.target.value)}
/>
                  <textarea placeholder="Description"
                   value={hotelDescription} 
                   onChange={(e)=>setHotelDescription(e.target.value)}
                   />
                   <input
                   type="file"
                   accept="image/*"
                   onChange={(e) =>{
                    const file = e.target.files[0]
                    if(file){
                      setSelectedImageFile(file)
                      setHotelImage(URL.createObjectURL(file))
                    }
                   } }/>
                   {hotelImage && (
                    <img  
                    src={hotelImage}
                    alt="Hotel preview"
                    className="image-preview"
                    />
                   )}
                   {error && (
                    <p className="error-message">
                      {error}
                    </p>
                   )}
                   <button
  type="button"
  className="preview-button"
  onClick={() => setShowPreview(true)}
>
  Preview
</button>

                    <button
                    type="button"
                    disabled={uploading}
                    onClick={editingHotel ? updateHotel : addHotel}>
                      {uploading ? "Uploading Image..." : (editingHotel ? "Update Hotel": "Add Hotel")}
                    </button>
                </div>
                {showPreview && (
  <div className="hotel-preview">
    <h2>Hotel Preview</h2>

    <div className="preview-card">

      {hotelImage && (
        <img
          src={hotelImage}
          alt="Hotel preview"
        />
      )}

      <div className="preview-info">
        <h3>{hotelName || "Hotel Name"}</h3>

        <p>
          {hotelDescription || "Hotel description"}
        </p>

        <p className="preview-price">
          ₹{hotelPrice || "0"} / per day
        </p>

        <p>📍 {latitude || "--"}, {longitude || "--"}</p>
      </div>

    </div>

    <button
      className="close-preview"
      onClick={() => setShowPreview(false)}
    >
      Back to Edit
    </button>
    <button
  className="confirm-preview"
  onClick={() => {
    addHotel()
    setShowPreview(false)
  }}
>
  Confirm & Add Hotel
</button>
  </div>
)}
               
                  
                    {showMessage && (
                      <div className='success-message'>
                        Hotel deleted successfully!
                        <button onClick={()=> setShowMessage(false)}>
                          OK
                        </button>
                      </div>
                    )}
                  </section>

                  {showBooking && (
  <div className="booking-overlay">

    <div className="booking-form">

      {!bookingSuccess ? (
        <>
          <button
            className="booking-close"
            onClick={() => setShowBooking(false)}
          >
            ×
          </button>

          <h2>Book Your Stay</h2>

          <select
            value={selectedBookingHotel}
            onChange={(e) => setSelectedBookingHotel(e.target.value)}
          >
            <option value="">Select Hotel</option>

            {hotels.map((hotel) => (
              <option key={hotel.id || hotel.name} value={hotel.name}>
                {hotel.name}
              </option>
            ))}
          </select>

          <input
  type="text"
  placeholder="Customer Name"
  value={customerName}
  onChange={(e) => {
  const value = e.target.value

  if (/^[a-zA-Z ]*$/.test(value)) {
    setCustomerName(value)
  }
} }
/>
<input
  type="email"
  placeholder="Email Address"
  value={customerEmail}
  onChange={(e) => setCustomerEmail(e.target.value)}
    
/>

<input
  type="tel"
  placeholder="Phone Number"
  value={customerPhone}
  onChange={(e) =>  {
    const value = e.target.value

    if (/^[0-9]*$/.test(value)) {
      setCustomerPhone(value)
    }
  }}
/>

<input
  type="date"
  value={checkIn}
  min={new Date().toISOString().split('T')[0]}
  onChange={(e) => setCheckIn(e.target.value)}
/>

<input
  type="date"
  value={checkOut}
  min={checkIn || new Date().toISOString().split('T')[0]}
  onChange={(e) => {setCheckOut(e.target.value)
       calculateNights()
  }}
/>

<input
  type="number"
  min="1"
  placeholder="Number of Guests"
  value={guests}
  onChange={(e) => setGuests(e.target.value)}
/>
{bookingError && (
  <p className="booking-error">
    {bookingError}
  </p>
)}
         
            <button
            className="confirm-booking"
           onClick={confirmBooking}
          >
            Confirm Booking
          </button>
        </>
      ) : (
        <div className="booking-summary">

  <p>
    <strong>Hotel:</strong> {selectedBookingHotel}
  </p>

  <p>
    <strong>Room Type:</strong> {bookedHotel?.roomType}
  </p>

  <p>
    <strong>Guests:</strong> {guests}
  </p>

  <p>
    <strong>Check-in:</strong> {checkIn}
  </p>

  <p>
    <strong>Check-out:</strong> {checkOut}
  </p>

  <p>
    <strong>Number of nights:</strong> {nights}
  </p>

  <p>
    <strong>Price per night:</strong> ₹{bookedHotel?.price}
  </p>

  <p>
    <strong>Discount:</strong> {bookedHotel?.offer || 0}%
  </p>

  <h3>
    Total Price: ₹
    {bookedHotel
      ? bookedHotel.price * nights -
        (bookedHotel.price * nights * (bookedHotel.offer || 0)) / 100
      : 0}
  </h3>

  <button 
  className="confirm-booking"
  onClick={()=>{
    setShowBooking(false)
    setBookingSuccess(false)
  }}
  >
    OK
  </button>
</div>
      )}
</div>
</div>
)}
<footer className="luxury-footer">
  <div className="footer-content">

    <div className="footer-brand">
      <h2>VELORA <span>STAY</span></h2>
      <p>
        Discover elegant stays, exceptional comfort,
        and unforgettable experiences.
      </p>
    </div>

    <div className="footer-links">
      <h3>Quick Links</h3>
      <a href="#home">Home</a>
      <a href="#hotels">Hotels</a>
      <a href="#location">Locations</a>
      <a href="#about">About</a>
    </div>

    <div className="footer-contact">
      <h3>Contact</h3>
      <p>📍 Tamil Nadu, India</p>
      <p>📞 +91 8072262663</p>
      <p>✉️ velorastay@gmail.com</p>
    </div>

    <div className="footer-social">
      <h3>Follow Us</h3>
      <div className="social-links">
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
        <a href="#">LinkedIn</a>
      </div>
    </div>

  </div>

  <div className="footer-bottom">
    <p>© 2026 Velora Stay. All Rights Reserved.</p>
    <p>Luxury stays. Memorable experiences.</p>
  </div>
</footer>
       
    </div>
  )
}

export default App
