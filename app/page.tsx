"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Users, Trophy, Target, BookOpen, Award, ArrowRight, CheckCircle, Star, Globe, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-green-800">EcoSchool</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login-choice">
              <Button variant="outline">Войти</Button>
            </Link>
            <Link href="/auth/register-choice">
              <Button className="bg-green-600 hover:bg-green-700">Регистрация</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            🌱 Экологическое образование будущего
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Сделайте экологические активности
            <span className="text-green-600"> увлекательными и полезными</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Платформа для школ, которая превращает экологические действия в увлекательную игру с системой очков,
            достижений и соревнований между классами.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register-choice">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                Начните свой эко-путь
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Возможности платформы</h2>
            <p className="text-gray-600 text-lg">Все необходимые инструменты для экологического образования</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-green-800">Система достижений</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Зарабатывайте очки за экологические действия, получайте значки и поднимайтесь в рейтинге.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-blue-800">Командная работа</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Соревнуйтесь между классами, создавайте команды и достигайте целей вместе.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-purple-800">Челленджи</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Участвуйте в экологических вызовах и достигайте поставленных целей.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Как это работает</h2>
            <p className="text-gray-600 text-lg">Простой процесс для начала экологического образования</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Регистрация</h3>
              <p className="text-gray-600 text-sm">Создайте аккаунт для школы, класса или ученика</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Действия</h3>
              <p className="text-gray-600 text-sm">Выполняйте экологические действия и фиксируйте их</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Очки</h3>
              <p className="text-gray-600 text-sm">Получайте очки и повышайте свой уровень</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Достижения</h3>
              <p className="text-gray-600 text-sm">Зарабатывайте значки и участвуйте в рейтинге</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for different roles */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Преимущества для всех</h2>
            <p className="text-gray-600 text-lg">Каждая роль получает уникальные возможности</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-200">
              <CardHeader>
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Для учеников</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Увлекательное обучение</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Система достижений</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Соревнования с друзьями</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Для учителей</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Управление классом</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Отслеживание прогресса</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Награждение учеников</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">Для директоров</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Управление школой</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Аналитика и отчеты</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Приглашение учителей</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold mb-6">Готовы начать экологическое образование?</h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к тысячам школ, которые уже используют EcoSchool для создания более экологически
            сознательного поколения.
          </p>
          <Link href="/auth/register-choice">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4">
              Начать бесплатно
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo-new.png" alt="EcoSchool" className="h-8 w-8" />
                <h3 className="text-xl font-bold">EcoSchool</h3>
              </div>
              <p className="text-gray-400 text-sm">Платформа для экологического образования нового поколения.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-gray-400">
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

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 EcoSchool. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
