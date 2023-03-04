import { each, transform, intersection } from 'lodash'

export const AUTHS_TREE = {
  id: 0,
  name: '权限树',
  children: [
    {
      id: 1,
      name: '基础管理',
      children: [
        // {
        //   id: 101,
        //   name: '人员管理',
        //   children: [
        //     {
        //       id: 10101,
        //       key: 'STU_MGT', // 叶子节点必须有key值
        //       name: '学生管理'
        //     },
        //     {
        //       id: 10102,
        //       key: 'TCH_MGT',
        //       name: '老师管理'
        //     }
        //   ]
        // },
        // {
        //   id: 102,
        //   name: '组织管理',
        //   children: [
        //     {
        //       id: 10201,
        //       key: 'SCH_MGT', // 叶子节点必须有key值
        //       name: '校区管理'
        //     },
        //     {
        //       id: 10202,
        //       key: 'CLAZZ_MGT',
        //       name: '班级管理'
        //     },
        //     {
        //       id: 10203,
        //       key: 'GROUP_MGT',
        //       name: '教研组管理'
        //     }
        //   ]
        // },
        {
          id: 101,
          key: 'SCH_MGT',
          name: '校区管理'
        },
        {
          id: 102,
          key: 'TCH_MGT',
          name: '教职工管理'
        },
        {
          id: 103,
          key: 'STU_MGT',
          name: '班级学生'
        },
        {
          id: 104,
          key: 'ROOM_MGT',
          name: '空间管理'
        }
        // {
        //   id: 104,
        //   key: 'DORM_NGT',
        //   name: '宿舍管理'
        // },
        // {
        //   id: 104,
        //   key: 'SUBJECT_MGT',
        //   name: '科目管理'
        // }
      ]
    },
    {
      id: 2,
      name: '教务管理',
      children: [
        {
          id: 201,
          key: 'EDU_TIME_MGT',
          name: '教学时间管理'
        },
        {
          id: 202,
          key: 'EDU_SEM_MGT',
          name: '学期管理'
        },
        {
          id: 203,
          key: 'EDU_SCH_MGT',
          name: '排课管理'
        },
        {
          id: 204,
          key: 'EDU_TABLE_MGT',
          name: '课表管理'
        },
        {
          id: 205,
          key: 'EDU_SZZX_TABLE_MGT',
          name: '走班课表管理'
        },
        {
          id: 206,
          name: '红旗评比',
          children: [
            {
              id: 20601,
              key: 'EDU_CLASS_RANKING_VIEW',
              name: '红旗评比查看'
            },
            {
              id: 20602,
              key: 'EDU_CLASS_RANKING_MGT',
              name: '红旗评比管理',
              sub: ['EDU_CLASS_RANKING_VIEW']
            }
          ]
        },
        {
          id: 207,
          name: '混班教学',
          key: 'EDU_MIXED_CLASS_MGT'
        },
        {
          id: 208,
          name: '微笑墙',
          children: [
            {
              id: 20801,
              key: 'EDU_SMILING_FACE_VIEW',
              name: '微笑查看'
            },
            {
              id: 20802,
              key: 'EDU_SMILING_FACE_NOTICE',
              name: '异常通知设置'
            }
          ]
        },
        {
          id: 209,
          name: '放学管理',
          key: 'EDU_AFTERSCHOOL_MGT'
        }
      ]
    },
    {
      id: 3,
      name: '考勤管理',
      children: [
        {
          id: 301,
          name: '考勤配置',
          children: [
            {
              id: 30101,
              key: 'ATT_COURSE_CONF',
              name: '课程配置'
            },
            {
              id: 30102,
              key: 'ATT_EVENT_CONF',
              name: '事件配置'
            }
          ]
        },
        {
          id: 302,
          name: '考勤数据',
          children: [
            {
              id: 30201,
              key: 'ATT_COURSE_DATA',
              name: '课程考勤'
            },
            {
              id: 30202,
              key: 'ATT_EVENT_DATA',
              name: '事件考勤'
            },
            {
              id: 30203,
              key: 'ATT_PERSON_DATA',
              name: '人员考勤'
            },
            {
              id: 30204,
              key: 'ATT_CLAZZ_EVENT_DATA',
              name: '班级事件考勤'
            }
          ]
        },
        {
          id: 303,
          key: 'SWIP_RECORD',
          name: '打卡记录'
        },
        {
          id: 304,
          name: '请假管理',
          children: [
            {
              id: 30401,
              key: 'ATT_LEAVE_SETTING',
              name: '审批流程配置'
            },
            {
              id: 30402,
              key: 'ATT_LEAVE_PERSONAL',
              name: '个人请假'
            },
            {
              id: 30403,
              key: 'ATT_LEAVE_CLAZZ',
              name: '班主任代请假'
            },
            {
              id: 30404,
              key: 'ATT_LEAVE_CLASS',
              name: '班级请假记录'
            },
            {
              id: 30405,
              key: 'ATT_LEAVE_AUDIT',
              name: '请假审批'
            }
          ]
        },
        {
          id: 305,
          name: '个人考勤',
          children: [
            {
              id: 30501,
              key: 'ATT_PERSONAL_COURSE',
              name: '个人课程考勤'
            },
            {
              id: 30502,
              key: 'ATT_PERSONAL_EVENT',
              name: '个人事件考勤'
            },
            {
              id: 30503,
              key: 'ATT_PERSONAL_SWIPE',
              name: '个人打卡记录'
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: '信发管理',
      children: [
        {
          id: 401,
          name: '内容管理',
          children: [
            {
              id: 40101,
              key: 'TPL_MGT',
              name: '模板管理'
            },
            {
              id: 40102,
              key: 'INFO_REVIEW',
              name: '内容审核'
            },
            {
              id: 40103,
              // key: 'INFO_CLAZZ_BRG', // BRG: bearing
              name: '班级相册',
              children: [
                {
                  id: 4010301,
                  key: 'INFO_CLAZZ_BRG_MGT', // BRG: bearing
                  name: '班级相册管理'
                },
                {
                  id: 4010302,
                  key: 'INFO_CLAZZ_BRG_ALL',
                  name: '班级相册全见',
                  sub: ['INFO_CLAZZ_BRG_MGT']
                }
              ]
            },
            {
              id: 40104,
              // key: 'INFO_CLAZZ_PSE',
              name: '班级动态',
              children: [
                {
                  id: 4010401,
                  key: 'INFO_CLAZZ_PSE_MGT',
                  name: '班级动态管理'
                },
                {
                  id: 4010402,
                  key: 'INFO_CLAZZ_PSE_ALL',
                  name: '班级动态全见',
                  sub: ['INFO_CLAZZ_PSE_MGT']
                }
              ]
            },
            {
              id: 40105,
              // key: 'INFO_NOTF',
              name: '通知',
              children: [
                {
                  id: 4010501,
                  key: 'INFO_NOTF_MGT',
                  name: '通知管理'
                },
                {
                  id: 4010502,
                  key: 'INFO_NOTF_ALL',
                  name: '通知全见',
                  sub: ['INFO_NOTF_MGT']
                }
              ]
            },
            {
              id: 40106,
              // key: 'INFO_WEL',
              name: '欢迎词',
              children: [
                {
                  id: 4010601,
                  key: 'INFO_WEL_MGT',
                  name: '欢迎词管理'
                },
                {
                  id: 4010602,
                  key: 'INFO_WEL_ALL',
                  name: '欢迎词全见',
                  sub: ['INFO_WEL_MGT']
                }
              ]
            },
            {
              id: 40107,
              key: 'INFO_SCH_BRG',
              name: '校园风采'
            },
            {
              id: 40108,
              key: 'INFO_SCH_PSE',
              name: '校园动态'
            },
            {
              id: 40109,
              key: 'TPL_MAKE',
              name: '制定模板'
            },
            {
              id: 40110,
              key: 'INFO_RTSP',
              name: '直播源发布'
            },
            {
              id: 40111,
              key: 'COU_WAR',
              name: '课件资源'
            },
            {
              id: 40112,
              key: 'INFO_EXAM',
              name: '考试安排'
            }
          ]
        },
        {
          id: 402,
          key: 'INFO_COR_PSE',
          name: '社团风采'
        },
        {
          id: 403,
          key: 'INFO_CANT_MENU',
          name: '食堂菜谱'
        },
        {
          id: 404,
          name: '素材管理',
          children: [
            {
              id: 40401,
              key: 'MAT_MGT',
              name: '我的素材'
            },
            {
              id: 40402,
              key: 'POSTER_MAKE',
              name: '海报制作'
            }
          ]
        }
      ]
    },
    {
      id: 5,
      name: '设备管理',
      children: [
        {
          id: 501,
          name: '电子班牌',
          children: [
            {
              id: 50101,
              key: 'BOX_MGT',
              name: '远程管理'
            },
            {
              id: 50102,
              key: 'BOX_LOG',
              name: '日志监控'
            }
          ]
        },
        {
          id: 502,
          name: 'AI感知舱',
          children: [
            {
              id: 50201,
              key: 'AI_BOX_MGT',
              name: '远程管理'
            },
            {
              id: 50202,
              key: 'AI_BOX_LOG',
              name: '日志监控'
            }
          ]
        },
        {
          id: 503,
          key: 'FACE_DB_MGT',
          name: '底库管理'
        }
      ]
    },
    {
      id: 6,
      name: '用户权限',
      children: [
        {
          id: 601,
          name: '权限管理',
          children: [
            {
              id: 60101,
              key: 'ROLE',
              name: '角色管理'
            }
          ]
        },
        {
          id: 602,
          name: '操作日志',
          key: 'OPLOG'
        }
      ]
    },
    // {
    //   id: 7,
    //   name: '预约管理',
    //   children: [
    //     {
    //       id: 701,
    //       name: '预约服务',
    //       children: [
    //         {
    //           id: 70101,
    //           key: 'RESERVE_PERSONAL',
    //           name: '个人预约'
    //         },
    //         {
    //           id: 70102,
    //           key: 'RESERVE_TEAM',
    //           name: '团队预约'
    //         },
    //         {
    //           id: 70103,
    //           key: 'RESERVE_AUDIT',
    //           name: '预约审核'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 8,
    //   name: '宿舍管理',
    //   children: [
    //     {
    //       id: 801,
    //       key: 'DORM_SITE',
    //       name: '宿舍管理'
    //     },
    //     {
    //       id: 802,
    //       key: 'DORM_PERSON',
    //       name: '人员管理'
    //     }
    //   ]
    // },
    {
      id: 10,
      name: '统计视图',
      key: 'BIG_DATA'
    },
    {
      id: 11,
      name: '考试管理',
      children: [
        {
          id: 1101,
          key: 'EXAM_MGT',
          name: '考试管理'
        },
        {
          id: 1102,
          key: 'EXAM_MTR',
          name: '考试监控'
        }
      ]
    }
  ]
}

function getLeafNodes(tree) {
  const result = []
  function iterator(_tree) {
    if (_tree.children) {
      return each(_tree.children, iterator)
    }
    result.push(_tree)
    return null
  }
  iterator(tree)
  return result
}

export const LEAF_NODES = getLeafNodes(AUTHS_TREE)

export const AUTHS_MAP = transform(LEAF_NODES, (result, value) => {
  result[value.key] = value.id
}, {})

// 是否拥有权限，authArr为数组，满足任一一个即可
export function hasAuths(authArr) {
  if (typeof authArr === 'string') {
    authArr = [authArr]
  }
  const userAuths = this.$store.state.user.auths
  const authCodes = authArr.map(o => AUTHS_MAP[o])
  const commAuths = intersection(userAuths, authCodes)
  return commAuths && commAuths.length > 0 || false
}
