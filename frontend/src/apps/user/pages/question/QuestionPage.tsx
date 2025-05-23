import React, { Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QuestionView, useQuestion } from '../../../../domain/question'
import {
  MarkdownEditor,
  MarkdownRender,
  Panel,
} from '../../../../base/components'
import { Button, message, Modal, Spin } from 'antd'
import { Upload } from '@icon-park/react'
import { EyeOutlined, FireOutlined } from '@ant-design/icons'
import { NoteList, NoteQueryParams, useNotes } from '../../../../domain/note'
import { useApp } from '../../../../base/hooks'

const QuestionPage: React.FC = () => {
  /**
   * 地址栏参数
   */
  const { questionId } = useParams()

  /**
   * 获取问题携带用户相关笔记的问题详情
   */
  const { question, userFinishedQuestion } = useQuestion(Number(questionId))

  /**
   * 笔记内容
   */
  const [value, setValue] = useState(question?.userNote.content ?? '')
  const setValueHandle = (value: string) => {
    setValue(value)
  }

  useEffect(() => {
    if (question?.userNote) {
      if (question?.userNote.finished) {
        setValueHandle(question?.userNote.content)
      }
    }
  }, [question])

  /**
   * 控制编辑器显示隐藏功能
   */
  const [isEditorVisible, setIsEditorVisible] = useState(false)
  const toggleEditorVisible = () => {
    setIsEditorVisible(!isEditorVisible)
  }

  /**
   * 写笔记 / 编辑笔记按钮点击事件
   */
  function writeOrEditButtonHandle() {
    toggleEditorVisible()
  }

  /**
   * 左侧面板内容
   * 这里是题目内容或参考资料
   */
  const [leftPanelContent, setLeftPanelContent] = useState('')
  
  /**
   * 获取和问题相关的笔记列表
   */
  const [noteQueryParams, setNoteQueryParams] = useState<NoteQueryParams>({
    page: 1,
    pageSize: 10,
    questionId: Number(questionId),
  })

  const {
    noteList,
    pagination,
    createNoteHandle,
    aiGenerateHandle,
    updateNoteHandle,
    setNoteLikeStatusHandle,
    setNoteCollectStatusHandle,
  } = useNotes(noteQueryParams)

  // AI生成笔记样例，逐字逐句平滑显示
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleAIGenerate = async () => {
    setLeftPanelContent('') // 清空旧内容
    if (!app.isLogin) {
      message.info('请先登录')
      return
    }
    
    try {
      setIsGenerating(true);
      const aicontent = await aiGenerateHandle(Number(questionId));
      
      // 逐字显示内容
      let displayedText = '';
      let index = 0;
      
      const displayInterval = setInterval(() => {
        if (index < aicontent.length) {
          displayedText += aicontent[index];
          setLeftPanelContent(displayedText);
          index++;
        } else {
          clearInterval(displayInterval);
          setIsGenerating(false); // 显示完成，恢复按钮状态
          message.success('AI笔记生成完成');
        }
      }, 30); // 每30毫秒显示一个字符
      
    } catch (error) {
      message.error('AI生成笔记失败');
      setIsGenerating(false);
    }
  }

  /**
   * 提交笔记处理事件
   */
  const [createBtnLoading, setCreateBtnLoading] = useState(false)
  
  /**
   * 用户信息
   * app 信息
   */
  const app = useApp()

  const createOrUpdateNoteClickHandle = async () => {
    if (!app.isLogin) {
      message.info('请先登录')
      return
    }

    setCreateBtnLoading(true)

    try {
      if (!question?.userNote.finished) {
        const noteId = await createNoteHandle(Number(questionId), value)
        toggleEditorVisible()
        // 校验一下 noteId
        if (noteId) {
          userFinishedQuestion(noteId, value)
        }
        message.success('笔记已提交')
      } else {
        // 修改笔记操作
        if (!question?.userNote) return
        await updateNoteHandle(question?.userNote.noteId, {
          content: value,
          questionId: Number(questionId),
        })
        message.success('笔记已修改')
        toggleEditorVisible()
      }
    } catch (e: any) {
      console.log(e.message)
      message.error(e.message)
    } finally {
      setCreateBtnLoading(false)
    }
  }

  const [isShowPreview, setIsShowPreview] = useState(false)

  return (
    <>
      <QuestionView
        question={question}
        writeOrEditButtonHandle={writeOrEditButtonHandle}
      />
      {/* 编辑器和左侧面板 */}
      {isEditorVisible && (
        <div className="relative mb-4 flex w-full justify-center">
          {/* 左侧Markdown显示框 */}
          <div className="absolute left-[calc(25%-400px)] top-0 w-[350px]">
            <div className="h-[calc(100vh-var(--header-height)-150px)] overflow-auto border border-gray-200 rounded-md bg-white shadow">
              <div className="border-b border-gray-200 p-2 bg-gray-50">
                <span className="font-medium">AI小助手</span>
                {isGenerating && (
                  <div className="flex items-center text-blue-500">
                    <Spin size="small" className="mr-1" />
                    <span className="text-xs">生成中...</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <MarkdownRender markdown={leftPanelContent} />
              </div>
            </div>
          </div>
          
          {/* 原有编辑器区域保持不变 */}
          <div className="w-[900px]">
            <div className="h-[calc(100vh-var(--header-height)-65px)]">
              <Suspense
                fallback={
                  <Spin tip="加载编辑器中" className="mt-12">
                    {''}
                  </Spin>
                }
              >
                <MarkdownEditor
                  value={value}
                  setValue={setValueHandle}
                ></MarkdownEditor>
              </Suspense>
            </div>
            <div className="sticky bottom-0 z-20 flex justify-end gap-2 border-t border-gray-200 bg-white p-4 shadow">
              <Button
                icon={<FireOutlined />}
                onClick={handleAIGenerate}
                loading={isGenerating}
                disabled={isGenerating}
              >
                {isGenerating ? 'AI生成中...' : 'AI生成笔记样例'}
              </Button>
              <Button
                icon={<EyeOutlined />}
                onClick={() => setIsShowPreview(true)}
              >
                预览笔记
              </Button>
              <Button
                type="primary"
                icon={<Upload />}
                loading={createBtnLoading}
                onClick={createOrUpdateNoteClickHandle}
              >
                {question?.userNote.finished ? '修改笔记' : '提交笔记'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* 预览框 */}
      <Modal
        open={isShowPreview}
        onCancel={() => setIsShowPreview(false)}
        footer={null}
        width={1000}
      >
        <MarkdownRender markdown={value} />
      </Modal>
      <div className="flex w-full justify-center">
        <div className="w-[700px]">
          <Panel>
            <NoteList
              showQuestion={false}
              noteList={noteList}
              pagination={pagination}
              queryParams={noteQueryParams}
              setQueryParams={setNoteQueryParams}
              setNoteLikeStatusHandle={setNoteLikeStatusHandle}
              setNoteCollectStatusHandle={setNoteCollectStatusHandle}
            />
          </Panel>
        </div>
      </div>
    </>
  )
}

export default QuestionPage
