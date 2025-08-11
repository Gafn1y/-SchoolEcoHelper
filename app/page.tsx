"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Leaf, Users, Trophy, Target, Recycle, Droplets, Lightbulb, Menu } from "lucide-react"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: <Target className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Эко-челленджи",
      description: "Участвуйте в увлекательных экологических вызовах",
    },
    {
      icon: <Trophy className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Рейтинг классов",
      description: "Соревнуйтесь с другими классами за звание самого экологичного",
    },
    {
      icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Командная работа",
      description: "Работайте вместе для достижения общих экологических целей",
    },
    {
      icon: <Recycle className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Переработка",
      description: "Учитесь правильно сортировать и перерабатывать отходы",
    },
    {
      icon: <Droplets className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Экономия воды",
      description: "Изучайте способы экономии водных ресурсов",
    },
    {
      icon: <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Энергосбережение",
      description: "Узнавайте о способах экономии электроэнергии",
    },
  ]

  const stats = [
    { number: "500+", label: "Учеников" },
    { number: "25+", label: "Школ" },
    { number: "1000+", label: "Эко-действий" },
    { number: "50+", label: "Челленджей" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <Image src="/logo-new.png" alt="EcoSchool Logo" width={32} height={32} className="sm:w-10 sm:h-10" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-green-800">EcoSchool</h1>
                <p className="text-xs sm:text-sm text-green-600 hidden sm:block">Экологическое образование</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/auth/login-choice" className="text-gray-700 hover:text-green-600 transition-colors">
                Войти
              </Link>
              <Link href="/auth/register-choice">
                <Button className="bg-green-600 hover:bg-green-700">Регистрация</Button>
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <Link
                    href="/auth/login-choice"
                    className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link href="/auth/register-choice" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Регистрация</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-green-100 text-green-800 hover:bg-green-200 text-xs sm:text-sm">
              <Leaf className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Экологическое образование будущего
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Воспитываем
              <span className="text-green-600 block sm:inline sm:ml-3">эко-сознание</span>
              <span className="block sm:inline sm:ml-3">в школах</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Платформа для школьников, учителей и директоров, которая делает экологическое образование увлекательным
              через игровые механики, челленджи и соревнования между классами.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
              <Link href="/auth/register-choice">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm sm:text-base px-6 sm:px-8"
                >
                  Начать обучение
                </Button>
              </Link>
              <Link href="/auth/login-choice">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 bg-transparent"
                >
                  Войти в систему
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Возможности платформы
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Комплексное решение для экологического образования в школах
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-3 sm:mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
            Готовы начать экологическое путешествие?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам школьников, которые уже делают мир лучше
          </p>
          <Link href="/auth/register-choice">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-sm sm:text-base px-6 sm:px-8">
              Зарегистрироваться сейчас
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image src="/logo-new.png" alt="EcoSchool Logo" width={24} height={24} className="sm:w-8 sm:h-8" />
              <span className="text-lg sm:text-xl font-bold">EcoSchool</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-right">
              © 2024 EcoSchool. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
