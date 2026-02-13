const photoInput = document.getElementById('photoInput');
const gallery = document.getElementById('gallery');
const photoCount = document.getElementById('photoCount');

let photos = JSON.parse(localStorage.getItem('valentinePhotos')) || [];
const MAX_PHOTOS = 30;

// Load existing photos on page load
loadPhotos();

photoInput.addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    
    if (photos.length + files.length > MAX_PHOTOS) {
        alert(`You can only upload up to ${MAX_PHOTOS} photos. Currently you have ${photos.length} photos.`);
        return;
    }
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const photoData = {
                    id: Date.now() + Math.random(),
                    src: event.target.result,
                    date: new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })
                };
                
                photos.push(photoData);
                savePhotos();
                addPhotoToGallery(photoData);
                updatePhotoCount();
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    photoInput.value = '';
});

function addPhotoToGallery(photoData) {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.dataset.id = photoData.id;
    
    photoCard.innerHTML = `
        <img src="${photoData.src}" alt="Valentine's photo">
        <div class="photo-info">
            <p class="photo-date">${photoData.date}</p>
            <button class="delete-btn" onclick="deletePhoto(${photoData.id})">Delete</button>
        </div>
    `;
    
    gallery.appendChild(photoCard);
}

function loadPhotos() {
    gallery.innerHTML = '';
    photos.forEach(photo => addPhotoToGallery(photo));
    updatePhotoCount();
}

function deletePhoto(id) {
    photos = photos.filter(photo => photo.id !== id);
    savePhotos();
    
    const photoCard = document.querySelector(`[data-id="${id}"]`);
    if (photoCard) {
        photoCard.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            photoCard.remove();
            updatePhotoCount();
        }, 300);
    }
}

function savePhotos() {
    localStorage.setItem('valentinePhotos', JSON.stringify(photos));
}

function updatePhotoCount() {
    photoCount.textContent = photos.length;
}
