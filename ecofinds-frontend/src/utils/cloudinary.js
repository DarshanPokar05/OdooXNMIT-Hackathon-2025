export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // Use default preset

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/ddvvglien/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Return placeholder image if upload fails
    return 'https://via.placeholder.com/400x300?text=Product+Image';
  }
};