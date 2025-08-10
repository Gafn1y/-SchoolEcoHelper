"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Users,
  Trophy,
  Target,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Zap,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo-new.png" alt="EcoSchool" className="h-8 w-8 sm:h-10 sm:w-10" />
              <h1 className="text-xl sm:text-2xl font-bold text-green-800">EcoSchool</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
              <Link href="/auth/login-choice">
                <Button variant="outline" size="sm">
                  Войти
                </Button>
              </Link>
              <Link href="/auth/register-choice">
                <Button className="bg-green-600 hover:bg-green-700" size="sm">
                  Регистрация
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="sm:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-3">
                <Link href="/auth/login-choice" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Войти
                  </Button>
                </Link>
                <Link href="/auth/register-choice" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-green-600 hover:bg-green-700 w-full">Регистрация</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 sm:mb-6 bg-green-100 text-green-800 hover:bg-green-100 text-xs sm:text-sm">
            🌱 Экологическое образование будущего
          </Badge>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Сделайте экологические активности
            <span className="text-green-600"> увлекательными и полезными</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            Платформа для школ, которая превращает экологические действия в увлекательную игру с системой очков,
            достижений и соревнований между классами.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/auth/register-choice">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
              >
                Начните свой эко-путь
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Возможности платформы</h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Все необходимые инструменты для экологического образования
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mb-3 sm:mb-4 mx-auto" />
                <CardTitle className="text-green-800 text-lg sm:text-xl">Система достижений</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Зарабатывайте очки за экологические действия, получайте значки и поднимайтесь в рейтинге.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-3 sm:mb-4 mx-auto" />
                <CardTitle className="text-blue-800 text-lg sm:text-xl">Командная работа</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Соревнуйтесь между классами, создавайте команды и достигайте целей вместе.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Target className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600 mb-3 sm:mb-4 mx-auto" />
                <CardTitle className="text-purple-800 text-lg sm:text-xl">Челленджи</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base">
                  Участвуйте в экологических вызовах и достигайте поставленных целей.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Как это работает</h2>
            <p className="text-gray-600 text-base sm:text-lg">Простой процесс для начала экологического образования</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">1. Регистрация</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Создайте аккаунт для школы, класса или ученика</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">2. Действия</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Выполняйте экологические действия и фиксируйте их</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">3. Очки</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Получайте очки и повышайте свой уровень</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">4. Достижения</h3>
              <p className="text-gray-600 text-xs sm:text-sm">Зарабатывайте значки и участвуйте в рейтинге</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for different roles */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Преимущества для всех</h2>
            <p className="text-gray-600 text-base sm:text-lg">Каждая роль получает уникальные возможности</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-blue-200">
              <CardHeader>
                <div className="bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800 text-lg sm:text-xl">Для учеников</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Увлекательное обучение</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Система достижений</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Соревнования с друзьями</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <div className="bg-green-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800 text-lg sm:text-xl">Для учителей</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Управление классом</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Отслеживание прогресса</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Награждение учеников</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <div className="bg-purple-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800 text-lg sm:text-xl">Для директоров</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Управление школой</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Аналитика и отчеты</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Приглашение учителей</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Готовы начать экологическое образование?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-2">
            Присоединяйтесь к тысячам школ, которые уже используют EcoSchool для создания более экологически
            сознательного поколения.
          </p>
          <Link href="/auth/register-choice">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              Начать бесплатно
              <Zap className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <img src="/logo-new.png" alt="EcoSchool" className="h-6 w-6 sm:h-8 sm:w-8" />
                <h3 className="text-lg sm:text-xl font-bold">EcoSchool</h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                Платформа для экологического образования нового поколения.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Продукт</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Возможности
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Цены
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Безопасность
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Поддержка</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Документация
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Помощь
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Компания</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Блог
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Карьера
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 EcoSchool. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
