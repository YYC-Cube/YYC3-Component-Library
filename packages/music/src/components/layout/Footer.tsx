import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900/80 backdrop-blur-sm border-t border-slate-800 py-4">
      <div className="container mx-auto px-4 text-center text-sm text-slate-400">
        <p className="mb-2">
          ICP备案/许可证号:{" "}
          <Link
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            豫ICP备2025106952号-1
          </Link>
        </p>
        <p className="mb-2">主办单位名称: 言语(河南)智能科技有限公司</p>
        <p>
          <Link
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41030502001022"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            豫公网安备41030502001022号
          </Link>{" "}
          /{" "}
          <Link
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41030502001024"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            豫公网安备41030502001024号
          </Link>
        </p>
      </div>
    </footer>
  )
}
