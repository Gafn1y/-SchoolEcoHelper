"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, Star, Menu, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface LeaderboardEntry {
  id: number
  name: string
  points: number
  rank: number
  class?: string
  school?: string
  isCurrentUser?: boolean
}

export default function Leaderboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [studentLeaderboard, setStudentLeaderboard] = useState<LeaderboardEntry[]>([])
  const [classLeaderboard, setClassLeaderboard] = useState<LeaderboardEntry[]>([])
  const [schoolLeaderboard, setSchoolLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStudents: LeaderboardEntry[] = [
      { id: 1, name: "Анна Петрова", points: 1250, rank: 1, class: "10А", isCurrentUser: false },
      { id: 2, name: "Максим Иванов", points: 1180, rank: 2, class: "9Б", isCurrentUser: true },
      { id: 3, name: "София Козлова", points: 1120, rank: 3, class: "11В", isCurrentUser: false },
      { id: 4, name: "Дмитрий Смирнов", points: 1050, rank: 4, class: "10А", isCurrentUser: false },
      { id: 5, name: "Елена Волкова", points: 980, rank: 5, class: "9А", isCurrentUser: false },
    ]

    const mockClasses: LeaderboardEntry[] = [
      { id: 1, name: "10А", points: 5420, rank: 1, school: "Школа №15" },
      { id: 2, name: "9Б", points: 4890, rank: 2, school: "Школа №15" },
      { id: 3, name: "11В", points: 4650, rank: 3, school: "Школа №15" },
      { id: 4, name: "10Б", points: 4320, rank: 4, school: "Школа №15" },
      { id: 5, name: "9А", points: 4100, rank: 5, school: "Школа №15" },
    ]

    const mockSchools: LeaderboardEntry[] = [
      { id: 1, name: "Школа №15", points: 25420, rank: 1 },
      { id: 2, name: "Гимназия №7", points: 23890, rank: 2 },
      { id: 3, name: "Лицей №3", points: 22650, rank: 3 },
      { id: 4, name: "Школа №22", points: 21320, rank: 4 },
      { id: 5, name: "Школа №8", points: 20100, rank: 5 },
    ]

    setStudentLeaderboard(mockStudents)
    setClassLeaderboard(mockClasses)
    setSchoolLeaderboard(mockSchools)
    setLoading(false)
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
      case 2:
        return <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
      case 3:
        return <Medal className="w-5 h-5 lg:w-6 lg:h-6 text-amber-600" />
      default:
        return <Award className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-600"
    }
  }

  const renderLeaderboardEntry = (entry: LeaderboardEntry, showClass = false, showSchool = false) => (
    <Card
      key={entry.id}
      className={`transition-all duration-200 hover:shadow-md ${
        entry.isCurrentUser ? "ring-2 ring-green-500 bg-green-50" : ""
      }`}
    >
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div
            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full ${getRankColor(entry.rank)} flex items-center justify-center text-white font-bold text-sm lg:text-base`}
          >
            {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
          </div>

          <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
            <AvatarFallback className="bg-green-100 text-green-600 text-sm lg:text-base">
              {entry.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm lg:text-base truncate">{entry.name}</h3>
              {entry.isCurrentUser && (
                <Badge variant="secondary" className="text-xs">
                  Вы
                </Badge>
              )}
            </div>
            {showClass && entry.class && <p className="text-xs lg:text-sm text-gray-600">Класс: {entry.class}</p>}
            {showSchool && entry.school && <p className="text-xs lg:text-sm text-gray-600">{entry.school}</p>}
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500" />
              <span className="font-bold text-sm lg:text-lg text-green-600">{entry.points.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">баллов</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка рейтинга...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/student">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-sm">Рейтинг</h1>
          </div>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link href="/dashboard/student" className="text-sm font-medium">
                  Главная
                </Link>
                <Link href="/actions/log" className="text-sm font-medium">
                  Мои действия
                </Link>
                <Link href="/challenges" className="text-sm font-medium">
                  Челленджи
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/dashboard/student" className="mr-6 flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded"></div>
              <span className="font-bold">EcoSchool</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard/student">Главная</Link>
            <Link href="/actions/log">Мои действия</Link>
            <Link href="/challenges">Челленджи</Link>
            <Link href="/leaderboard" className="text-green-600">
              Рейтинг
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">🏆 Рейтинг лидеров</h1>
          <p className="text-sm lg:text-xl text-gray-600">Лучшие эко-активисты нашей школы</p>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 lg:mb-8">
            <TabsTrigger value="students" className="text-xs lg:text-sm">
              Ученики
            </TabsTrigger>
            <TabsTrigger value="classes" className="text-xs lg:text-sm">
              Классы
            </TabsTrigger>
            <TabsTrigger value="schools" className="text-xs lg:text-sm">
              Школы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Топ учеников</CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  Самые активные участники эко-программы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {studentLeaderboard.map((entry) => renderLeaderboardEntry(entry, true))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Топ классов</CardTitle>
                <CardDescription className="text-sm lg:text-base">
                  Классы с наибольшим количеством эко-баллов
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {classLeaderboard.map((entry) => renderLeaderboardEntry(entry, false, true))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl">Топ школ</CardTitle>
                <CardDescription className="text-sm lg:text-base">Школы-лидеры экологического движения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {schoolLeaderboard.map((entry) => renderLeaderboardEntry(entry))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
