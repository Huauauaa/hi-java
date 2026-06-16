import type { FC } from 'react';
import { useHashRoute } from './useHashRoute';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { RoutePage } from './pages/RoutePage';

const App: FC = () => {
  const { path, navigate } = useHashRoute('/');

  const quizMatch = path.match(/^\/java-route\/(\d{2})$/);
  if (quizMatch) {
    return <QuizPage chapterId={quizMatch[1]} navigate={navigate} />;
  }
  if (path === '/java-route') {
    return <RoutePage navigate={navigate} />;
  }
  return <HomePage navigate={navigate} />;
};

export default App;
