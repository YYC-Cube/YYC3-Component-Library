import CreateAdmin from "@/scripts/create-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>管理员账户设置</CardTitle>
          <CardDescription>创建系统管理员账户</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAdmin />
        </CardContent>
      </Card>
    </div>
  )
}
