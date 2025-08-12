"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WasteSortingLearning() {
  const router = useRouter()
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold text-green-900">Обучение сортировке мусора</h1>
                <p className="text-sm text-gray-600">Изучите основы правильной сортировки отходов</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-bold text-green-700 mb-6 leading-tight">
            Учитесь сортировать мусор правильно вместе с нами!
          </h2>
        </div>

        {/* Video Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Обучающее видео
            </CardTitle>
            <CardDescription>Посмотрите видео о том, как правильно сортировать различные виды отходов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full max-w-4xl mx-auto">
              <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/Qq_lbpkIiU8"
                  title="Как правильно сортировать мусор"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Materials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">🥤 Пластик</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Пластиковые бутылки, контейнеры, пакеты и упаковка</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥤</span>
                  <span className="text-sm">Пластиковые бутылки</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧴</span>
                  <span className="text-sm">Контейнеры</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛍️</span>
                  <span className="text-sm">Пластиковые пакеты</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-yellow-600">🍌 Органика</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Пищевые отходы, остатки еды и органические материалы</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍎</span>
                  <span className="text-sm">Фрукты</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥕</span>
                  <span className="text-sm">Овощи</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍞</span>
                  <span className="text-sm">Хлебобулочные изделия</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">📄 Бумага</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Бумажные изделия, картон, газеты и документы</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  <span className="text-sm">Документы</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  <span className="text-sm">Картонные коробки</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📰</span>
                  <span className="text-sm">Газеты и журналы</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={() => router.push("/learning/waste-sorting/game")}
          >
            <Play className="h-5 w-5 mr-2" />
            Начать игру
          </Button>
          <div>
            <Button variant="outline" onClick={() => router.push("/dashboard/student")} className="mx-2">
              Вернуться в панель
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
