// Simple in-memory storage for development
// Replace with actual database in production

interface User {
  id: number
  email: string
  password: string
  name: string
  role: "student" | "teacher" | "director"
  schoolId?: number
  classId?: number
  points?: number
}

interface School {
  id: number
  name: string
  address: string
}

interface Class {
  id: number
  name: string
  schoolId: number
  teacherId?: number
}

interface EcoAction {
  id: number
  name: string
  description: string
  points: number
  category: string
}

interface UserAction {
  id: number
  userId: number
  actionId: number
  points: number
  date: string
  verified: boolean
}

// Mock data
const users: User[] = [
  {
    id: 1,
    email: "student@test.com",
    password: "password123",
    name: "Иван Петров",
    role: "student",
    schoolId: 1,
    classId: 1,
    points: 150,
  },
  {
    id: 2,
    email: "teacher@test.com",
    password: "password123",
    name: "Мария Иванова",
    role: "teacher",
    schoolId: 1,
  },
  {
    id: 3,
    email: "director@test.com",
    password: "password123",
    name: "Александр Сидоров",
    role: "director",
    schoolId: 1,
  },
]

const schools: School[] = [
  {
    id: 1,
    name: "Школа №15",
    address: "ул. Школьная, 15",
  },
]

const classes: Class[] = [
  {
    id: 1,
    name: "10А",
    schoolId: 1,
    teacherId: 2,
  },
]

const ecoActions: EcoAction[] = [
  {
    id: 1,
    name: "Сбор макулатуры",
    description: "Сдача макулатуры на переработку",
    points: 10,
    category: "Переработка",
  },
  {
    id: 2,
    name: "Посадка дерева",
    description: "Посадка дерева в школьном дворе",
    points: 25,
    category: "Озеленение",
  },
  {
    id: 3,
    name: "Уборка территории",
    description: "Уборка мусора на школьной территории",
    points: 15,
    category: "Уборка",
  },
]

const userActions: UserAction[] = []

// Storage functions
export const devStorage = {
  // Users
  getUsers: () => users,
  getUserById: (id: number) => users.find((u) => u.id === id),
  getUserByEmail: (email: string) => users.find((u) => u.email === email),
  createUser: (user: Omit<User, "id">) => {
    const newUser = { ...user, id: users.length + 1 }
    users.push(newUser)
    return newUser
  },
  updateUser: (id: number, updates: Partial<User>) => {
    const index = users.findIndex((u) => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      return users[index]
    }
    return null
  },

  // Schools
  getSchools: () => schools,
  getSchoolById: (id: number) => schools.find((s) => s.id === id),

  // Classes
  getClasses: () => classes,
  getClassById: (id: number) => classes.find((c) => c.id === id),
  getClassesBySchoolId: (schoolId: number) => classes.filter((c) => c.schoolId === schoolId),

  // Eco Actions
  getEcoActions: () => ecoActions,
  getEcoActionById: (id: number) => ecoActions.find((a) => a.id === id),

  // User Actions
  getUserActions: () => userActions,
  getUserActionsByUserId: (userId: number) => userActions.filter((ua) => ua.userId === userId),
  createUserAction: (userAction: Omit<UserAction, "id">) => {
    const newUserAction = { ...userAction, id: userActions.length + 1 }
    userActions.push(newUserAction)
    return newUserAction
  },
}
