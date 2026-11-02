import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserList } from "./components/user-list"
import { RoleManagement } from "./components/role-management"
import { PermissionSettings } from "./components/permission-settings"
import DashboardHeader from "../components/dashboard-header"
import PageBackground from "../components/page-background"

export default function UserManagementPage() {
  return (
    <PageBackground image="/images/bg-tech-city.jpeg">
      <DashboardHeader />

      <main className="flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">用户管理与权限控制</h1>
            <p className="mt-2 text-gray-600">管理用户账户、角色分配与功能权限</p>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto bg-white/80 backdrop-blur-sm shadow-md">
              <TabsTrigger value="users" className="py-3 px-4">
                用户管理
              </TabsTrigger>
              <TabsTrigger value="roles" className="py-3 px-4">
                角色管理
              </TabsTrigger>
              <TabsTrigger value="permissions" className="py-3 px-4">
                权限设置
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg">
              <UserList />
            </TabsContent>

            <TabsContent value="roles" className="space-y-6 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg">
              <RoleManagement />
            </TabsContent>

            <TabsContent
              value="permissions"
              className="space-y-6 bg-white/90 p-6 rounded-lg backdrop-blur-sm shadow-lg"
            >
              <PermissionSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </PageBackground>
  )
}
