import EnhancedEditor from "../components/enhanced-editor"
import PageBackground from "../components/page-background"
import DashboardHeader from "../components/dashboard-header"

export default function ContentCreationPage() {
  return (
    <PageBackground image="/images/bg-wave-purple.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">内容创作工作室</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              使用AI辅助创作高质量内容，支持多种格式导出、内容分析和一键发布
            </p>
          </div>

          <div className="bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg dark:bg-gray-800/90 dark:text-white">
            <EnhancedEditor />
          </div>
        </div>
      </main>
    </PageBackground>
  )
}
