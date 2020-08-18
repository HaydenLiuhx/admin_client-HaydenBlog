import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(), //创建了一个没有内容的编辑对象
    }

    //ref:https://jpuri.github.io/react-draft-wysiwyg/#/docs
    constructor(props) {
        super(props);
        const html = this.props.detail
        if (html) { //如果有值,根据html格式创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html);
            if (contentBlock) { //判断块
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            } else {
                this.state = {
                    editorState: EditorState.createEmpty(), //创建了一个没有内容的编辑对象
                }
            }
        }
    }

    /* 
    传入过程中实时回调
    */
    //onEditorStateChange: Function = (editorState) => {
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        //返回html格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    //改成箭头函数
    uploadImageCallBack= (file) => {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/manage/img/upload');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText);
              const url = response.data.url //得到url
              resolve({data: {link: url}})
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{ border: '1px solid black', minHeight: 300, paddingLeft: 7 }}
                    //   wrapperClassName="demo-wrapper"
                    //   editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                      }}
                />
                {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
            </div>
        );
    }
}