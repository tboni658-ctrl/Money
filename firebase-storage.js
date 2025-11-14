// Firebase Storage Service
class FirebaseStorageService {
  constructor() {
    this.storage = null;
    this.initialized = false;
  }
  
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Import Firebase Storage
      const { getStorage } = await import('https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js');
      
      // Get storage instance from Firebase app
      if (window.firebaseService && window.firebaseService.getApp()) {
        this.storage = getStorage(window.firebaseService.getApp());
        this.initialized = true;
        
        console.log('✅ Firebase Storage initialized!');
        return true;
      } else {
        console.error('❌ Firebase app not initialized');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Storage:', error);
      return false;
    }
  }
  
  // Upload image file
  async uploadImage(file, productId) {
    if (!this.initialized) {
      console.log('⚠️ Firebase Storage not initialized');
      return null;
    }
    
    try {
      const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js');
      
      // Create storage reference
      const storageRef = ref(this.storage, `products/${productId}_${Date.now()}_${file.name}`);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('✅ Image uploaded:', snapshot);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ Download URL:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      return null;
    }
  }
  
  // Delete image
  async deleteImage(imageUrl) {
    if (!this.initialized) return false;
    
    try {
      const { ref, deleteObject } = await import('https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js');
      
      // Extract file path from URL
      const httpsReference = ref(this.storage, imageUrl);
      await deleteObject(httpsReference);
      
      console.log('✅ Image deleted:', imageUrl);
      return true;
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      return false;
    }
  }
  
  isInitialized() {
    return this.initialized;
  }
}

// Export singleton instance
window.firebaseStorageService = new FirebaseStorageService();
