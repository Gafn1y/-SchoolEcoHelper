"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RotateCcw, Star, CheckCircle, XCircle, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface WasteItem {
  id: number
  name: string
  icon: string
  correctBin: string
  description: string
}

interface Bin {
  id: string
  name: string
  color: string
  icon: string
  bgColor: string
}

const wasteItems: WasteItem[] = [
  { id: 1, name: "Газета", icon: "📰", correctBin: "paper", description: "Бумажные изделия" },
  { id: 2, name: "Пластиковая бутылка", icon: "🥤", correctBin: "plastic", description: "Пластиковая упаковка" },
  { id: 3, name: "Стеклянная банка", icon: "🍯", correctBin: "glass", description: "Стеклянная тара" },
  { id: 4, name: "Яблочная кожура", icon: "🍎", correctBin: "organic", description: "Органические отходы" },
  { id: 5, name: "Картонная коробка", icon: "📦", correctBin: "paper", description: "Картонная упаковка" },
  { id: 6, name: "Пластиковый пакет", icon: "🛍️", correctBin: "plastic", description: "Пластиковые изделия" },
  { id: 7, name: "Стеклянная бутылка", icon: "🍶", correctBin: "glass", description: "Стеклянная посуда" },
  { id: 8, name: "Банановая кожура", icon: "🍌", correctBin: "organic", description: "Пищевые отходы" },
  { id: 9, name: "Журнал", icon: "📖", correctBin: "paper", description: "Печатная продукция" },
  { id: 10, name: "Йогуртовый стаканчик", icon: "🥛", correctBin: "plastic", description: "Пластиковая тара" },
]

const bins: Bin[] = [
  { id: "paper", name: "Бумага", color: "blue", icon: "📄", bgColor: "bg-blue-100" },
  { id: "plastic", name: "Пластик", color: "yellow", icon: "🥤", bgColor: "bg-yellow-100" },
  { id: "glass", name: "Стекло", color: "green", icon: "🍶", bgColor: "bg-green-100" },
  { id: "organic", name: "Органика", color: "brown", icon: "🍎", bgColor: "bg-orange-100" },
]

export default function WasteSortingGame() {
  const router = useRouter()
  const [currentItem, setCurrentItem] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: "",
  })
  const [draggedItem, setDraggedItem] = useState<WasteItem | null>(null)

  const currentWasteItem = wasteItems[currentItem]
  const progress = ((currentItem + 1) / wasteItems.length) * 100

  const handleDragStart = (item: WasteItem) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, binId: string) => {
    e.preventDefault()
    if (draggedItem) {
      handleBinClick(binId)
    }
    setDraggedItem(null)
  }

  const handleBinClick = (binId: string) => {
    const isCorrect = binId === currentWasteItem.correctBin

    if (isCorrect) {
      setScore(score + 10)
      setFeedback({
        show: true,
        correct: true,
        message: `Правильно! ${currentWasteItem.name} действительно относится к категории "${bins.find((b) => b.id === binId)?.name}"`,
      })

      setTimeout(() => {
        setFeedback({ show: false, correct: false, message: "" })
        if (currentItem < wasteItems.length - 1) {
          setCurrentItem(currentItem + 1)
        } else {
          setGameWon(true)
        }
      }, 2000)
    } else {
      const newLives = lives - 1
      setLives(newLives)
      setFeedback({
        show: true,
        correct: false,
        message: `Неправильно! ${currentWasteItem.name} должен попасть в контейнер для "${bins.find((b) => b.id === currentWasteItem.correctBin)?.name}"`,
      })

      if (newLives === 0) {
        setTimeout(() => {
          setGameOver(true)
        }, 2000)
      } else {
        setTimeout(() => {
          setFeedback({ show: false, correct: false, message: "" })
        }, 2000)
      }
    }
  }

  const resetGame = () => {
    setCurrentItem(0)
    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameWon(false)
    setFeedback({ show: false, correct: false, message: "" })
  }

  const getScoreRating = () => {
    const percentage = (score / (wasteItems.length * 10)) * 100
    if (percentage >= 90) return { rating: "Отлично!", color: "text-green-600", stars: 3 }
    if (percentage >= 70) return { rating: "Хорошо!", color: "text-blue-600", stars: 2 }
    if (percentage >= 50) return { rating: "Неплохо!", color: "text-yellow-600", stars: 1 }
    return { rating: "Попробуйте еще раз!", color: "text-red-600", stars: 0 }
  }

  if (gameOver) {
    const rating = getScoreRating()
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-red-200">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <CardTitle className="text-2xl text-red-800">Игра окончена</CardTitle>
            <CardDescription>Не расстраивайтесь, попробуйте еще раз!</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-red-800">Ваш результат: {score} очков</p>
              <p className={`text-sm ${rating.color}`}>{rating.rating}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={resetGame} className="bg-red-600 hover:bg-red-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                Играть снова
              </Button>
              <Button variant="outline" onClick={() => router.push("/learning/waste-sorting")}>
                Вернуться к обучению
              </Button>
              <Button variant="ghost" onClick={() => router.push("/dashboard/student")}>
                <Home className="h-4 w-4 mr-2" />
                На главную
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameWon) {
    const rating = getScoreRating()
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-green-200">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <CardTitle className="text-2xl text-green-800">Поздравляем!</CardTitle>
            <CardDescription>Вы успешно завершили игру по сортировке отходов!</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-green-800">Ваш результат: {score} очков</p>
              <p className={`text-sm ${rating.color}`}>{rating.rating}</p>
              <div className="flex justify-center mt-2">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${i < rating.stars ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Вы заработали <strong>+50 очков</strong> за завершение игры!
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                Играть снова
              </Button>
              <Button variant="outline" onClick={() => router.push("/learning/waste-sorting")}>
                Вернуться к обучению
              </Button>
              <Button variant="ghost" onClick={() => router.push("/dashboard/student")}>
                <Home className="h-4 w-4 mr-2" />
                На главную
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.back()}>
                ← Назад
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Игра: Сортировка отходов
                </h1>
                <p className="text-sm text-gray-600">Перетащите предмет в правильный контейнер</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Очки: <span className="font-semibold">{score}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Жизни: <span className="font-semibold text-red-600">{"❤️".repeat(lives)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-800">Прогресс игры</h2>
              <Badge className="bg-blue-100 text-blue-800">
                {currentItem + 1} из {wasteItems.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Current Item */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-purple-800">Что делать с этим предметом?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div
              className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-8 mb-4 cursor-move select-none"
              draggable
              onDragStart={() => handleDragStart(currentWasteItem)}
            >
              <div className="text-6xl mb-4">{currentWasteItem.icon}</div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">{currentWasteItem.name}</h3>
              <p className="text-purple-600">{currentWasteItem.description}</p>
            </div>
            <p className="text-sm text-gray-600">Перетащите предмет в правильный контейнер или нажмите на контейнер</p>
          </CardContent>
        </Card>

        {/* Bins */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {bins.map((bin) => (
            <Card
              key={bin.id}
              className={`${bin.bgColor} border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-all duration-300 hover:shadow-lg`}
              onClick={() => handleBinClick(bin.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, bin.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{bin.icon}</div>
                <h3 className="font-bold text-lg mb-1">{bin.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{bin.color} контейнер</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feedback */}
        {feedback.show && (
          <Card className={`mb-8 ${feedback.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">
                {feedback.correct ? (
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                )}
              </div>
              <p className={`text-lg font-semibold ${feedback.correct ? "text-green-800" : "text-red-800"}`}>
                {feedback.message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">Как играть</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📄</span>
                <span>Бумага и картон → Синий контейнер</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">🥤</span>
                <span>Пластик → Желтый контейнер</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">🍶</span>
                <span>Стекло → Зеленый контейнер</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-600">🍎</span>
                <span>Органика → Коричневый контейнер</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
