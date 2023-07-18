const { AppError } = require('../lib/index');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configuration 

cloudinary.config({
  cloud_name : process.env.CLOUDNAIRY_CLOUD_NAME,
  api_key :    process.env.CLOUDNAIRY_API_KEY,
  api_secret : process.env.CLOUDNAIRY_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary : cloudinary,
  params :     {
    folder : 'user-images'
    },
    public_id : async (req, file) => {
      const myFileName = `${Date.now()}-${file.originalname.split('.')[0]}`;
      return myFileName;
    },
    
});

const upload = multer({
  storage,
  limits : {
    fileSize : 1024 * 1024 * 0.5 * 10, // 5MB
  },
  fileFilter : function (req, file, cb) {   
      if (!['png', 'jpg', 'jpeg'].includes(file.mimetype.split('/')[1])) {
        return cb(new AppError('Only images are allowed', 400), null);
      }
      return cb(null, true);
    }
  });

  const deleteImageByUrl = async (imageUrl) => {
    const publicId = cloudinary.utils.extractPublicId(imageUrl);
    cloudinary.uploader.destroy(publicId, function(err, result) { console.log(result) });
  }
const removeImage = async(url) =>{
  if(url === 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png') return;
  cloudinary.uploader.destroy(url, { resource_type : 'image'})
}


module.exports = { upload, removeImage, deleteImageByUrl};
