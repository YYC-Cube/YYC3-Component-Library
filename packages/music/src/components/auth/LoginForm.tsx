import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../../store/slices/authSlice'
import { Button, Input, Text, Divider, Group, Alert, Card } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { IconMail, IconEye, IconEyeOff, IconLock } from '@tabler/icons-react'

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

/**
 * 登录表单组件
 * 使用React Hook Form处理表单验证
 * 使用Redux管理登录状态
 */
export const LoginForm: React.FC = () => {
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } }
  = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const { loading = false, error = null, isAuthenticated = false } = useSelector((state: any) => state.auth || {})
  const [showPassword, setShowPassword] = React.useState(false)

  useEffect(() => {
    // 清除错误信息
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    // 登录成功后跳转到首页
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = (data: LoginFormData) => {
    dispatch(login({ email: data.email, password: data.password }))
  }

  return (
    <Card w="100%" maw={400} shadow="lg">
      <Card.Section p={6}>
        <Text size="2xl" className="text-center mb-6 font-bold">
          登录到 D-Music
        </Text>
        
        {error && (
          <Alert color="red" mb={4} variant="light">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <Input
              id="email"
              placeholder="请输入邮箱"
              leftSection={<IconMail size={18} />}
              {...register('email', {
                required: '请输入邮箱',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '请输入有效的邮箱地址'
                }
              })}
              error={errors.email ? errors.email.message : undefined}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                leftSection={<IconLock size={18} />}
              rightSection={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400"
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              }
              {...register('password', {
                required: '请输入密码',
                minLength: {
                  value: 6,
                  message: '密码长度至少为6位'
                }
              })}
              error={errors.password ? errors.password.message : undefined}
            />
          </div>

          <Group justify="space-between" mb={6}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="text-sm text-gray-600">记住我</span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => navigate('/forgot-password')}
            >
              忘记密码?
            </button>
          </Group>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
            color="blue"
          >
            登录
          </Button>
        </form>

        <Divider my={4}>
          <Text size="sm" color="gray">
            或者
          </Text>
        </Divider>

        <Group justify="center">
          <Text size="sm">
            还没有账号? 
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 ml-1"
              onClick={() => navigate('/register')}
            >
              立即注册
            </button>
          </Text>
        </Group>
      </Card.Section>
    </Card>
  )
}

export default LoginForm