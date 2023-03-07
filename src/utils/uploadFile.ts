import S3Upload from './s3Upload';
import _ from 'lodash';

export const uploadFile = async (body, files) => {
  return new Promise((resolve, reject) => {
    const { isMulti, uploadLocation, userId } = body;
    const uploadPath = userId+"/"+uploadLocation;
    let uploads = [];
    try {
      if (!files) {
        resolve({
          status: false,
          message: 'No file uploaded',
        });
      }
    //    else if (isMulti == 'true') {
    //     let data = [];

    //     //loop all files
    //     _.forEach(_.keysIn(files.payLoad), key => {
    //       let photo = files.payLoad[key];
    //       let promise =  S3Upload(
    //         files.payLoad[key].data,
    //         'userProducts/' + files.payLoad[key].name,key
    //       ).then(uploadResponse => {
    //         console.log('upload resposne', uploadResponse);
    //         if (uploadResponse['key']) {
    //           data[uploadResponse['key']].url = uploadResponse.url;
    //         }
    //       }).catch(err=>{console.log(err) ;
    //         reject(err)});
    //       uploads.push(promise);
    //       //push file details
    //       data.push({
    //         name: photo.name,
    //         mimetype: photo.mimetype,
    //         size: photo.size,
    //       });
    //     });
    //     Promise.all(uploads)
    //       .then(async function () {
    //         console.log("promise all",data);
    //         resolve({
    //             status: true,
    //             message: "Files are uploaded",
    //             data: data,
    //           });
    //       })
    //       .catch(function (err) {
    //         console.log(err);
    //         reject(err)
    //       });
    //     //return response
    //   }
       else if (isMulti == 'false') {
        let data = [];

        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let photo = files.payLoad;
        data.push({
          name: photo.name,
          mimetype: photo.mimetype,
          size: photo.size,
        });
        S3Upload(files.payLoad.data, uploadPath + files.payLoad.name,0).then(
          uploadResponse => {
            data[0].url = uploadResponse.url;
            data[0].uploadPath = uploadResponse.uploadPath;
            resolve({
                status: true,
                message: 'File is uploaded',
                data
            });
         })

      }
    } catch (err) {
      console.log('err', err);
      reject(err)
    }
  });
};
