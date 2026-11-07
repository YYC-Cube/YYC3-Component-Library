"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApi } from "../hooks/useApi"
import { API_ENDPOINTS } from "../lib/api/endpoints"
import type { Patient } from "../services/patientService"
import { Button } from "@yyc3/ui-enterprise/button"
import { Input } from "@yyc3/ui-enterprise/input"
import { LoadingSpinner } from "@yyc3/ui-enterprise/loading-spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@yyc3/ui-enterprise/table"

export function PatientList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { data: patients, isLoading, error, get } = useApi<Patient[]>()

  useEffect(() => {
    // 初始加载患者列表
    fetchPatients()
  }, [])

  const fetchPatients = async (search?: string) => {
    await get(API_ENDPOINTS.PATIENTS.LIST, {
      params: { search },
    })
  }

  const handleSearch = () => {
    fetchPatients(searchQuery)
  }

  const handleViewPatient = (id: string) => {
    router.push(`/patients/${id}`)
  }

  if (isLoading && !patients) {
    return (
      <div className="flex justify-center p-8">
        {/* 自愈登记（T2/T3 批次）：ui LoadingSpinner 无 size prop，以 className 表达尺寸 */}
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        <p>加载患者列表时出错: {error}</p>
        <Button onClick={() => fetchPatients()} className="mt-2">
          重试
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="搜索患者姓名或病历号..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSearch}>搜索</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>姓名</TableHead>
            <TableHead>性别</TableHead>
            <TableHead>年龄</TableHead>
            <TableHead>病历号</TableHead>
            <TableHead>联系方式</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients && patients.length > 0 ? (
            patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.medicalRecordNumber}</TableCell>
                <TableCell>{patient.contactInfo}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient.id)}>
                    查看
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                {isLoading ? (
                  <div className="flex justify-center">
                    <LoadingSpinner className="h-4 w-4" />
                    <span className="ml-2">加载中...</span>
                  </div>
                ) : (
                  "没有找到患者记录"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
