"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Trophy, Users, Building, Crown, Medal, Award } from "lucide-react"

interface User {
  id: number
  name: string
  role: string
}

interface LeaderboardEntry {
  id: number
  name: string
  points: number
  rank: number
}

interface ClassLeaderboardEntry {
  id: number
  name: string
  total_points: number
  student_count: number
  teacher_name: string
  rank: number
}

interface SchoolLeaderboardEntry {
  id: number
  name: string
  total_points: number
  class_count: number
  student_count: number
  rank: number
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [studentLeaderboard, setStudentLeaderboard] = useState<LeaderboardEntry[]>([])
  const [classLeaderboard, setClassLeaderboard] = useState<ClassLeaderboardEntry[]>([])
  const [schoolLeaderboard, setSchoolLeaderboard] = useState<SchoolLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login-choice")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchLeaderboards()
  }, [router])

  const fetchLeaderboards = async () => {
    try {
      // For now, we'll use mock data since the API endpoints might not be fully implemented
      setStudentLeaderboard([
        { id: 1, name: "Анна Петрова", points: 245, rank: 1 },
        { id: 2, name: "Михаил Сидоров", points: 230, rank: 2 },
        { id: 3, name: "Елена Козлова", points: 215, rank: 3 },
        { id: 4, name: "Дмитрий Волков", points: 198, rank: 4 },
        { id: 5, name: "София Морозова", points: 187, rank: 5 },
        { id: 6, name: "Александр Новиков", points: 175, rank: 6 },
        { id: 7, name: "Мария Федорова", points: 162, rank: 7 },
        { id: 8, name: "Иван Смирнов", points: 148, rank: 8 },
        { id: 9, name: "Ольга Кузнецова", points: 135, rank: 9 },
        { id: 10, name: "Артем Попов", points: 122, rank: 10 },
      ])

      setClassLeaderboard([
        { id: 1, name: "10А", total_points: 1250, student_count: 25, teacher_name: "Иванова И.И.", rank: 1 },
        { id: 2, name: "9Б", total_points: 1180, student_count: 23, teacher_name: "Петров П.П.", rank: 2 },
        { id: 3, name: "11В", total_points: 1095, student_count: 22, teacher_name: "Сидорова С.С.", rank: 3 },
        { id: 4, name: "8А", total_points: 980, student_count: 26, teacher_name: "Козлов К.К.", rank: 4 },
        { id: 5, name: "10Б", total_points: 875, student_count: 24, teacher_name: "Морозова М.М.", rank: 5 },
      ])

      setSchoolLeaderboard([
        { id: 1, name: "Гимназия №1", total_points: 8500, class_count: 15, student_count: 375, rank: 1 },
        { id: 2, name: "Школа №25", total_points: 7800, class_count: 12, student_count: 300, rank: 2 },
        { id: 3, name: "Лицей №3", total_points: 7200, class_count: 18, student_count: 450, rank: 3 },
        { id: 4, name: "Школа №15", total_points: 6900, class_count: 14, student_count: 350, rank: 4 },
        { id: 5, name: "Гимназия №7", total_points: 6500, class_count: 16, student_count: 400, rank: 5 },
      ])
    } catch (error) {
      console.error("Error fetching leaderboards:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
      default:
        return <span className="text-sm sm:text-base font-semibold text-gray-600">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
      default:
        return "bg-white border border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Загрузка рейтинга...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href={`/dashboard/${user.role}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Назад</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Рейтинг</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Лучшие участники эко-программы</p>
              </div>
            </div>
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl">
        <Tabs defaultValue="students" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="students" className="text-xs sm:text-sm py-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Ученики</span>
              <span className="sm:hidden">Уч-ки</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="text-xs sm:text-sm py-2">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Классы</span>
              <span className="sm:hidden">Кл-сы</span>
            </TabsTrigger>
            <TabsTrigger value="schools" className="text-xs sm:text-sm py-2">
              <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Школы</span>
              <span className="sm:hidden">Шк-лы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
                  Рейтинг учеников
                </CardTitle>
                <CardDescription className="text-sm">
                  Топ-10 самых активных учеников по количеству эко-баллов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {studentLeaderboard.map((student) => (
                    <div key={student.id} className={`p-3 sm:p-4 rounded-lg shadow-sm ${getRankColor(student.rank)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                            {getRankIcon(student.rank)}
                          </div>
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                            <AvatarFallback className="bg-blue-600 text-white text-xs sm:text-sm">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{student.name}</h3>
                            <p className="text-xs sm:text-sm opacity-75">Ученик</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm sm:text-lg">{student.points}</div>
                          <div className="text-xs sm:text-sm opacity-75">баллов</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-green-600" />
                  Рейтинг классов
                </CardTitle>
                <CardDescription className="text-sm">Топ-5 классов по общему количеству эко-баллов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {classLeaderboard.map((classItem) => (
                    <div
                      key={classItem.id}
                      className={`p-3 sm:p-4 rounded-lg shadow-sm ${getRankColor(classItem.rank)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                            {getRankIcon(classItem.rank)}
                          </div>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">Класс {classItem.name}</h3>
                            <p className="text-xs sm:text-sm opacity-75">
                              {classItem.teacher_name} • {classItem.student_count} учеников
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm sm:text-lg">{classItem.total_points}</div>
                          <div className="text-xs sm:text-sm opacity-75">баллов</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <Building className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-purple-600" />
                  Рейтинг школ
                </CardTitle>
                <CardDescription className="text-sm">Топ-5 школ по общему количеству эко-баллов</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {schoolLeaderboard.map((school) => (
                    <div key={school.id} className={`p-3 sm:p-4 rounded-lg shadow-sm ${getRankColor(school.rank)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                            {getRankIcon(school.rank)}
                          </div>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <Building className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{school.name}</h3>
                            <p className="text-xs sm:text-sm opacity-75">
                              {school.class_count} классов • {school.student_count} учеников
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm sm:text-lg">{school.total_points}</div>
                          <div className="text-xs sm:text-sm opacity-75">баллов</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievement Section */}
        <Card className="mt-6 sm:mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Достижения месяца</CardTitle>
            <CardDescription className="text-sm">Особые награды за выдающиеся результаты</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                <Crown className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold text-sm sm:text-base mb-1">Эко-чемпион</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Анна Петрова</p>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">245 баллов</Badge>
              </div>

              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-sm sm:text-base mb-1">Лучший класс</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">10А класс</p>
                <Badge className="bg-green-100 text-green-800 text-xs">1250 баллов</Badge>
              </div>

              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <Building className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-sm sm:text-base mb-1">Эко-школа</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Гимназия №1</p>
                <Badge className="bg-purple-100 text-purple-800 text-xs">8500 баллов</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
