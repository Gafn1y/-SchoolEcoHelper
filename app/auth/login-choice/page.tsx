"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { User, GraduationCap, Building, ArrowLeft, Menu, Users, Shield } from "lucide-react"

export default function LoginChoicePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const roles = [
    {
      id: "student",
      title: "Ученик",
      description: "Участвуй в эко-челленджах, зарабатывай баллы и соревнуйся с одноклассниками",
      icon: <User className="h-8 w-8 sm:h-12 sm:w-12" />,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      features: ["Эко-челленджи", "Рейтинги", "Достижения", "Командная работа"],
    },
    {
      id: "teacher",
      title: "Учитель",
      description: "Управляй классом, создавай задания и отслеживай прогресс учеников",
      icon: <GraduationCap className="h-8 w-8 sm:h-12 sm:w-12" />,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      features: ["Управление классом", "Создание заданий", "Аналитика", "Отчеты"],
    },
    {
      id: "director",
      title: "Директор",
      description: "Контролируй всю школу, анализируй статистику и управляй учителями",
      icon: <Building className="h-8 w-8 sm:h-12 sm:w-12" />,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      features: ["Управление школой", "Статистика", "Управление учителями", "Отчеты"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              <Image
                src="/logo-new.png"
                alt="SchoolEcoHelper"
                width={32}
                height={32}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="text-lg sm:text-xl font-bold text-green-700">SchoolEcoHelper</span>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/register" className="hidden sm:inline-flex">
                <Button variant="outline" size="sm">
                  Регистрация
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <Link
                      href="/"
                      className="text-lg font-medium hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Главная
                    </Link>
                    <Link
                      href="/register"
                      className="text-lg font-medium hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Регистрация
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-3 sm:mb-4">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Безопасный вход
            </Badge>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Выберите свою роль
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Войдите в систему, выбрав подходящую роль. Каждая роль имеет свои возможности и функции.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {roles.map((role) => (
              <Card
                key={role.id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${role.color}`} />

                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div
                      className={`p-3 sm:p-4 ${role.color} rounded-full text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      {role.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">{role.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base mt-2">{role.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-700">Возможности:</h4>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                          <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${role.color} rounded-full mr-2 sm:mr-3`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={`/login?role=${role.id}`} className="block">
                    <Button
                      className={`w-full ${role.color} ${role.hoverColor} text-white text-sm sm:text-base`}
                      size="lg"
                    >
                      Войти как {role.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 sm:mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
                  <h3 className="text-base sm:text-lg font-semibold text-blue-900">Нет аккаунта?</h3>
                </div>
                <p className="text-sm sm:text-base text-blue-700 mb-3 sm:mb-4">
                  Зарегистрируйтесь, чтобы начать свое экологическое путешествие
                </p>
                <Link href="/register">
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
                    Создать аккаунт
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500">
              Нужна помощь?{" "}
              <Link href="#" className="text-green-600 hover:text-green-700 underline">
                Свяжитесь с поддержкой
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
