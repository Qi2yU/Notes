import React, { useState } from 'react'
import { NoteList, NoteQueryParams, useNotes } from '../../../../domain/note'
import { Panel } from '../../../../base/components'
import { Divider, Skeleton, Button, Modal } from 'antd'
import RankList from './components/RankList.tsx'
import { NoteHeatMap } from '../../../../domain/note'
import { Top3Count } from '../../../../domain/note'
import { useApp } from '../../../../base/hooks'
import AIAssistant from '../../../../components/ai/AIAssistant'
import SmartNoteEditor from '../../../../components/ai/SmartNoteEditor'
import { RobotOutlined } from '@ant-design/icons'

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<NoteQueryParams>({
    page: 1,
    pageSize: 10,
    sort: 'create',
    order: 'desc',
  })

  const setSearchParamsHandle = (params: NoteQueryParams) => {
    setSearchParams((prev) => ({ ...prev, ...params }))
  }

  const {
    noteList,
    pagination,
    setNoteLikeStatusHandle,
    setNoteCollectStatusHandle,
    loading,
  } = useNotes(searchParams)

  const app = useApp()

  // AI助手弹窗控制
  const [aiVisible, setAiVisible] = useState(false)
  // 智能编辑器内容
  const [editorContent, setEditorContent] = useState('')
  const [editorTags, setEditorTags] = useState<string[]>([])

  return (
    <div className="flex justify-center">
      <div className="w-[700px]">
        <Panel>
          <div className="flex items-center justify-between text-sm font-semibold text-neutral-800">
            <span>近期笔记</span>
            <Button
              type="primary"
              icon={<RobotOutlined />}
              onClick={() => setAiVisible(true)}
              size="small"
            >
              AI助手
            </Button>
          </div>
          <Divider />
          <Skeleton loading={loading}>
            <NoteList
              noteList={noteList}
              pagination={pagination}
              queryParams={searchParams}
              setQueryParams={setSearchParamsHandle}
              setNoteLikeStatusHandle={setNoteLikeStatusHandle}
              setNoteCollectStatusHandle={setNoteCollectStatusHandle}
            ></NoteList>
          </Skeleton>
        </Panel>
        {/* 智能笔记编辑器演示区 */}
        <Panel style={{ marginTop: 24 }}>
          <div className="mb-2 flex items-center text-sm font-semibold text-neutral-800">
            <RobotOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            智能笔记编辑器（AI驱动）
          </div>
          <SmartNoteEditor
            content={editorContent}
            onContentChange={setEditorContent}
            existingTags={editorTags}
            onTagsChange={setEditorTags}
          />
        </Panel>
      </div>
      <div className="ml-4 hidden w-[320px] sm:block">
        <RankList />
        {app.isLogin && (
          <Panel>
            <Top3Count />
            <NoteHeatMap />
          </Panel>
        )}
        {/* AI助手侧边栏入口 */}
        <Panel style={{ marginTop: 24 }}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-800">
              <RobotOutlined style={{ color: '#1890ff', marginRight: 6 }} />
              AI助手
            </span>
            <Button type="link" size="small" onClick={() => setAiVisible(true)}>
              打开
            </Button>
          </div>
        </Panel>
      </div>
      {/* AI助手弹窗 */}
      <Modal
        open={aiVisible}
        onCancel={() => setAiVisible(false)}
        footer={null}
        width={480}
        title={
          <span>
            <RobotOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            AI智能助手
          </span>
        }
        destroyOnClose
      >
        <AIAssistant visible={aiVisible} onClose={() => setAiVisible(false)} />
      </Modal>
    </div>
  )
}

export default HomePage
