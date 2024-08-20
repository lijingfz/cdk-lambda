'use strict';

const Sharp = require('sharp');
const AWS = require('aws-sdk');

// 初始化S3客户端
const s3 = new AWS.S3();
// 更改原始逻辑，从 S3 直接读取原始文件进行 sharp 操作并返回 jingamz@  20240818 change set
exports.handler = (event, context, callback) => {

  const request = event.Records[0].cf.request;
  // Read the custom origin name
  console.log('jingamz!!')
  console.log(request)
  const originname = request.origin.s3.domainName;
  console.log(originname)	
  
  const parts = originname.split('.')
  const bucketName = parts[0]; // 替换成你的S3桶名称
  const objectKey = request.uri; 
  const fileformat = objectKey.substring(objectKey.lastIndexOf(".")+1)
  console.log('format',fileformat)
  console.log(bucketName);
  console.log(objectKey);

  var resizingOptions = {};
  const params = new URLSearchParams(request.querystring);
  if (!params.has('width')) {
    // if there is no width parameter, just pass the request
    console.log(" Need add width!");
    callback(null, request);
    return;
  }
  resizingOptions.width = parseInt(params.get('width'));
  
  // S3获取图片
  const s3Params = {
    Bucket: bucketName,
    Key: objectKey.slice(1),
  };
  console.log('Check object key',objectKey.slice(1))
  s3.getObject(s3Params, function(err, data) {
    if (err) {
      console.error(err);
      callback(null, request); // 错误时返回原始请求
      return;
    }
    //检查文件类型是否为jpg
    if (!objectKey.endsWith('.jpg')) {
      console.error('File is not a jpg image.');
      callback(null, request);
      return;
    }      
    try {
      // Generate a response with resized image Sharp(binary)
      Sharp(data.Body)
        .resize(resizingOptions)
        .toFormat(fileformat)
        .toBuffer()
        .then(output => {
          const base64String = output.toString('base64');
          console.log("Length of response :%s", base64String.length);
          if (base64String.length > 1048576) {
            //Resized filesize payload is greater than 1 MB.Returning original image
            console.error('Resized filesize payload is greater than 1 MB.Returning original image');
            callback(null, request);
            return;
          }

          const response = {
            status: '200',
            statusDescription: 'OK',
            headers: {
              'cache-control': [{
                key: 'Cache-Control',
                value: 'max-age=86400'
              }],
              'content-type': [{
                key: 'Content-Type',
                value: 'image/' + fileformat
              }]
            },
            bodyEncoding: 'base64',
            body: base64String
          };

          callback(null, response);
        });
    } catch (err) {
      // Image resize error
      console.error(err);
      callback(null, request);
    } 
  });
  }