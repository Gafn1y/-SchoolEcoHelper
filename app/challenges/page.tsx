"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  Calendar,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  Menu,
  ArrowLeft,
  Leaf,
  Recycle,
  Droplets,
} from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Challenge {
  id: number
  title: string
  description: string
  points: number
  progress: number
  maxProgress: number
  deadline: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  participants: number
  status: "active" | "completed" | "upcoming"
  icon: any
}

export default function Challenges() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockChallenges: Challenge[] = [
      {
        id: 1,
        title: "Неделя без пластика",
        description: "Откажитесь от одноразового пластика на целую неделю",
        points: 100,
        progress: 5,
        maxProgress: 7,
        deadline: "2024-02-15",
        difficulty: "medium",
        category: "Экология",
        participants: 45,
        status: "active",
        icon: Recycle,
      },
      {
        id: 2,
        title: "Сбор макулатуры",
        description: "Соберите 10 кг макулатуры для переработки",
        points: 50,
        progress: 7,
        maxProgress: 10,
        deadline: "2024-02-20",
        difficulty: "easy",
        category: "Переработка",
        participants: 32,
        status: "active",
        icon: Leaf,
      },
      {
        id: 3,
        title: "Экономия воды",
        description: "Сократите потребление воды на 20% в течение месяца",
        points: 150,
        progress: 12,
        maxProgress: 30,
        deadline: "2024-03-01",
        difficulty: "hard",
        category: "Ресурсы",
        participants: 28,
        status: "active",
        icon: Droplets,
      },
      {
        id: 4,
        title: "Зеленый транспорт",
        description: "Используйте только экологичный транспорт неделю",
        points: 80,
        progress: 80,
        maxProgress: 80,
        deadline: "2024-01-30",
        difficulty: "medium",
        category: "Транспорт",
        participants: 67,
        status: "completed",
        icon: Target,
      },
    ]

    setChallenges(mockChallenges)
    setLoading(false)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Легкий"
      case "medium":
        return "Средний"
      case "hard":
        return "Сложный"
      default:
        return "Неизвестно"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Активный"
      case "completed":
        return "Завершен"
      case "upcoming":
        return "Скоро"
      default:
        return "Неизвестно"
    }
  }

  const renderChallenge = (challenge: Challenge) => (
    <Card key={challenge.id} className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <challenge.icon className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-base lg:text-lg">{challenge.title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getDifficultyColor(challenge.difficulty)} variant="secondary">
                  {getDifficultyText(challenge.difficulty)}
                </Badge>
                <Badge className={getStatusColor(challenge.status)} variant="secondary">
                  {getStatusText(challenge.status)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-green-600 text-sm lg:text-base">{challenge.points}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="text-sm lg:text-base">{challenge.description}</CardDescription>

        {challenge.status === "active" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Прогресс</span>
              <span>
                {challenge.progress}/{challenge.maxProgress}
              </span>
            </div>
            <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs lg:text-sm">{new Date(challenge.deadline).toLocaleDateString("ru-RU")}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span className="text-xs lg:text-sm">{challenge.participants}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          {challenge.status === "active" && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-sm lg:text-base">Участвовать</Button>
          )}
          {challenge.status === "completed" && (
            <Button variant="outline" className="flex-1 text-sm lg:text-base bg-transparent" disabled>
              <CheckCircle className="w-4 h-4 mr-2" />
              Завершен
            </Button>
          )}
          {challenge.status === "upcoming" && (
            <Button variant="outline" className="flex-1 text-sm lg:text-base bg-transparent" disabled>
              <Clock className="w-4 h-4 mr-2" />
              Скоро
            </Button>
          )}
          <Button variant="outline" size="sm" className="text-xs lg:text-sm bg-transparent">
            Подробнее
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка челленджей...</p>
        </div>
      </div>
    )
  }

  const activeChallenges = challenges.filter((c) => c.status === "active")
  const completedChallenges = challenges.filter((c) => c.status === "completed")
  const upcomingChallenges = challenges.filter((c) => c.status === "upcoming")

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
            <h1 className="font-semibold text-sm">Челленджи</h1>
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
                <Link href="/leaderboard" className="text-sm font-medium">
                  Рейтинг
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
            <Link href="/leaderboard">Рейтинг</Link>
            <Link href="/challenges" className="text-green-600">
              Челленджи
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">🎯 Эко-челленджи</h1>
          <p className="text-sm lg:text-xl text-gray-600">Участвуйте в челленджах и зарабатывайте баллы</p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 lg:mb-8">
            <TabsTrigger value="active" className="text-xs lg:text-sm">
              Активные ({activeChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs lg:text-sm">
              Завершенные ({completedChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs lg:text-sm">
              Скоро ({upcomingChallenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {activeChallenges.map(renderChallenge)}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {completedChallenges.map(renderChallenge)}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {upcomingChallenges.length > 0 ? (
                upcomingChallenges.map(renderChallenge)
              ) : (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8 lg:py-12">
                    <Trophy className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">
                      Новые челленджи скоро появятся
                    </h3>
                    <p className="text-sm lg:text-base text-gray-500">
                      Следите за обновлениями и будьте готовы к новым вызовам!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
