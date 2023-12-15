export function renderImage(imageData : Buffer){
    const imageBlob = new Blob([Buffer.from(imageData)]); 
    const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl
}

