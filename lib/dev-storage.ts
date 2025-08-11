// Временное хранилище для разработки (очищается при перезапуске)
interface DevUser {
  id: number
  name: string
  email: string
  password_hash: string
  role: "student" | "teacher" | "director" | "admin"
  school_id?: number
  class_id?: number
  grade?: string
  points: number
  level: number
  badges: string[]
  created_at: string
  school_name?: string
}

interface DevSchool {
  id: number
  name: string
  address?: string
  director_id?: number
  total_classes: number
  created_at: string
  director_name?: string
  description?: string
}

interface DevClass {
  id: number
  name: string
  grade: string
  school_id: number
  teacher_id?: number
  student_count: number
  capacity: number
  created_at: string
}

interface DevEcoAction {
  id: number
  name: string
  description?: string
  points: number
  category?: string
  icon?: string
  unit?: string
  created_at: string
}

interface DevUserAction {
  id: number
  user_id: number
  action_id: number
  quantity: number
  points_earned: number
  description?: string
  photo_url?: string
  status: "pending" | "approved" | "rejected"
  reviewed_by?: number
  reviewed_at?: string
  created_at: string
}

interface DevChallenge {
  id: number
  title: string
  description?: string
  target_value: number
  points_reward: number
  start_date: string
  end_date: string
  challenge_type: string
  school_id?: number
  created_by?: number
  created_at: string
}

interface DevTeacherInvite {
  id: number
  name: string
  email: string
  subject: string
  school_id: number
  invited_by: number
  status: "pending" | "accepted" | "declined"
  created_at: string
}

// In-memory storage (очищается при перезапуске)
let devUsers: DevUser[] = []
let devSchools: DevSchool[] = []
let devClasses: DevClass[] = []
let devChallenges: DevChallenge[] = []
let devTeacherInvites: DevTeacherInvite[] = []
const devEcoActions: DevEcoAction[] = [
  {
    id: 1,
    name: "Переработка бумаги",
    description: "Сдал бумагу на переработку",
    points: 10,
    category: "recycling",
    icon: "Recycle",
    unit: "кг",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Сортировка отходов",
    description: "Правильно отсортировал отходы по категориям",
    points: 5,
    category: "waste",
    icon: "Trash2",
    unit: "раз",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Переработка пластика",
    description: "Принес пластиковые бутылки на переработку",
    points: 8,
    category: "recycling",
    icon: "Droplets",
    unit: "шт",
    created_at: new Date().toISOString(),
  },
]
let devUserActions: DevUserAction[] = []

let nextUserId = 1
let nextSchoolId = 1
let nextClassId = 1
let nextChallengeId = 1
let nextTeacherInviteId = 1
let nextUserActionId = 1

export const devStorage = {
  // Users
  createUser: async (userData: Omit<DevUser, "id" | "created_at">) => {
    const user: DevUser = {
      ...userData,
      id: nextUserId++,
      badges: userData.badges || [],
      created_at: new Date().toISOString(),
    }
    devUsers.push(user)
    return user
  },

  findUserByEmail: async (email: string) => {
    return devUsers.find((user) => user.email === email) || null
  },

  updateUserPoints: async (userId: number, pointsToAdd: number) => {
    const user = devUsers.find((u) => u.id === userId)
    if (user) {
      user.points += pointsToAdd
      user.level = Math.floor(user.points / 100) + 1
    }
    return user
  },

  assignUserToClass: async (userId: number, classId: number) => {
    const user = devUsers.find((u) => u.id === userId)
    if (user) {
      user.class_id = classId

      // Update class student count if it's a student
      if (user.role === "student") {
        const classData = devClasses.find((c) => c.id === classId)
        if (classData) {
          classData.student_count += 1
        }
      }
    }
    return user
  },

  // Schools
  createSchool: async (schoolData: Omit<DevSchool, "id" | "created_at">) => {
    const school: DevSchool = {
      ...schoolData,
      id: nextSchoolId++,
      created_at: new Date().toISOString(),
    }
    devSchools.push(school)

    if (school.director_id) {
      const director = devUsers.find((u) => u.id === school.director_id)
      if (director) {
        director.school_id = school.id
        director.school_name = school.name
      }
    }

    return school
  },

  getAllSchools: async () => {
    return devSchools.map((school) => {
      const director = devUsers.find((u) => u.id === school.director_id)
      return {
        ...school,
        director_name: director?.name,
      }
    })
  },

  updateSchool: async (schoolId: number, updates: Partial<DevSchool>) => {
    const schoolIndex = devSchools.findIndex((s) => s.id === schoolId)
    if (schoolIndex !== -1) {
      devSchools[schoolIndex] = { ...devSchools[schoolIndex], ...updates }
      return devSchools[schoolIndex]
    }
    return null
  },

  // Classes
  createClass: async (classData: Omit<DevClass, "id" | "created_at">) => {
    const newClass: DevClass = {
      ...classData,
      id: nextClassId++,
      created_at: new Date().toISOString(),
    }
    devClasses.push(newClass)
    return newClass
  },

  getClassesBySchool: async (schoolId: number) => {
    return devClasses
      .filter((c) => c.school_id === schoolId)
      .map((classData) => {
        const teacher = devUsers.find((u) => u.id === classData.teacher_id)
        return {
          ...classData,
          teacher_name: teacher?.name,
        }
      })
  },

  assignTeacherToClass: async (teacherId: number, classId: number) => {
    const classData = devClasses.find((c) => c.id === classId)
    const teacher = devUsers.find((u) => u.id === teacherId)

    if (classData && teacher) {
      classData.teacher_id = teacherId
      teacher.class_id = classId
      return classData
    }
    return null
  },

  getClassById: async (classId: number) => {
    const classData = devClasses.find((c) => c.id === classId)
    if (classData) {
      const teacher = devUsers.find((u) => u.id === classData.teacher_id)
      return {
        ...classData,
        teacher_name: teacher?.name,
      }
    }
    return null
  },

  // Challenges
  createChallenge: async (challengeData: Omit<DevChallenge, "id" | "created_at">) => {
    const challenge: DevChallenge = {
      ...challengeData,
      id: nextChallengeId++,
      created_at: new Date().toISOString(),
    }
    devChallenges.push(challenge)
    return challenge
  },

  getChallengesBySchool: async (schoolId: number) => {
    return devChallenges.filter((c) => c.school_id === schoolId)
  },

  // Teacher Invites
  createTeacherInvite: async (inviteData: Omit<DevTeacherInvite, "id" | "created_at" | "status">) => {
    const invite: DevTeacherInvite = {
      ...inviteData,
      id: nextTeacherInviteId++,
      status: "pending",
      created_at: new Date().toISOString(),
    }
    devTeacherInvites.push(invite)
    return invite
  },

  getTeacherInvitesBySchool: async (schoolId: number) => {
    return devTeacherInvites.filter((i) => i.school_id === schoolId)
  },

  // Eco Actions
  getAllEcoActions: async () => {
    return devEcoActions
  },

  getEcoActionById: async (id: number) => {
    return devEcoActions.find((action) => action.id === id) || null
  },

  // User Actions
  createUserAction: async (actionData: Omit<DevUserAction, "id" | "created_at">) => {
    const userAction: DevUserAction = {
      ...actionData,
      id: nextUserActionId++,
      status: "pending", // Always start as pending
      created_at: new Date().toISOString(),
    }
    devUserActions.push(userAction)
    return userAction
  },

  getUserActions: async (userId: number) => {
    return devUserActions
      .filter((ua) => ua.user_id === userId)
      .map((ua) => {
        const action = devEcoActions.find((a) => a.id === ua.action_id)
        return {
          ...ua,
          action_name: action?.name,
          icon: action?.icon,
          unit: action?.unit,
        }
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  // Teacher functions for reviewing actions
  getPendingActionsForTeacher: async (teacherId: number) => {
    const teacher = devUsers.find((u) => u.id === teacherId)
    if (!teacher || !teacher.class_id) return []

    // Get all students in teacher's class
    const studentsInClass = devUsers.filter((u) => u.class_id === teacher.class_id && u.role === "student")
    const studentIds = studentsInClass.map((s) => s.id)

    // Get pending actions from these students
    return devUserActions
      .filter((ua) => studentIds.includes(ua.user_id) && ua.status === "pending")
      .map((ua) => {
        const action = devEcoActions.find((a) => a.id === ua.action_id)
        const student = devUsers.find((u) => u.id === ua.user_id)
        return {
          ...ua,
          action_name: action?.name,
          icon: action?.icon,
          unit: action?.unit,
          student_name: student?.name,
        }
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  reviewUserAction: async (actionId: number, teacherId: number, status: "approved" | "rejected") => {
    const userAction = devUserActions.find((ua) => ua.id === actionId)
    if (!userAction) return null

    userAction.status = status
    userAction.reviewed_by = teacherId
    userAction.reviewed_at = new Date().toISOString()

    // If approved, add points to student
    if (status === "approved") {
      await devStorage.updateUserPoints(userAction.user_id, userAction.points_earned)
    }

    return userAction
  },

  // Statistics
  getSchoolStats: async (schoolId: number) => {
    const students = devUsers.filter((u) => u.school_id === schoolId && u.role === "student")
    const teachers = devUsers.filter((u) => u.school_id === schoolId && u.role === "teacher")
    const classes = devClasses.filter((c) => c.school_id === schoolId)
    const totalPoints = students.reduce((sum, student) => sum + student.points, 0)

    return {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      totalPoints,
    }
  },

  getTeacherStats: async (teacherId: number) => {
    const teacher = devUsers.find((u) => u.id === teacherId)
    if (!teacher || !teacher.class_id) return null

    const studentsInClass = devUsers.filter((u) => u.class_id === teacher.class_id && u.role === "student")
    const studentIds = studentsInClass.map((s) => s.id)

    const pendingActions = devUserActions.filter((ua) => studentIds.includes(ua.user_id) && ua.status === "pending")
    const approvedActions = devUserActions.filter((ua) => studentIds.includes(ua.user_id) && ua.status === "approved")
    const totalPoints = approvedActions.reduce((sum, action) => sum + action.points_earned, 0)

    return {
      totalStudents: studentsInClass.length,
      pendingActions: pendingActions.length,
      approvedActions: approvedActions.length,
      totalPoints,
    }
  },

  // Clear all data (for development)
  clearAll: () => {
    devUsers = []
    devSchools = []
    devClasses = []
    devChallenges = []
    devTeacherInvites = []
    devUserActions = []
    nextUserId = 1
    nextSchoolId = 1
    nextClassId = 1
    nextChallengeId = 1
    nextTeacherInviteId = 1
    nextUserActionId = 1
    console.log("🧹 Dev storage cleared!")
  },
}

// Auto-clear on server restart in development
if (process.env.NODE_ENV === "development") {
  console.log("🚀 Development mode: Using temporary in-memory storage")
  console.log("📝 Data will be cleared on server restart")
}
