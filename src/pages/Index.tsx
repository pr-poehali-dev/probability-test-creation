import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Question = {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    id: 1,
    category: 'Классическая формула',
    question: 'На семинар приехали 6 учёных из Норвегии, 5 из России и 9 из Испании. Каждый учёный подготовил один доклад. Порядок докладов определяется случайным образом. Найдите вероятность того, что восьмым окажется доклад учёного из России.',
    options: ['0.15', '0.25', '0.30', '0.40'],
    correctAnswer: 1,
    explanation: 'Всего учёных: 6 + 5 + 9 = 20. Вероятность = 5/20 = 0.25'
  },
  {
    id: 2,
    category: 'Комбинаторика',
    question: 'В урне 6 белых и 4 чёрных шара. Из урны наугад извлекают один шар с возвращением. Какова вероятность, что белый шар будет вынут при первом извлечении?',
    options: ['0.4', '0.5', '0.6', '0.7'],
    correctAnswer: 2,
    explanation: 'Всего шаров: 6 + 4 = 10. Вероятность белого шара = 6/10 = 0.6'
  },
  {
    id: 3,
    category: 'Условная вероятность',
    question: 'В проекте участвуют 7 девушек и 3 юноши. Для выступления случайным образом выбирают докладчика и содокладчика. Найдите вероятность, что докладчиком будет выбрана девушка, а содокладчиком — юноша.',
    options: ['0.17', '0.23', '0.30', '0.35'],
    correctAnswer: 1,
    explanation: 'P(девушка, затем юноша) = (7/10) × (3/9) = 21/90 ≈ 0.23'
  }
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const handleAnswer = (answerIndex: number) => {
    if (answeredQuestions.includes(currentQuestion)) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      toast.success('Правильно!', {
        description: questions[currentQuestion].explanation
      });
    } else {
      toast.error('Неверно', {
        description: questions[currentQuestion].explanation
      });
    }
    
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnsweredQuestions([]);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`;

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 md:p-12 text-center shadow-2xl animate-scale-in">
            <div className="mb-6">
              <Icon name="Award" size={64} className="mx-auto text-accent mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Тест завершён!
              </h1>
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 mb-8">
              <p className="text-6xl font-bold mb-2 text-primary">
                {score}/{questions.length}
              </p>
              <p className="text-xl text-muted-foreground">
                Правильных ответов: {Math.round((score / questions.length) * 100)}%
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg mb-4 text-muted-foreground">Поделиться тестом:</p>
              <img 
                src={qrCodeUrl} 
                alt="QR код теста" 
                className="mx-auto rounded-lg shadow-lg border-4 border-primary/20"
              />
            </div>

            <Button 
              onClick={resetTest} 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg"
            >
              <Icon name="RotateCcw" size={20} className="mr-2" />
              Пройти ещё раз
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = answeredQuestions.includes(currentQuestion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Тест по теории вероятностей
            </h1>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Icon name="Award" size={18} className="mr-2" />
              {score}/{questions.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        <Card className="p-6 md:p-10 shadow-2xl animate-fade-in">
          <Badge 
            className="mb-6 text-sm px-4 py-2"
            style={{ backgroundColor: '#F59E0B', color: 'white' }}
          >
            <Icon name="BookOpen" size={16} className="mr-2" />
            {question.category}
          </Badge>

          <h2 className="text-xl md:text-2xl font-semibold mb-8 leading-relaxed text-foreground">
            {question.question}
          </h2>

          <div className="space-y-4 mb-8">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showCorrect = isAnswered && isCorrect;
              const showIncorrect = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-5 md:p-6 text-left rounded-xl border-2 transition-all duration-300 font-medium text-base md:text-lg
                    ${showCorrect ? 'bg-green-50 border-green-500 text-green-900' : ''}
                    ${showIncorrect ? 'bg-red-50 border-red-500 text-red-900' : ''}
                    ${!isAnswered ? 'hover:border-primary hover:bg-primary/5 hover:scale-[1.02]' : ''}
                    ${!showCorrect && !showIncorrect ? 'bg-white border-gray-200' : ''}
                    ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <Icon name="CheckCircle2" size={24} className="text-green-600" />}
                    {showIncorrect && <Icon name="XCircle" size={24} className="text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="flex justify-end">
              <Button
                onClick={nextQuestion}
                size="lg"
                className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg font-semibold"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>
                    Следующий вопрос
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </>
                ) : (
                  <>
                    Завершить тест
                    <Icon name="CheckCircle" size={20} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        <Card className="mt-6 p-6 bg-white/50 backdrop-blur">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={qrCodeUrl} 
              alt="QR код теста" 
              className="w-32 h-32 rounded-lg shadow-md border-2 border-primary/20"
            />
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Icon name="QrCode" size={20} className="mr-2 text-primary" />
                Поделиться тестом
              </h3>
              <p className="text-sm text-muted-foreground">
                Отсканируйте QR-код, чтобы открыть тест на другом устройстве
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
