/** noteService 接口需要使用 */
import { SortOrder } from '../../../base/types'
import { Author, NoteEntity, UserActions } from './types.ts'
import { QuestionSummary } from '../../question'

/**
 * 查询笔记列表查询参数
 */
export interface NoteQueryParams {
  questionId?: number
  authorId?: string
  collectionId?: number
  sort?: 'create'
  order?: SortOrder
  recentDays?: number
  page: number
  pageSize: number
}

/**
 * 返回的笔记列表
 *
 * 包含作者信息、题目信息、展示内容
 */
export type NoteWithRelations = Omit<
  NoteEntity,
  'authorId' | 'questionId' | 'updatedAt'
> & {
  needCollapsed: boolean // 是否需要折叠真实的笔记，显示展示内容
  displayContent: string // 展示内容
  author: Author // 作者相关信息
  question: QuestionSummary // 题目相关信息
  userActions: UserActions | undefined // 用户操作信息
}

/**
 * 创建笔记服务参数类型
 */
export interface CreateNoteParams {
  content: string
  questionId: number
}

/**
 * 排行榜列表类型
 */
export interface NoteRankListItem {
  userId: string
  username: string
  avatarUrl: string
  noteCount: number
  rank: number
}

/**
 * 热力图类型
 */
export interface NoteHeatMapItem {
  date: Date
  count: number
  rank: number
}

/**
 * top3 类型
 */
export interface NoteTop3Count {
  lastMonthTop3Count: number
  thisMonthTop3Count: number
}

/**
 * 下载笔记类型
 */
export interface DownloadNote {
  markdown: string
}

/**
 * ai生成笔记类型
 */
export interface AiGenerateNote {
  answer: string
}


