"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Trophy,
  Target,
  ArrowRight,
  Star,
  Recycle,
  TreePine,
  Droplets,
  GraduationCap,
  Building,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: Target,
      title: "Эко-челленджи",
      description: "Участвуйте в экологических вызовах и соревнуйтесь с одноклассниками",
    },
    {
      icon: Trophy,
      title: "Система очков",
      description: "Зарабатывайте очки за экологические действия и поднимайтесь в рейтинге",
    },
    {
      icon: Users,
      title: "Командная работа",
      description: "Работайте вместе с классом для достижения общих экологических целей",
    },
    {
      icon: Star,
      title: "Достижения",
      description: "Получайте значки и награды за свои экологические достижения",
    },
  ]

  const ecoActions = [
    {
      icon: Recycle,
      name: "Переработка",
      description: "Сортировка и переработка отходов",
      points: "5-15 очков",
    },
    {
      icon: TreePine,
      name: "Озеленение",
      description: "Посадка деревьев и уход за растениями",
      points: "20-50 очков",
    },
    {
      icon: Droplets,
      name: "Экономия воды",
      description: "Рациональное использование водных ресурсов",
      points: "10-25 очков",
    },
  ]

  const roles = [
    {
      icon: Building,
      title: "Директора",
      description: "Управляйте экологической программой всей школы",
      color: "purple",
    },
    {
      icon: GraduationCap,
      title: "Учителя",
      description: "Ведите свои классы к экологическим достижениям",
      color: "green",
    },
    {
      icon: Users,
      title: "Ученики",
      description: "Участвуйте в челленджах и зарабатывайте очки",
      color: "blue",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
            <span className="text-2xl font-bold text-blue-900">EcoSchool</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login-choice">
              <Button variant="outline">Войти</Button>
            </Link>
            <Link href="/auth/register-choice">
              <Button className="bg-blue-600 hover:bg-blue-700">Регистрация</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            🌱 Экологическое образование для всех
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Превратите свою школу в
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-green-600">
              {" "}
              эко-лидера
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Платформа для школ, которая мотивирует учеников заботиться об окружающей среде через игровые механики,
            челленджи и командную работу
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register-choice">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-3"
              >
                Начать бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login-choice">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
                Войти в систему
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Как это работает</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            EcoSchool превращает экологическое образование в увлекательную игру с реальным воздействием на окружающую
            среду
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Eco Actions Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 rounded-3xl mx-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Экологические действия</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ученики зарабатывают очки за реальные экологические действия, которые помогают планете
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ecoActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <action.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">{action.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-3">{action.description}</CardDescription>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {action.points}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Для всех участников образовательного процесса</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            EcoSchool объединяет директоров, учителей и учеников в общей экологической миссии
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow border-2 hover:border-${role.color}-300`}>
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 p-4 bg-${role.color}-100 rounded-full w-fit`}>
                  <role.icon className={`h-10 w-10 text-${role.color}-600`} />
                </div>
                <CardTitle className="text-xl">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-center">{role.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 via-cyan-600 to-green-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Готовы начать экологическое путешествие?</h2>
            <p className="text-xl mb-8 opacity-90">Присоединяйтесь к тысячам школ, которые уже делают мир лучше</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register-choice">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                  Зарегистрировать школу
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login-choice">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-3 bg-transparent"
                >
                  Войти в систему
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <img src="/logo-new.png" alt="EcoSchool" className="h-8 w-8" />
            <span className="text-lg font-semibold text-gray-800">EcoSchool</span>
          </div>
          <div className="text-sm text-gray-600">© 2024 EcoSchool. Делаем образование экологичным.</div>
        </div>
      </footer>
    </div>
  )
}
