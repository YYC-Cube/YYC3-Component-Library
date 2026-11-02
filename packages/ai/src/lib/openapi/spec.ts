/**
 * @file OpenAPI规范定义
 * @description 描述系统API的OpenAPI规范文档
 * @module lib/openapi/spec
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

/**
 * OpenAPI规范对象
 * 符合OpenAPI 3.0规范
 */
export const openAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'YYC³ Easy❤️AI API',
    description: 'YYC³ Easy❤️AI开放平台API文档，提供智能代码审查、文档生成、翻译等AI能力',
    version: '1.0.0',
    contact: {
      name: 'YYC开发团队',
      email: 'contact@yyc3.ai'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: '开发环境'
    },
    {
      url: 'https://api.yyc3.ai/v1',
      description: '生产环境'
    }
  ],
  paths: {
    '/health': {
      get: {
        summary: '健康检查',
        description: '获取系统健康状态，可用于监控系统运行情况和服务可用性',
        tags: ['系统'],
        parameters: [
          {
            name: 'detail',
            in: 'query',
            description: '是否返回详细信息，默认为true',
            required: false,
            schema: { type: 'boolean', default: true }
          }
        ],
        responses: {
          '200': {
            description: '系统状态信息',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'healthy', description: '系统状态：healthy（正常）、degraded（降级）、unhealthy（异常）' },
                        version: { type: 'string', example: '1.0.0' },
                        timestamp: { type: 'string', format: 'date-time', description: '响应时间戳' },
                        uptime: { type: 'string', example: '12h 34m 56s', description: '系统运行时间' },
                        memory: {
                          type: 'object',
                          properties: {
                            rss: { type: 'string', example: '128.5 MB', description: '物理内存使用量' },
                            heapUsed: { type: 'string', example: '96.2 MB', description: '堆内存使用量' },
                            heapTotal: { type: 'string', example: '128.0 MB', description: '堆内存总量' }
                          }
                        },
                        services: {
                          type: 'object',
                          properties: {
                            database: {
                              type: 'object',
                              properties: {
                                status: { type: 'string', example: 'healthy', description: '数据库服务状态' },
                                latency: { type: 'number', example: 25, description: '数据库响应延迟（ms）' }
                              }
                            },
                            cache: {
                              type: 'object',
                              properties: {
                                status: { type: 'string', example: 'healthy', description: '缓存服务状态' },
                                latency: { type: 'number', example: 10, description: '缓存响应延迟（ms）' }
                              }
                            },
                            auth: {
                              type: 'object',
                              properties: {
                                status: { type: 'string', example: 'healthy', description: '认证服务状态' },
                                latency: { type: 'number', example: 20, description: '认证服务响应延迟（ms）' }
                              }
                            }
                          }
                        }
                      }
                    },
                    message: { type: 'string', example: '系统运行正常' }
                  }
                },
                example: {
                  "success": true,
                  "data": {
                    "status": "healthy",
                    "version": "1.0.0",
                    "timestamp": "2024-10-15T10:30:00Z",
                    "uptime": "12h 34m 56s",
                    "memory": {
                      "rss": "128.5 MB",
                      "heapUsed": "96.2 MB",
                      "heapTotal": "128.0 MB"
                    },
                    "services": {
                      "database": { "status": "healthy", "latency": 25 },
                      "cache": { "status": "healthy", "latency": 10 },
                      "auth": { "status": "healthy", "latency": 20 }
                    }
                  },
                  "message": "系统运行正常"
                }
              }
            }
          },
          '500': {
            description: '服务不可用',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'HEALTH_CHECK_FAILED', description: '错误代码' },
                    message: { type: 'string', example: '系统状态未知', description: '错误描述' }
                  }
                },
                example: {
                  "success": false,
                  "error": "HEALTH_CHECK_FAILED",
                  "message": "系统状态未知"
                }
              }
            }
          }
        }
      }
    },
    '/tools': {
      get: {
        summary: '获取工具列表',
        description: '获取所有可用工具或根据条件过滤工具，支持按工具ID、分类或关键词搜索',
        tags: ['工具'],
        parameters: [
          {
            name: 'id',
            in: 'query',
            description: '工具ID，指定此参数时返回单个工具详情',
            required: false,
            schema: { type: 'string', example: 'code-review' }
          },
          {
            name: 'category',
            in: 'query',
            description: '工具分类，过滤特定分类的工具',
            required: false,
            schema: {
              type: 'string',
              enum: ['development', 'content', 'translation', 'analysis', 'other']
            },
            example: 'development'
          },
          {
            name: 'search',
            in: 'query',
            description: '搜索关键词，根据名称或描述搜索工具',
            required: false,
            schema: { type: 'string', example: '代码' }
          },
          {
            name: 'page',
            in: 'query',
            description: '分页页码，从1开始',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: '每页返回数量',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 }
          }
        ],
        responses: {
          '200': {
            description: '工具列表或单个工具信息',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      oneOf: [
                        {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', example: 'code-review', description: '工具唯一标识符' },
                              name: { type: 'string', example: '智能代码审查', description: '工具名称' },
                              category: { type: 'string', example: 'development', description: '工具分类' },
                              description: { type: 'string', example: 'AI驱动的代码质量分析工具', description: '工具详细描述' },
                              icon: { type: 'string', example: 'code', description: '工具图标标识' },
                              tags: { type: 'array', items: { type: 'string' }, description: '工具标签列表' },
                              parameters: { 
                                type: 'array', 
                                items: {
                                  type: 'object',
                                  properties: {
                                    name: { type: 'string', description: '参数名称' },
                                    type: { type: 'string', description: '参数类型' },
                                    required: { type: 'boolean', description: '是否必填' },
                                    description: { type: 'string', description: '参数描述' }
                                  }
                                },
                                description: '工具参数列表'
                              }
                            }
                          }
                        },
                        {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'code-review', description: '工具唯一标识符' },
                            name: { type: 'string', example: '智能代码审查', description: '工具名称' },
                            category: { type: 'string', example: 'development', description: '工具分类' },
                            description: { type: 'string', example: 'AI驱动的代码质量分析工具', description: '工具详细描述' },
                            icon: { type: 'string', example: 'code', description: '工具图标标识' },
                            tags: { type: 'array', items: { type: 'string' }, description: '工具标签列表' },
                            parameters: { 
                              type: 'array', 
                              items: {
                                type: 'object',
                                properties: {
                                  name: { type: 'string', description: '参数名称' },
                                  type: { type: 'string', description: '参数类型' },
                                  required: { type: 'boolean', description: '是否必填' },
                                  description: { type: 'string', description: '参数描述' }
                                }
                              },
                              description: '工具参数列表'
                            },
                            usageExample: { type: 'string', description: '使用示例' }
                          }
                        }
                      ]
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 20 },
                        total: { type: 'integer', example: 50 },
                        totalPages: { type: 'integer', example: 3 }
                      },
                      description: '分页信息，当返回列表时包含'
                    }
                  }
                },
                examples: {
                  'singleTool': {
                    value: {
                      "success": true,
                      "data": {
                        "id": "code-review",
                        "name": "智能代码审查",
                        "category": "development",
                        "description": "AI驱动的代码质量分析工具",
                        "icon": "code",
                        "tags": ["代码质量", "安全性", "性能优化"],
                        "parameters": [
                          {
                            "name": "code",
                            "type": "string",
                            "required": true,
                            "description": "需要审查的代码内容"
                          },
                          {
                            "name": "language",
                            "type": "string",
                            "required": false,
                            "description": "代码编程语言"
                          },
                          {
                            "name": "focus",
                            "type": "string",
                            "required": false,
                            "description": "审查重点：security, performance, style"
                          }
                        ],
                        "usageExample": "调用智能代码审查工具分析JavaScript代码质量"
                      }
                    }
                  },
                  'toolList': {
                    value: {
                      "success": true,
                      "data": [
                        {
                          "id": "code-review",
                          "name": "智能代码审查",
                          "category": "development",
                          "description": "AI驱动的代码质量分析工具",
                          "icon": "code",
                          "tags": ["代码质量", "安全性", "性能优化"]
                        },
                        {
                          "id": "doc-generator",
                          "name": "文档生成器",
                          "category": "content",
                          "description": "自动生成技术文档",
                          "icon": "file-text",
                          "tags": ["文档", "自动生成"]
                        }
                      ],
                      "pagination": {
                        "page": 1,
                        "limit": 20,
                        "total": 50,
                        "totalPages": 3
                      }
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: '工具不存在',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '工具不存在' }
                  }
                }
              }
            }
          },
          '500': {
            description: '服务器错误',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '获取工具列表失败' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '执行工具',
        description: '调用特定工具并返回执行结果',
        tags: ['工具'],
        security: [
          {
            ApiKeyAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['toolId'],
                properties: {
                  toolId: { type: 'string', example: 'code-review' },
                  parameters: {
                    type: 'object',
                    description: '工具执行参数',
                    additionalProperties: true
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '工具执行结果',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        toolId: { type: 'string', example: 'code-review' },
                        output: { type: 'string', example: '工具 智能代码审查 执行成功' },
                        parameters: { type: 'object' },
                        timestamp: { type: 'string', format: 'date-time' }
                      }
                    },
                    message: { type: 'string', example: '工具执行成功' }
                  }
                }
              }
            }
          },
          '400': {
            description: '请求参数错误',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '缺少工具ID' },
                    message: { type: 'string', example: '参数错误' }
                  }
                }
              }
            }
          },
          '401': {
            description: '未授权访问',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '未授权访问' },
                    message: { type: 'string', example: '请提供有效的API密钥' }
                  }
                }
              }
            }
          },
          '403': {
            description: '权限不足',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '权限不足' },
                    message: { type: 'string', example: '您没有权限执行此操作' }
                  }
                }
              }
            }
          },
          '404': {
            description: '工具不存在',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '工具不存在' },
                    message: { type: 'string', example: '工具未找到' }
                  }
                }
              }
            }
          },
          '500': {
            description: '服务器错误',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '执行工具失败' },
                    message: { type: 'string', example: '服务器内部错误' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        summary: '用户注册',
        description: '注册新用户账号',
        tags: ['认证'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username', 'email', 'password'],
                properties: {
                  username: { type: 'string', example: 'testuser' },
                  email: { type: 'string', format: 'email', example: 'test@example.com' },
                  password: { type: 'string', minLength: 8, example: 'Password123!' },
                  name: { type: 'string', example: '测试用户' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: '注册成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                            name: { type: 'string' },
                            role: { type: 'string' }
                          }
                        },
                        token: { type: 'string' }
                      }
                    },
                    message: { type: 'string', example: '注册成功' }
                  }
                }
              }
            }
          },
          '400': {
            description: '请求参数错误',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '参数错误' },
                    message: { type: 'string', example: '请检查输入信息' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: '用户登录',
        description: '用户登录获取访问令牌',
        tags: ['认证'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'test@example.com' },
                  password: { type: 'string', example: 'Password123!' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '登录成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                            name: { type: 'string' },
                            role: { type: 'string' }
                          }
                        },
                        token: { type: 'string' }
                      }
                    },
                    message: { type: 'string', example: '登录成功' }
                  }
                }
              }
            }
          },
          '401': {
            description: '认证失败',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: '认证失败' },
                    message: { type: 'string', example: '邮箱或密码错误' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api-keys': {
      get: {
        summary: '获取API密钥列表',
        description: '获取当前用户的所有API密钥信息',
        tags: ['API密钥'],
        security: [
          {
            ApiKeyAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'API密钥列表',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', description: 'API密钥ID' },
                          name: { type: 'string', example: '我的API密钥', description: 'API密钥名称' },
                          key: { type: 'string', example: 'sk_abc123def456', description: 'API密钥，部分隐藏显示' },
                          createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
                          expiresAt: { type: 'string', format: 'date-time', description: '过期时间' },
                          isActive: { type: 'boolean', example: true, description: '是否激活' },
                          permissions: { type: 'array', items: { type: 'string' }, description: '权限列表' },
                          usage: {
                            type: 'object',
                            properties: {
                              totalCalls: { type: 'number', example: 150, description: '总调用次数' },
                              lastUsed: { type: 'string', format: 'date-time', description: '最后使用时间' }
                            },
                            description: '使用统计'
                          }
                        }
                      }
                    }
                  }
                },
                example: {
                  "success": true,
                  "data": [
                    {
                      "id": "key_123",
                      "name": "我的API密钥",
                      "key": "sk_abc123def456",
                      "createdAt": "2024-10-01T10:00:00Z",
                      "expiresAt": "2024-12-31T23:59:59Z",
                      "isActive": true,
                      "permissions": ["tool:code-review:use", "tool:translation:use"],
                      "usage": {
                        "totalCalls": 150,
                        "lastUsed": "2024-10-14T15:30:00Z"
                      }
                    }
                  ]
                }
              }
            }
          },
          '401': {
            description: '未授权访问',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'UNAUTHORIZED', description: '错误代码' },
                    message: { type: 'string', example: '未授权访问，请提供有效的认证信息', description: '错误描述' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: '创建API密钥',
        description: '为当前用户创建新的API密钥，可设置名称、权限和过期时间',
        tags: ['API密钥'],
        security: [
          {
            ApiKeyAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'permissions'],
                properties: {
                  name: { type: 'string', example: '我的API密钥', description: 'API密钥名称，用于标识密钥用途' },
                  permissions: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['tool:code-review:use', 'tool:translation:use'],
                    description: '权限列表，格式为：资源:操作'
                  },
                  expiresAt: { 
                    type: 'string', 
                    format: 'date-time', 
                    description: '过期时间，可选，不设置则默认永不过期' 
                  }
                }
              },
              example: {
                "name": "开发测试密钥",
                "permissions": ["tool:code-review:use", "tool:doc-generator:use"],
                "expiresAt": "2024-12-31T23:59:59Z"
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'API密钥创建成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', description: 'API密钥ID' },
                        name: { type: 'string', description: 'API密钥名称' },
                        key: { type: 'string', description: '完整API密钥，请妥善保存' },
                        createdAt: { type: 'string', format: 'date-time', description: '创建时间' },
                        expiresAt: { type: 'string', format: 'date-time', description: '过期时间' },
                        isActive: { type: 'boolean', example: true, description: '是否激活' },
                        permissions: { type: 'array', items: { type: 'string' }, description: '权限列表' }
                      }
                    },
                    message: { type: 'string', example: 'API密钥创建成功' }
                  }
                },
                example: {
                  "success": true,
                  "data": {
                    "id": "key_456",
                    "name": "开发测试密钥",
                    "key": "sk_def456ghi789jkl012mno345pqr678stu901",
                    "createdAt": "2024-10-15T10:00:00Z",
                    "expiresAt": "2024-12-31T23:59:59Z",
                    "isActive": true,
                    "permissions": ["tool:code-review:use", "tool:doc-generator:use"]
                  },
                  "message": "API密钥创建成功，请妥善保存密钥"
                }
              }
            }
          },
          '400': {
            description: '请求参数错误',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'INVALID_PARAMS', description: '错误代码' },
                    message: { type: 'string', example: '参数错误', description: '错误描述' },
                    details: { type: 'array', items: { type: 'string' }, description: '详细错误信息' }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        summary: '删除API密钥',
        description: '删除指定的API密钥，删除后该密钥将无法使用',
        tags: ['API密钥'],
        security: [
          {
            ApiKeyAuth: []
          }
        ],
        parameters: [
          {
            name: 'id',
            in: 'query',
            description: 'API密钥ID',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'API密钥删除成功',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'API密钥删除成功' }
                  }
                },
                example: {
                  "success": true,
                  "message": "API密钥删除成功"
                }
              }
            }
          },
          '404': {
            description: 'API密钥不存在',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'KEY_NOT_FOUND', description: '错误代码' },
                    message: { type: 'string', example: 'API密钥不存在', description: '错误描述' }
                  }
                }
              }
            }
          }
        }
      }
    }
    }
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API密钥认证'
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT令牌认证'
      }
    }
  },
  // 安全认证机制
  security: [
    {
      ApiKeyAuth: []
    }
  ],

  // 安全模式定义
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API密钥认证方式，用于访问所有受保护的API端点。开发者需要在每个请求的请求头中提供有效的API密钥。'
      }
    },
    schemas: {
      ApiKeyBase: {
        type: 'object',
        required: ['name', 'permissions', 'expiresAt'],
        properties: {
          name: {
            type: 'string',
            description: 'API密钥名称，用于标识和管理密钥',
            minLength: 3,
            maxLength: 50
          },
          permissions: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'read:tools',
                'write:tools',
                'read:api-keys',
                'write:api-keys',
                'admin'
              ]
            },
            description: 'API密钥权限列表，定义密钥可以执行的操作'
          },
          expiresAt: {
            type: 'string',
            format: 'date-time',
            description: 'API密钥过期时间，过期后密钥将不再有效'
          }
        }
      },
      ApiKey: {
        allOf: [
          { $ref: '#/components/schemas/ApiKeyBase' },
          {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'API密钥唯一标识符'
              },
              ownerId: {
                type: 'string',
                description: 'API密钥所有者ID'
              },
              key: {
                type: 'string',
                description: 'API密钥值，仅在创建时返回',
                nullable: true
              },
              active: {
                type: 'boolean',
                description: 'API密钥是否激活'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'API密钥创建时间'
              },
              usageCount: {
                type: 'integer',
                description: 'API密钥使用次数'
              }
            }
          }
        ]
      },
      ApiKeyCreate: {
        allOf: [
          { $ref: '#/components/schemas/ApiKeyBase' }
        ]
      },
      ApiKeyUpdate: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'API密钥名称，用于标识和管理密钥',
            minLength: 3,
            maxLength: 50
          },
          active: {
            type: 'boolean',
            description: 'API密钥是否激活'
          },
          expiresAt: {
            type: 'string',
            format: 'date-time',
            description: 'API密钥过期时间，过期后密钥将不再有效'
          },
          permissions: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'read:tools',
                'write:tools',
                'read:api-keys',
                'write:api-keys',
                'admin'
              ]
            },
            description: 'API密钥权限列表，定义密钥可以执行的操作'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        required: ['error', 'message'],
        properties: {
          error: {
            type: 'string',
            description: '错误类型标识符'
          },
          message: {
            type: 'string',
            description: '错误详细信息'
          },
          code: {
            type: 'integer',
            description: '错误代码'
          }
        }
      }
    }
  },

  // API标签定义
  tags: [
    {
      name: '系统信息',
      description: '系统健康检查和状态监控相关API'
    },
    {
      name: '工具',
      description: 'AI工具管理和调用相关API'
    },
    {
      name: 'API密钥',
      description: 'API密钥创建、管理和权限控制相关API'
    }
  ]
};

/**
 * 导出OpenAPI规范为JSON字符串
 */
export function getOpenAPISpecJson(): string {
  return JSON.stringify(openAPISpec, null, 2);
}