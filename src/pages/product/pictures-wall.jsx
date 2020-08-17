import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/* 
    用于图片上传
*/

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false, //标识是否显示大图预览Modal
    previewImage: '', //大图的地址
    fileList: [
      {
        uid: '-1', //每个file都有自己唯一的ID
        name: 'image.png', //图片文件名
        status: 'done', //图片状态,uploading,remove
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      
    ],
  };

  //隐藏Modal
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    //显示指定file对应的大图
    console.log(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /* 
  file: 当前操作的图片文件(上传/删除)
  fileList: 所有已上传图片的数组 
  */
  handleChange = ({ file, fileList }) => {
    console.log('handleChange()', file, fileList)

    //一旦上传成功,将当前上传的file的信息进行修正(name,url)
    if(file.status==='done') {
      const result = file.response // {status: 0 data: {name: 'xxx', url: '图片的地址'}}
      if (result.status===0)
      message.success('上传图片成功')
    } else {
      message.error('上传图片失败')
    }

    //在操作过程中(上传/删除)更新fileList的状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/api/manage/img/upload"     /* 上传图片的接口地址 */
          accept="image/*"    /* 只接受图片格式 */
          name="image" /* 请求参数名 */
          listType="picture-card"
          fileList={fileList}   /* 所有已上传图片的列表 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

/* you can make up upload button and sample style by using stylesheets */
// .ant-upload-select-picture-card i {
//   font-size: 32px;
//   color: #999;
// }

// .ant-upload-select-picture-card .ant-upload-text {
//   margin-top: 8px;
//   color: #666;
// }