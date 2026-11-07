import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yyc3/ui-enterprise/card"
import { Button } from "@yyc3/ui-enterprise/button"
import { ArrowRight } from "lucide-react"

export function WelcomeBanner() {
  return (
    <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-3xl">欢迎回来，店长！</CardTitle>
        <CardDescription className="text-primary-foreground/80">
          今天是个好日子，让我们一起创造更好的业绩
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary-foreground/80 mb-4">查看最新的业绩数据和智能建议</p>
          <Button variant="secondary" className="gap-2">
            进入分析 <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-6xl opacity-20">📊</div>
      </CardContent>
    </Card>
  )
}
