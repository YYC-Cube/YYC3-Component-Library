import { YYCard, YYCardHeader, YYCardTitle, YYCardContent } from "@yyc3/ui-enterprise/yy-card"
import { Package2, Star, Eye } from "lucide-react"

export default function ProductList() {
  const products = [
    { id: 1, name: "智能手表 Pro", price: "¥1,299", rating: 4.8, views: 1240, stock: 89 },
    { id: 2, name: "无线降噪耳机", price: "¥899", rating: 4.7, views: 980, stock: 124 },
    { id: 3, name: "超薄笔记本电脑", price: "¥6,999", rating: 4.9, views: 2150, stock: 32 },
    { id: 4, name: "智能家居套装", price: "¥2,499", rating: 4.6, views: 760, stock: 56 },
  ]

  return (
    <YYCard>
      <YYCardHeader>
        <YYCardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5" />
          热门商品
        </YYCardTitle>
      </YYCardHeader>
      <YYCardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-yy-cloud-standard/5 transition-colors"
            >
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-yy-ink-standard/70">{product.price}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4 text-yy-cloud-standard" />
                  <span>{product.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </YYCardContent>
    </YYCard>
  )
}
