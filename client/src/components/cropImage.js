// const createImage = (url) =>
//   new Promise((resolve, reject) => {
//     const image = new Image();
//     image.addEventListener('load', () => resolve(image));
//     image.addEventListener('error', (error) => reject(error));
//     image.setAttribute('crossOrigin', 'anonymous'); // To avoid cross-origin issues
//     image.src = url;
//   });

// export default async function getCroppedImg(imageSrc, pixelCrop) {
//   const image = await createImage(imageSrc);
//   const canvas = document.createElement('canvas');
//   canvas.width = pixelCrop.width;
//   canvas.height = pixelCrop.height;
//   const ctx = canvas.getContext('2d');

//   // Ensure crop dimensions are valid
//   if (!pixelCrop.width || !pixelCrop.height) {
//     return new Promise((_, reject) => {
//       reject(new Error('Invalid crop dimensions'));
//     });
//   }

//   ctx.drawImage(
//     image,
//     pixelCrop.x,
//     pixelCrop.y,
//     pixelCrop.width,
//     pixelCrop.height,
//     0,
//     0,
//     pixelCrop.width,
//     pixelCrop.height
//   );

//   // Return the cropped image as a data URL
//   return new Promise((resolve, reject) => {
//     canvas.toBlob((blob) => {
//       if (!blob) {
//         console.error('Canvas is empty');
//         reject(new Error('Canvas is empty'));
//         return;
//       }
//       const fileUrl = window.URL.createObjectURL(blob);
//       resolve(fileUrl);
//     }, 'image/jpeg');
//   });
// }


// cropImage.js
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous'); // To avoid CORS issues
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
    image.src = url;
  });

export default async function getCroppedImg(imageSrc, pixelCrop) {
  // Convert File/Blob to URL if needed
  let src = imageSrc;
  if (imageSrc instanceof File || imageSrc instanceof Blob) {
    src = URL.createObjectURL(imageSrc);
  }

  const image = await createImage(src);

  if (!pixelCrop || pixelCrop.width === 0 || pixelCrop.height === 0) {
    throw new Error('Invalid crop dimensions');
  }

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const fileUrl = URL.createObjectURL(blob);
      resolve(fileUrl);
    }, 'image/jpeg');
  });
}
