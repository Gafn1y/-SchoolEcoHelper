"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Play, BookOpen, Lightbulb, Gamepad2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const lessons = [
  {
    id: 1,
    title: "🌍 Добро пожаловать в мир экологии!",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Учитесь сортировать мусор правильно вместе с нами!</h2>
          <p className="text-lg text-green-600 mb-6">
            Сегодня мы узнаем, как правильно сортировать мусор и помогать нашей планете!
          </p>
        </div>

        {/* YouTube Video Integration */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 text-center justify-center">
              <Play className="h-6 w-6" />
              Обучающее видео: Как правильно сортировать мусор
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full max-w-4xl mx-auto">
              <div
                className="relative w-full overflow-hidden rounded-lg shadow-2xl"
                style={{ paddingBottom: "56.25%" }}
              >
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
            <div className="text-center mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 font-medium mb-2">
                📺 Посмотрите это обучающее видео, чтобы лучше понять основы сортировки мусора!
              </p>
              <p className="text-sm text-green-600">
                Видео поможет вам визуально изучить процесс правильной сортировки отходов
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-3">🎯 Что вы узнаете из этого урока:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-blue-700">Почему важно сортировать мусор</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-blue-700">Какие бывают виды отходов</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-blue-700">Куда выбрасывать разные виды мусора</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-blue-700">Как помочь планете каждый день</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2">💡 Интересный факт!</h3>
          <p className="text-yellow-700">
            Правильная сортировка мусора может сократить количество отходов на свалках на 75%! Каждый из нас может
            внести свой вклад в сохранение окружающей среды.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "♻️ Что такое сортировка мусора?",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">♻️</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Сортировка мусора - это супер важно!</h2>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <p className="text-lg text-green-700 mb-4">
              <strong>Сортировка мусора</strong> - это когда мы разделяем отходы по разным контейнерам в зависимости от
              того, из чего они сделаны.
            </p>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-green-800 mb-3">🌟 Почему это важно?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🌍</div>
                  <span className="text-green-700">Помогаем планете</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🐟</div>
                  <span className="text-green-700">Спасаем животных</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💧</div>
                  <span className="text-green-700">Сохраняем воду</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🌳</div>
                  <span className="text-green-700">Защищаем леса</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 mb-2">🎯 Крутой факт!</h3>
          <p className="text-purple-700">
            Одна пластиковая бутылка разлагается в природе более 400 лет! Но если её правильно переработать, из неё
            можно сделать новую бутылку или даже футболку!
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "🗂️ Виды контейнеров для мусора",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🗂️</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Знакомимся с контейнерами!</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🔵</div>
              <h3 className="font-bold text-blue-800 mb-2">СИНИЙ контейнер</h3>
              <p className="text-blue-700 mb-3">Для бумаги и картона</p>
              <div className="text-sm text-blue-600 space-y-1">
                <p>📰 Газеты и журналы</p>
                <p>📦 Картонные коробки</p>
                <p>📄 Офисная бумага</p>
                <p>📚 Старые книги</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🟡</div>
              <h3 className="font-bold text-yellow-800 mb-2">ЖЁЛТЫЙ контейнер</h3>
              <p className="text-yellow-700 mb-3">Для пластика и металла</p>
              <div className="text-sm text-yellow-600 space-y-1">
                <p>🍼 Пластиковые бутылки</p>
                <p>🥫 Металлические банки</p>
                <p>📦 Пластиковые контейнеры</p>
                <p>🥤 Алюминиевые банки</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🟢</div>
              <h3 className="font-bold text-green-800 mb-2">ЗЕЛЁНЫЙ контейнер</h3>
              <p className="text-green-700 mb-3">Для стекла</p>
              <div className="text-sm text-green-600 space-y-1">
                <p>🍶 Стеклянные бутылки</p>
                <p>🫙 Стеклянные банки</p>
                <p>🥛 Стеклянная посуда</p>
                <p>🍯 Баночки от мёда</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">⚫</div>
              <h3 className="font-bold text-gray-800 mb-2">СЕРЫЙ контейнер</h3>
              <p className="text-gray-700 mb-3">Для остального мусора</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>🍌 Остатки еды</p>
                <p>🧻 Грязная бумага</p>
                <p>🗑️ Смешанный мусор</p>
                <p>🧽 Использованные салфетки</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
          <h3 className="font-bold text-cyan-800 mb-2">🎨 Запомни цвета!</h3>
          <p className="text-cyan-700">
            Каждый цвет контейнера означает определённый вид мусора. Это как радуга чистоты! 🌈
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "📄 Бумага и картон",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Всё о бумаге и картоне!</h2>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-blue-800 mb-4">🔵 В СИНИЙ контейнер идёт:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">📰</div>
                <p className="text-sm text-blue-700">Газеты</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">📖</div>
                <p className="text-sm text-blue-700">Журналы</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">📦</div>
                <p className="text-sm text-blue-700">Коробки</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">📄</div>
                <p className="text-sm text-blue-700">Чистая бумага</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-sm text-blue-700">Старые книги</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm text-blue-700">Картон</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-800 mb-2">❌ НЕ выбрасывай в синий контейнер:</h3>
          <ul className="space-y-1 text-red-700">
            <li>• 🧻 Грязные салфетки и туалетную бумагу</li>
            <li>• 🍕 Коробки от пиццы с жиром</li>
            <li>• 📄 Бумагу с пластиковым покрытием</li>
            <li>• 🎁 Подарочную бумагу с блёстками</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 mb-2">🌟 Супер-факт!</h3>
          <p className="text-green-700">
            Из одной тонны макулатуры можно сделать 750 кг новой бумаги и спасти 17 деревьев! 🌳
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "🍼 Пластик и металл",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🍼</div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Пластик и металл - в жёлтый!</h2>
        </div>

        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-yellow-800 mb-4">🟡 В ЖЁЛТЫЙ контейнер идёт:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-yellow-700 mb-3">🍼 Пластик:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍼</span>
                    <span className="text-yellow-600">Пластиковые бутылки</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🥤</span>
                    <span className="text-yellow-600">Стаканчики от йогурта</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📦</span>
                    <span className="text-yellow-600">Пластиковые контейнеры</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛍️</span>
                    <span className="text-yellow-600">Пластиковые пакеты</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-700 mb-3">🥫 Металл:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🥫</span>
                    <span className="text-yellow-600">Консервные банки</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🥤</span>
                    <span className="text-yellow-600">Алюминиевые банки</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍽️</span>
                    <span className="text-yellow-600">Металлические крышки</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📎</span>
                    <span className="text-yellow-600">Металлические предметы</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">💡 Важно помнить!</h3>
          <ul className="space-y-1 text-blue-700">
            <li>• 🧽 Ополосни контейнеры от остатков еды</li>
            <li>• 🏷️ Можно не снимать этикетки</li>
            <li>• 🔧 Крышки можно оставить на бутылках</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 mb-2">🎯 Крутой факт!</h3>
          <p className="text-purple-700">
            Алюминиевая банка может быть переработана и снова стать банкой всего за 60 дней! ⚡
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "🍶 Стекло",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🍶</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Стекло - в зелёный контейнер!</h2>
        </div>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-green-800 mb-4">🟢 В ЗЕЛЁНЫЙ контейнер идёт:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">🍶</div>
                <p className="text-sm text-green-700">Стеклянные бутылки</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">🫙</div>
                <p className="text-sm text-green-700">Банки от варенья</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">🥛</div>
                <p className="text-sm text-green-700">Стеклянные стаканы</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">🍯</div>
                <p className="text-sm text-green-700">Баночки от мёда</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">🧴</div>
                <p className="text-sm text-green-700">Флаконы от духов</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-3xl mb-2">🍷</div>
                <p className="text-sm text-green-700">Винные бутылки</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-800 mb-2">⚠️ Осторожно!</h3>
          <ul className="space-y-1 text-red-700">
            <li>• 🪟 Оконное стекло - НЕ в зелёный контейнер</li>
            <li>• 🔍 Зеркала - тоже НЕ туда</li>
            <li>• 💡 Лампочки - в специальные пункты приёма</li>
            <li>• 📱 Стекло от телефонов - в электронные отходы</li>
          </ul>
        </div>

        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
          <h3 className="font-bold text-cyan-800 mb-2">✨ Удивительно!</h3>
          <p className="text-cyan-700">
            Стекло можно перерабатывать бесконечно! Оно никогда не теряет своих свойств. Стеклянная бутылка может стать
            новой бутылкой уже через месяц! 🔄
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 7,
    title: "🎉 Поздравляем! Ты эко-герой!",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-800 mb-4">Ура! Ты прошёл весь урок!</h2>
          <p className="text-lg text-green-600">Теперь ты знаешь, как правильно сортировать мусор!</p>
        </div>

        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-300">
          <CardContent className="p-6">
            <h3 className="font-bold text-green-800 mb-4 text-center">🧠 Что ты запомнил:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔵</span>
                  <span className="font-semibold text-blue-800">Синий</span>
                </div>
                <p className="text-sm text-blue-600">Бумага и картон</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🟡</span>
                  <span className="font-semibold text-yellow-800">Жёлтый</span>
                </div>
                <p className="text-sm text-yellow-600">Пластик и металл</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🟢</span>
                  <span className="font-semibold text-green-800">Зелёный</span>
                </div>
                <p className="text-sm text-green-600">Стекло</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚫</span>
                  <span className="font-semibold text-gray-800">Серый</span>
                </div>
                <p className="text-sm text-gray-600">Остальной мусор</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-4 text-center">🏆 Твои достижения:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-4xl mb-2">🌍</div>
              <p className="font-semibold text-yellow-800">Защитник планеты</p>
              <p className="text-sm text-yellow-600">Знаешь, как помочь Земле</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">♻️</div>
              <p className="font-semibold text-yellow-800">Мастер сортировки</p>
              <p className="text-sm text-yellow-600">Умеешь правильно сортировать</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎓</div>
              <p className="font-semibold text-yellow-800">Эко-эксперт</p>
              <p className="text-sm text-yellow-600">Прошёл весь курс обучения</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-green-700">
            Теперь ты можешь научить своих друзей и семью правильно сортировать мусор! 👨‍👩‍👧‍👦
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learning/waste-sorting/game">
              <Button className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                <Gamepad2 className="h-5 w-5 mr-2" />
                Играть в игру
              </Button>
            </Link>
            <Link href="/dashboard/student">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent text-lg px-8 py-3"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Вернуться в дашборд
              </Button>
            </Link>
          </div>
        </div>
      </div>
    ),
  },
]

export default function WasteSortingLearning() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const handleNext = () => {
    if (currentLesson < lessons.length - 1) {
      if (!completedLessons.includes(currentLesson)) {
        setCompletedLessons([...completedLessons, currentLesson])
      }
      setCurrentLesson(currentLesson + 1)
    }
  }

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
    }
  }

  const handleLessonSelect = (lessonIndex: number) => {
    setCurrentLesson(lessonIndex)
  }

  const progress = ((currentLesson + 1) / lessons.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/student">
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-green-800">Сортировка мусора</h1>
                <p className="text-sm text-green-600">
                  Урок {currentLesson + 1} из {lessons.length}
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <BookOpen className="h-3 w-3 mr-1" />
              Обучение
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-800">Прогресс обучения</h3>
              <span className="text-sm text-green-600">{Math.round(progress)}% завершено</span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="flex flex-wrap gap-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(index)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                    index === currentLesson
                      ? "bg-green-600 text-white"
                      : completedLessons.includes(index)
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Content */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-800">{lessons[currentLesson].title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">{lessons[currentLesson].content}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentLesson === 0}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>

          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600">
              Урок {currentLesson + 1} из {lessons.length}
            </span>
          </div>

          {currentLesson < lessons.length - 1 ? (
            <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
              Далее
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Link href="/learning/waste-sorting/game">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Играть в игру
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
