"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Trophy, Medal, Award, Crown, Star, Users, School, TrendingUp } from "lucide-react"
import Link from "next/link"

const studentLeaderboard = []
const classLeaderboard = []
const schoolLeaderboard = []

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("students")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/student">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к панели
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <h1 className="text-xl font-bold">Рейтинг</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Экологические чемпионы</h2>
          <p className="text-gray-600">Посмотрите, как вы и ваша школа влияете на охрану окружающей среды.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Ученики
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Классы
            </TabsTrigger>
            <TabsTrigger value="schools" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Школы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Лучшие ученики
                </CardTitle>
                <CardDescription>Индивидуальный рейтинг учеников на основе заработанных эко-очков</CardDescription>
              </CardHeader>
              <CardContent>
                {studentLeaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Рейтинг пока пуст</h3>
                    <p className="text-gray-500">Ученики появятся в рейтинге после записи первых эко-действий</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentLeaderboard.map((student) => (
                      <div
                        key={student.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg border ${
                          student.name === "Демо Ученик"
                            ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-center w-8">{getRankIcon(student.rank)}</div>

                        <Avatar>
                          <AvatarImage
                            src={`/placeholder-40x40.png?height=40&width=40&text=${student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}`}
                          />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{student.name}</h3>
                            {student.name === "Демо Ученик" && <Badge variant="secondary">Вы</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">
                            Grade {student.grade} • {student.school}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-blue-600" />
                            <span className="font-bold">{student.points}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {student.badge}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-blue-600" />
                  Лучшие классы
                </CardTitle>
                <CardDescription>Рейтинг классов на основе суммарных очков учеников</CardDescription>
              </CardHeader>
              <CardContent>
                {classLeaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Рейтинг классов пуст</h3>
                    <p className="text-gray-500">Классы появятся в рейтинге когда ученики начнут зарабатывать очки</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classLeaderboard.map((classData) => (
                      <div key={classData.rank} className="flex items-center gap-4 p-4 rounded-lg border bg-white">
                        <div className="flex items-center justify-center w-8">{getRankIcon(classData.rank)}</div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{classData.name}</h3>
                          <p className="text-sm text-gray-600">
                            {classData.students} учеников • Учитель: {classData.teacher}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-blue-600" />
                            <span className="font-bold">{classData.points}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {Math.round(classData.points / classData.students)} в среднем на ученика
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Лучшие школы
                </CardTitle>
                <CardDescription>Рейтинг школ на основе общего экологического воздействия</CardDescription>
              </CardHeader>
              <CardContent>
                {schoolLeaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Рейтинг школ пуст</h3>
                    <p className="text-gray-500">Школы появятся в рейтинге по мере активности учеников</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schoolLeaderboard.map((school) => (
                      <div
                        key={school.rank}
                        className={`flex items-center gap-4 p-4 rounded-lg border ${
                          school.name === "Школа Зеленая Долина"
                            ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-center w-8">{getRankIcon(school.rank)}</div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{school.name}</h3>
                            {school.name === "Школа Зеленая Долина" && <Badge variant="secondary">Ваша школа</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{school.students} учеников участвует</p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-blue-600" />
                            <span className="font-bold">{school.points.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {Math.round(school.points / school.students)} avg per student
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
