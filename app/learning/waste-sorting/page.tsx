"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Gamepad2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function WasteSortingLearning() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Учитесь сортировать мусор правильно вместе с нами!
          </h1>
          <p className="text-lg text-gray-600">Изучите основы экологически ответственного обращения с отходами</p>
        </div>

        {/* Video Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
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

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <span className="text-2xl">🥤</span>
                Пластик
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">Бутылки, пакеты, контейнеры. Перерабатывается в новые изделия.</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <span className="text-2xl">🍌</span>
                Органика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">Пищевые отходы, которые можно переработать в компост.</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <span className="text-2xl">📄</span>
                Бумага
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">Газеты, картон, документы. Может быть переработана много раз.</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
            onClick={() => router.push("/learning/waste-sorting/game")}
          >
            <Gamepad2 className="mr-2 h-5 w-5" />
            Начать игру
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4 text-lg bg-transparent"
            onClick={() => router.push("/dashboard/student")}
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            Вернуться к панели
          </Button>
        </div>
      </div>
    </div>
  )
}
