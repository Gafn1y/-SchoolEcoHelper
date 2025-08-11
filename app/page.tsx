"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Leaf, Users, Trophy, Target, Recycle, Lightbulb, Heart, Menu, ArrowRight, Star } from "lucide-react"

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
      title: "Рейтинги",
      description: "Соревнуйтесь с одноклассниками и другими школами",
    },
    {
      icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Командная работа",
      description: "Объединяйтесь в команды для больших проектов",
    },
    {
      icon: <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Обучение",
      description: "Изучайте экологию через практические задания",
    },
  ]

  const stats = [
    { number: "500+", label: "Учеников", icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { number: "50+", label: "Школ", icon: <Leaf className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { number: "1000+", label: "Эко-действий", icon: <Recycle className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { number: "95%", label: "Довольных", icon: <Heart className="h-4 w-4 sm:h-5 sm:w-5" /> },
  ]

  const testimonials = [
    {
      name: "Анна Петрова",
      role: "Ученица 9 класса",
      text: "Благодаря SchoolEcoHelper я стала более осознанно относиться к природе!",
      rating: 5,
    },
    {
      name: "Михаил Иванов",
      role: "Учитель биологии",
      text: "Отличный инструмент для вовлечения учеников в экологическую деятельность.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Image
                src="/logo-new.png"
                alt="SchoolEcoHelper"
                width={32}
                height={32}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="text-lg sm:text-xl font-bold text-green-700">SchoolEcoHelper</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-sm font-medium hover:text-green-600 transition-colors">
                Возможности
              </Link>
              <Link href="#about" className="text-sm font-medium hover:text-green-600 transition-colors">
                О проекте
              </Link>
              <Link href="#contact" className="text-sm font-medium hover:text-green-600 transition-colors">
                Контакты
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/auth/login-choice" className="hidden sm:inline-flex">
                <Button variant="outline" size="sm">
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <span className="hidden sm:inline">Регистрация</span>
                  <span className="sm:hidden">Начать</span>
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <Link
                      href="#features"
                      className="text-lg font-medium hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Возможности
                    </Link>
                    <Link
                      href="#about"
                      className="text-lg font-medium hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      О проекте
                    </Link>
                    <Link
                      href="#contact"
                      className="text-lg font-medium hover:text-green-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Контакты
                    </Link>
                    <div className="pt-4 border-t">
                      <Link href="/auth/login-choice" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full mb-2 bg-transparent">
                          Войти
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button className="w-full bg-green-600 hover:bg-green-700">Регистрация</Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 sm:mb-6">
              <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Экологическое образование
            </Badge>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Сделаем мир <span className="text-green-600">зеленее</span> вместе!
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Платформа для школьников, которая превращает заботу об экологии в увлекательную игру с челленджами,
              рейтингами и наградами.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-base sm:text-lg px-6 sm:px-8"
                >
                  Начать путешествие
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/auth/login-choice">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 bg-transparent"
                >
                  У меня есть аккаунт
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-full text-green-600">{stat.icon}</div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Возможности платформы
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Все инструменты для эффективного экологического образования в одном месте
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="p-3 sm:p-4 bg-green-100 rounded-full text-green-600">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Отзывы пользователей
            </h2>
            <p className="text-base sm:text-lg text-gray-600">Что говорят о нас ученики и учителя</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Готовы начать?</h2>
          <p className="text-base sm:text-lg text-green-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам школьников, которые уже делают мир лучше
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8">
              Зарегистрироваться бесплатно
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <Image src="/logo-new.png" alt="SchoolEcoHelper" width={32} height={32} className="h-8 w-8" />
                <span className="text-lg sm:text-xl font-bold">SchoolEcoHelper</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Делаем экологическое образование увлекательным и доступным для всех.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Платформа</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Возможности
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Регистрация
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login-choice" className="hover:text-white transition-colors">
                    Вход
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Поддержка</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Помощь
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Правовая информация</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Условия использования
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-400">© 2024 SchoolEcoHelper. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
