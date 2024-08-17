
import resume_images from './data/resume_images.json';



const images = {};
const loadImages = async () => {
    for (const [key, path] of Object.entries(resume_images)) {
      try {
        const module = await import(`${path}`);
        images[key] = module.default;
      } catch (error) {
        console.error(`Failed to load image at ${path}:`, error);
      }
    }
  };
loadImages();


function getImageByKey(key: string) {
  return images[key] || null;
}


export default getImageByKey;