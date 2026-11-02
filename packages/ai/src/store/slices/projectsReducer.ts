import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Project, ProjectFile, ProjectVersion, TeamMember } from '@/types/project'

// 项目管理状态接口
interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  currentFile: ProjectFile | null
  loading: boolean
  error: string | null
}

// 初始状态
const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  currentFile: null,
  loading: false,
  error: null,
}

// 创建项目管理slice
export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // 设置加载状态
    setProjectsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    // 设置错误
    setProjectsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // 设置项目列表
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload
      state.error = null
    },
    
    // 添加项目
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload)
      state.error = null
    },
    
    // 更新项目
    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const { id, updates } = action.payload
      const index = state.projects.findIndex(project => project.id === id)
      
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...updates }
        // 如果是当前项目，也更新currentProject
        if (state.currentProject?.id === id) {
          state.currentProject = { ...state.currentProject, ...updates }
        }
      }
      state.error = null
    },
    
    // 删除项目
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(project => project.id !== action.payload)
      // 如果删除的是当前项目，清空currentProject
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null
        state.currentFile = null
      }
      state.error = null
    },
    
    // 设置当前项目
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload
      // 如果切换项目，清空当前文件
      if (action.payload) {
        state.currentFile = null
      }
      state.error = null
    },
    
    // 设置当前文件
    setCurrentFile: (state, action: PayloadAction<ProjectFile | null>) => {
      state.currentFile = action.payload
    },
    
    // 添加文件
    addFile: (state, action: PayloadAction<{ projectId: string; file: ProjectFile }>) => {
      const { projectId, file } = action.payload
      const project = state.projects.find(p => p.id === projectId)
      
      if (project) {
        project.files.push(file)
        // 如果是当前项目，也更新currentProject
        if (state.currentProject?.id === projectId) {
          state.currentProject.files.push(file)
        }
      }
      state.error = null
    },
    
    // 更新文件
    updateFile: (state, action: PayloadAction<{ projectId: string; fileId: string; content: string }>) => {
      const { projectId, fileId, content } = action.payload
      const project = state.projects.find(p => p.id === projectId)
      
      if (project) {
        const file = project.files.find(f => f.id === fileId)
        if (file) {
          file.content = content
          file.lastModified = new Date().toISOString()
        }
        
        // 如果是当前项目，也更新currentProject
        if (state.currentProject?.id === projectId) {
          const currentFile = state.currentProject.files.find(f => f.id === fileId)
          if (currentFile) {
            currentFile.content = content
            currentFile.lastModified = new Date().toISOString()
          }
        }
        
        // 如果是当前文件，也更新currentFile
        if (state.currentFile?.id === fileId) {
          state.currentFile.content = content
          state.currentFile.lastModified = new Date().toISOString()
        }
      }
      state.error = null
    },
  },
})

// 导出actions
export const { 
  setProjectsLoading,
  setProjectsError,
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  setCurrentFile,
  addFile,
  updateFile
} = projectsSlice.actions

// 导出reducer
export default projectsSlice.reducer

/**
 * @file 项目管理状态
 * @description 处理项目列表、当前项目、文件操作等状态管理
 * @module store/slices/projectsReducer
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 * @updated 2024-10-15
 */
