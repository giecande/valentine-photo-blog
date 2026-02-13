let isAdmin = false;
let adminPassword = '';

const photoInput = document.getElementById('photoInput');
const gallery = document.getElementById('gallery');
const uploadSection = document.getElementById('uploadSection');
const adminBtn = document.getElementById('adminBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const closeModal = document.querySelector('.close');

// Load photos on page load
loadPhotos();

// Admin login modal
adminBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    passwordInput.value = '';
    loginError.textContent = '';
});

closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

loginBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    
    // Test password by trying to get photos
    fetch('/api/photos', {
        headers: {
            'x-admin-password': password
        }
    }).then(() => {
        adminPassword = password;
        isAdmin = true;
        uploadSection.style.display = 'block';
        adminBtn.style.display = 'none';
        loginModal.style.display = 'none';
        loginError.textContent = '';
    }).catch(() => {
        loginError.textContent = 'Invalid password';
    });
});

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loginBtn.click();
    }
});

logoutBtn.addEventListener('click', () => {
    isAdmin = false;
    adminPassword = '';
    uploadSection.style.display = 'none';
    adminBtn.style.display = 'inline-block';
});

// Photo upload
photoInput.addEventListener('change', async function(e) {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const formData = new FormData();
    files.forEach(file => {
        formData.append('photos', file);
    });
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'x-admin-password': adminPassword
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const data = await response.json();
        alert(`Successfully uploaded ${data.files.length} photo(s)!`);
        loadPhotos();
    } catch (error) {
        alert('Error uploading photos: ' + error.message);
    }
    
    photoInput.value = '';
});

async function loadPhotos() {
    try {
        const response = await fetch('/api/photos');
        const photos = await response.json();
        
        gallery.innerHTML = '';
        
        if (photos.length === 0) {
            gallery.innerHTML = '<p class="no-photos">No photos yet. Admin can upload photos!</p>';
            return;
        }
        
        photos.forEach(photo => {
            addPhotoToGallery(photo);
        });
    } catch (error) {
        gallery.innerHTML = '<p class="error">Error loading photos</p>';
    }
}

function addPhotoToGallery(photo) {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    
    const date = new Date(photo.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    photoCard.innerHTML = `
        <img src="${photo.url}" alt="Valentine's photo" loading="lazy">
        <div class="photo-info">
            <p class="photo-date">${date}</p>
            ${isAdmin ? `<button class="delete-btn" onclick="deletePhoto('${photo.filename}')">Delete</button>` : ''}
        </div>
    `;
    
    gallery.appendChild(photoCard);
}

async function deletePhoto(filename) {
    if (!confirm('Are you sure you want to delete this photo?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/photos/${filename}`, {
            method: 'DELETE',
            headers: {
                'x-admin-password': adminPassword
            }
        });
        
        if (!response.ok) {
            throw new Error('Delete failed');
        }
        
        loadPhotos();
    } catch (error) {
        alert('Error deleting photo: ' + error.message);
    }
}
